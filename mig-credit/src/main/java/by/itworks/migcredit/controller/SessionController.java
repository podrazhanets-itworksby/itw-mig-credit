package by.itworks.migcredit.controller;

import by.itworks.migcredit.dto.SessionData;
import by.itworks.migcredit.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.UUID;

@Controller
@RequestMapping(value = "api")
@RequiredArgsConstructor
public class SessionController {
	private final SessionService sessionService;

	@RequestMapping(value = "/session/create", method = RequestMethod.POST)
	public ResponseEntity<SessionData> createSession() {
		return new ResponseEntity<>(sessionService.createSession(), HttpStatus.OK);
	}

	@RequestMapping(value = "/{uniqueId}/session/get-free", method = RequestMethod.GET)
	public SseEmitter getFreeSession(@PathVariable("uniqueId") UUID uniqueId) {
		SseEmitter sse = new SseEmitter();
		sessionService.getFreeSession(uniqueId, sse);
		return sse;
	}

	@RequestMapping(value = "/{uniqueId}/session/end-waiting", method = RequestMethod.POST)
	public ResponseEntity<Void> endWaiting(@PathVariable("uniqueId") UUID uniqueId) {
		sessionService.endWaiting(uniqueId);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/session/{sessionId}/get-data-to-join", method = RequestMethod.GET)
	public ResponseEntity<SessionData> getDataToJoinTheSession(@PathVariable("sessionId") UUID sessionId) {
		return new ResponseEntity<>(sessionService.getDataToJoinTheSession(sessionId), HttpStatus.OK);
	}

	@RequestMapping(value = "/session/{sessionId}/disconnect-operator", method = RequestMethod.POST)
	public ResponseEntity<Void> disconnectOperatorFromSession(@PathVariable("sessionId") UUID sessionId) {
		sessionService.disconnectOperatorFromSession(sessionId);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/session/{sessionId}/disconnect-client", method = RequestMethod.POST)
	public ResponseEntity<Void> disconnectClientFromSession(@PathVariable("sessionId") UUID sessionId) {
		sessionService.disconnectClientFromSession(sessionId);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/session/{sessionId}/disconnect-listener", method = RequestMethod.GET)
	public SseEmitter setDisconnectListener(@PathVariable("sessionId") UUID sessionId) {
		SseEmitter sse = new SseEmitter();
		sessionService.setDisconnectListener(sessionId, sse);
		return sse;
	}
}
