package by.itworks.migcredit.controller;

import by.itworks.migcredit.service.VideoRecorderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.UUID;

@Controller
@RequestMapping(value = "api")
@RequiredArgsConstructor
public class RecorderController {
	private final VideoRecorderService videoRecorderService;

	@RequestMapping(value = "/recorder/{sessionId}/record-video", method = RequestMethod.POST)
	public ResponseEntity<Void> recordVideo(@PathVariable("sessionId") UUID sessionId) {
		videoRecorderService.startRecording(sessionId);
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
