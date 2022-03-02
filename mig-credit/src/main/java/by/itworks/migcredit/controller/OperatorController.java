package by.itworks.migcredit.controller;

import by.itworks.migcredit.dto.ApplicationDto;
import by.itworks.migcredit.service.OperatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.UUID;

@Controller
@RequestMapping(value = "api")
@RequiredArgsConstructor
public class OperatorController {
	private final OperatorService operatorService;

	@RequestMapping(value = "/operator/{sessionId}/save-application", method = RequestMethod.POST)
	public ResponseEntity<Void> disconnectClientFromSession(@PathVariable("sessionId") UUID sessionId, @RequestBody ApplicationDto application) {
		operatorService.saveApplication(application, sessionId);
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
