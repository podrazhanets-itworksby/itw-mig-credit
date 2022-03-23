package by.itworks.migcredit.service;

import by.itworks.migcredit.util.SessionUtils;
import io.openvidu.java.client.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class VideoRecorderService {

	private final SessionUtils sessionUtils;

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
	 * Начать запись сессии
	 *
	 * @return Recording object
	 */
	public Recording startRecording(UUID sessionId) {
		var sessionInfo = sessionUtils.getSessionInfo(sessionId);
		try {
			Recording recording = openVidu.startRecording(sessionInfo.getSession().getSessionId(),
					getRecorderProperty(sessionInfo.getSessionId()));
			sessionInfo.setRecordingId(recording.getId());
			return recording;
		} catch (OpenViduJavaClientException | OpenViduHttpException e) {
			log.error("Ошибка записи видео {}", e);
			return null;
		}
	}

	public Recording stopRecording(SessionUtils.SessionInfo sessionInfo, OpenVidu openVidu) {
		try {
			return openVidu.stopRecording(sessionInfo.getRecordingId());
		} catch (OpenViduJavaClientException | OpenViduHttpException e) {
			log.error("Ошибка остановки видео {}", e);
			return null;
		}
	}

	public RecordingProperties getRecorderProperty(UUID sessionId) {
		return new RecordingProperties.Builder()
				.name(sessionId.toString())
				.outputMode(Recording.OutputMode.COMPOSED)
				.recordingLayout(RecordingLayout.BEST_FIT)
				.resolution("1280x720")
				.frameRate(24)
				.hasAudio(true)
				.hasVideo(true)
				.build();
	}
}