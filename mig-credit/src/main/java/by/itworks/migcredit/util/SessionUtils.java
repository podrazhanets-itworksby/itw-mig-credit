package by.itworks.migcredit.util;

import by.itworks.migcredit.enums.SessionStatus;
import io.openvidu.java.client.Session;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.annotation.PostConstruct;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

@Component
public class SessionUtils {

	private final Map<UUID, SessionInfo> sessions = new ConcurrentHashMap<>();
	private final Set<UUID> reservedSessionsIds = ConcurrentHashMap.newKeySet();
	private final ConcurrentLinkedQueue<SessionInfo> freeSessionsQueue = new ConcurrentLinkedQueue<>();

	@Value("${open.vidu.session.reserved.time:30}")
	private Long sessionReserveMaxTime;

	/**
	 * Таймер следящий за "зарезервированными" сессиями
	 * Если с момента резервирования сессии прошло более чем sessionReserveMaxTime,
	 * то возвращаем сессию в очередь свободных сессий
	 */
	@PostConstruct
	private void init() {
		TimerTask task = new TimerTask() {
			public void run() {
				for (UUID sessionId : reservedSessionsIds) {
					var sessionInfo = sessions.get(sessionId);
					Duration duration = Duration.between(sessionInfo.getReserveDateTime(), LocalDateTime.now());
					if (duration.get(ChronoUnit.SECONDS) > sessionReserveMaxTime) {
						freeSession(sessionId);
					}

				}
			}
		};
		Timer timer = new Timer("Check reserved sessions");

		long delay = sessionReserveMaxTime;
		timer.schedule(task, 0, delay);
	}


	/**
	 * Получить информацию о сессии по идентификатору
	 *
	 * @param sessionId идентификатор сессии
	 * @return Найденная сессия или null
	 */
	public SessionInfo getSessionInfo(UUID sessionId) {
		return sessions.get(sessionId);
	}

	/**
	 * Создание объекта с информацией о сессии и сохранение данного объекта
	 *
	 * @param sessionId Идентификатор сессии
	 * @param session   OpenVidu сессия
	 * @return Созданный объект с информацией о сессии
	 */
	public SessionInfo addSession(UUID sessionId, Session session, String token) {
		var sessionInfo = new SessionInfo(sessionId, session, SessionStatus.FREE, null);
		sessionInfo.setModeratorToken(token);
		sessions.put(sessionId, sessionInfo);
		return sessionInfo;
	}

	/**
	 * Удаление сессии с очереди свободных сессий и с хранилища
	 *
	 * @param sessionId Идентификатор сессии
	 */
	public void removeSession(UUID sessionId) {
		var sessionInfo = sessions.get(sessionId);
		freeSessionsQueue.remove(sessionInfo);
		sessions.remove(sessionId);
	}

	/**
	 * Добавить сессию в очередь свободных сессий
	 *
	 * @param sessionInfo Информация о сессии
	 */
	public void addFreeSession(SessionInfo sessionInfo) {
		freeSessionsQueue.add(sessionInfo);

	}

	/**
	 * Занять сессию. Смена статуса на BUSY
	 *
	 * @param sessionId Идентификатор сессии
	 */
	public void takeSession(UUID sessionId) {
		var sessionInfo = sessions.get(sessionId);
		sessionInfo.setStatus(SessionStatus.BUSY);
		sessionInfo.setReserveDateTime(null);
		reservedSessionsIds.remove(sessionId);
	}

	/**
	 * Резервирование сессии. Берется первая свободная сессия, данной сессии присваивается статус RESERVED
	 *
	 * @return Идентификатор зарезервированной сессии
	 */
	public UUID reserveSession() {
		return reserveSession(null);
	}

	/**
	 * Резервирование сессии. Берется сессия по id, данной сессии присваивается статус RESERVED
	 * Если вместо идентификатора передать null, то будет взята первая свободная сессия из очереди
	 *
	 * @param sessionId Идентификатор сессии
	 * @return Идентификатор зарезервированной сессии
	 */
	public UUID reserveSession(UUID sessionId) {

		var sessionInfo = sessionId == null ? freeSessionsQueue.poll() : sessions.get(sessionId);
		if (sessionInfo != null) {
			if (sessionId != null) {
				// Так как взяли сессию из Map, то необходимо удалить ее из очереди
				freeSessionsQueue.remove(sessionInfo);
			}
			sessionInfo.setStatus(SessionStatus.RESERVED);
			sessionInfo.setReserveDateTime(LocalDateTime.now());
			reservedSessionsIds.add(sessionInfo.getSessionId());
			return sessionInfo.getSessionId();
		}
		return null;
	}

	/**
	 * Освободить сессию. Присваивается статус FREE
	 *
	 * @param sessionId Идентификатор сессии которую необходимо освободить
	 */
	public void freeSession(UUID sessionId) {
		var sessionInfo = sessions.get(sessionId);
		sessionInfo.setStatus(SessionStatus.FREE);
		sessionInfo.setReserveDateTime(null);
		freeSessionsQueue.add(sessionInfo);
		reservedSessionsIds.remove(sessionId);
	}

	/**
	 * Данные о сессии
	 */
	public class SessionInfo {
		private final UUID sessionId;
		private final Session session;
		private SessionStatus status;
		private LocalDateTime reserveDateTime;
		private String moderatorToken;
		private String publisherToken;
		private SseEmitter publisherSse;
		private String recordingId;

		private SessionInfo(UUID sessionId, Session session, SessionStatus status, LocalDateTime reserveDateTime) {
			this.sessionId = sessionId;
			this.session = session;
			this.status = status;
			this.reserveDateTime = reserveDateTime;
		}

		public UUID getSessionId() {
			return sessionId;
		}

		public Session getSession() {
			return session;
		}

		public SessionStatus getStatus() {
			return status;
		}

		private void setStatus(SessionStatus status) {
			this.status = status;
		}

		public LocalDateTime getReserveDateTime() {
			return reserveDateTime;
		}

		public void setReserveDateTime(LocalDateTime reserveDateTime) {
			this.reserveDateTime = reserveDateTime;
		}

		public String getModeratorToken() {
			return moderatorToken;
		}

		public void setModeratorToken(String moderatorToken) {
			this.moderatorToken = moderatorToken;
		}

		public String getPublisherToken() {
			return publisherToken;
		}

		public void setPublisherToken(String publisherToken) {
			this.publisherToken = publisherToken;
		}

		public SseEmitter getPublisherSse() {
			return publisherSse;
		}

		public void setPublisherSse(SseEmitter publisherSse) {
			this.publisherSse = publisherSse;
		}

		public String getRecordingId() {
			return recordingId;
		}

		public void setRecordingId(String recordingId) {
			this.recordingId = recordingId;
		}
	}
}
