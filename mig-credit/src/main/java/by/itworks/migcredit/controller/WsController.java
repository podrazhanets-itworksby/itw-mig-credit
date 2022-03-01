package by.itworks.migcredit.controller;

import by.itworks.migcredit.domain.NewData;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WsController {
	private final SimpMessagingTemplate simpMessagingTemplate;

	@MessageMapping({"/new-data"})
	public void sendNewDataToClient(@Payload NewData newData) {
		simpMessagingTemplate.convertAndSend("/topic/output/" + newData.sessionId, newData);
	}
}
