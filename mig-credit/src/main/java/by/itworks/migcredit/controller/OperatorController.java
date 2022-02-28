package by.itworks.migcredit.controller;

import by.itworks.migcredit.service.OperatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "api")
@RequiredArgsConstructor
public class OperatorController {
	private final OperatorService operatorService;

//	@RequestMapping(value = "/session/{sessionId}/get-data-to-join", method = RequestMethod.GET)
//	public ResponseEntity<SessionData> getDataToJoinTheSession(@PathVariable("sessionId") UUID sessionId) {
//		return new ResponseEntity<>(operatorService.getDataToJoinTheSession(sessionId), HttpStatus.OK);
//	}
//
//	@RequestMapping(value = "/session/{sessionId}/disconnect-client", method = RequestMethod.POST)
//	public ResponseEntity<Void> disconnectClientFromSession(@PathVariable("sessionId") UUID sessionId) {
//		operatorService.disconnectClientFromSession(sessionId);
//		return new ResponseEntity<>(HttpStatus.OK);
//	}
//
//	@RequestMapping(value = "/session/{sessionId}/disconnect-listener", method = RequestMethod.GET)
//	public SseEmitter setDisconnectListener(@PathVariable("sessionId") UUID sessionId) {
//		SseEmitter sse = new SseEmitter();
//		operatorService.setDisconnectListener(sessionId, sse);
//		return sse;
//	}
}
