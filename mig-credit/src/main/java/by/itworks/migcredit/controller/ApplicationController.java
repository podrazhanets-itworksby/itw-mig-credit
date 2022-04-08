package by.itworks.migcredit.controller;

import by.itworks.migcredit.dto.ApplicationDto;
import by.itworks.migcredit.service.ApplicationService;
import by.itworks.migcredit.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.UUID;

@Controller
@RequestMapping(value = "api")
@RequiredArgsConstructor
public class ApplicationController {
	private final ApplicationService applicationService;
	private final ClientService clientService;
	private final SimpMessagingTemplate simpMessagingTemplate;

	@RequestMapping(value = "/operator/{sessionId}/save-application", method = RequestMethod.POST)
	public ResponseEntity<Void> saveApplication(@PathVariable("sessionId") UUID sessionId, @RequestBody ApplicationDto application) {
		applicationService.saveApplication(application, sessionId);
		simpMessagingTemplate.convertAndSend("/client-notification/output/" + sessionId, clientService.generateInfoForNotification(application));
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
