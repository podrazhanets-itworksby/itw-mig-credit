package by.itworks.migcredit.service;

import by.itworks.migcredit.dto.SessionData;
import by.itworks.migcredit.util.SessionUtils;
import by.itworks.migcredit.util.SseUtils;
import io.openvidu.java.client.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.annotation.PostConstruct;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SessionService {

	private final SessionUtils sessionUtils;
	private final SseUtils sseUtils;
	private final by.itworks.migcredit.service.VideoRecorderService videoRecorderService;

	private OpenVidu openVidu;
	@Value("${open.vidu.secret}")
	String secret;

	@Value("${open.vidu.url}")
	String openViduUrl;

	@PostConstruct
	public void init() {
		openVidu = new OpenVidu(openViduUrl, secret);
	}

	/**
	 * Метод создания сессии. Вызывается оператором
	 *
	 * @return Данные созданной сессии
	 */
	public SessionData createSession() {
		UUID sessionId = UUID.randomUUID();

		ConnectionProperties connectionProperties = new ConnectionProperties.Builder().type(ConnectionType.WEBRTC)
				.role(OpenViduRole.MODERATOR).build();

		try {
			SessionProperties sessionProperties = new SessionProperties.Builder()
					.recordingMode(RecordingMode.MANUAL)
					.forcedVideoCodec(VideoCodec.VP8)
					.defaultRecordingProperties(videoRecorderService.getRecorderProperty(sessionId))
					.build();
			Session session = this.openVidu.createSession(sessionProperties);
			String token = session.createConnection(connectionProperties).getToken();

			var sessionInfo = sessionUtils.addSession(sessionId, session, token);

			SseEmitter emitter = sseUtils.getEmitterFromQueue();
			if (emitter != null) {
				sessionUtils.reserveSession(sessionId);
				emitter.send(sessionId);
				emitter.complete();
			} else {
				sessionUtils.addFreeSession(sessionInfo);
			}
			return new SessionData(sessionId, token);

		} catch (Exception e) {
			log.error("Ошибка создания сессии оператором", e);
			throw new RuntimeException(e);
		}
	}

	/**
	 * Получение идентификатора свободной сессии и отправка его клиенту
	 *
	 * @param uniqueId   Уникальный идентификатор клиента
	 * @param sseEmitter Эмиттер для отправки сообщения
	 */
	public void getFreeSession(UUID uniqueId, SseEmitter sseEmitter) {
		UUID sessionId = sessionUtils.reserveSession();
		if (sessionId != null) {
			try {
				sseEmitter.send(sessionId);
				sseEmitter.complete();
			} catch (Exception e) {
				log.error("Ошибка при отправке идентификатора свободной сессии клиенту", e);
				sessionUtils.freeSession(sessionId);
			}
		} else {
			sseUtils.addEmitter(uniqueId, sseEmitter);
		}
	}

	/**
	 * Отмена ожидания свободной сессии
	 *
	 * @param uniqueId Уникальный идентификатор клиента
	 */
	public void endWaiting(UUID uniqueId) {
		var emitter = sseUtils.getEmitter(uniqueId);
		if (emitter != null) {
			try {
				sseUtils.removeEmitter(uniqueId);
				emitter.send("");
				emitter.complete();
			} catch (Exception e) {
				log.error("Ошибка отмены ожидания свободной сессии", e);
			}
		}
	}

	/**
	 * Получение данных для присоединения к существующей сессии. Вызывается клиентом
	 *
	 * @param sessionId Идентификатор существующей сессии
	 * @return Данные для подключения к сессии
	 */
	public SessionData getDataToJoinTheSession(UUID sessionId) {
		var sessionInfo = sessionUtils.getSessionInfo(sessionId);
		if (sessionInfo == null || sessionInfo.getSession() == null) {
			throw new RuntimeException("SessionNot found");
		}

		ConnectionProperties connectionProperties = new ConnectionProperties.Builder().type(ConnectionType.WEBRTC)
				.role(OpenViduRole.PUBLISHER).build();
		try {
			String token = sessionInfo.getSession().createConnection(connectionProperties).getToken();
			sessionUtils.getSessionInfo(sessionId).setPublisherToken(token);
			sessionUtils.takeSession(sessionId);
			return new SessionData(sessionId, token);
		} catch (Exception e) {
			log.error("Ошибка при получении данных сессии клиентом для подключения", e);
			throw new RuntimeException(e);
		}
	}

	/**
	 * Отключение оператора от сессии
	 *
	 * @param sessionId Идентификатор сессии от которой отключился оператор
	 */
	public void disconnectOperatorFromSession(UUID sessionId) {
		try {
			var sessionInfo = sessionUtils.getSessionInfo(sessionId);
			videoRecorderService.stopRecording(sessionInfo, openVidu);
			var emitter = sessionInfo.getPublisherSse();
			if (emitter != null) {
				emitter.send(true);
				emitter.complete();
			}
			sessionUtils.removeSession(sessionId);
		} catch (Exception e) {
			log.error("Ошибка отключения оператора от сессии", e);
		}
	}

	/**
	 * Отключение клиента от сессии
	 *
	 * @param sessionId Идентификатор сессии от которой отключился клиент
	 */
	public void disconnectClientFromSession(UUID sessionId) {
		try {
			var sessionInfo = sessionUtils.getSessionInfo(sessionId);
			if (sessionInfo != null) {
//				videoRecorderService.stopRecording(sessionInfo, openVidu);
				var emitter = sessionInfo.getPublisherSse();
				if (emitter != null) {
					emitter.send(true);
					emitter.complete();
					sessionInfo.setPublisherSse(null);
				}
			}
		} catch (Exception e) {
			log.error("Ошибка отключения клиента от сессии", e);
		}
	}

	/**
	 * Установка слушателя на сессию. Реагирует на разрыв сессии со стороны оператора.
	 * В этом случае клиенту отправляется сообщение о необходимости отключения от сессии
	 *
	 * @param sessionId Идентификатор сессии
	 * @param sse       sseEmitter для отправки сообщения о разрыве сессии
	 */
	public void setDisconnectListener(UUID sessionId, SseEmitter sse) {
		sessionUtils.getSessionInfo(sessionId).setPublisherSse(sse);
	}
}