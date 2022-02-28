package by.itworks.migcredit.controller;

import by.itworks.migcredit.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "api")
@RequiredArgsConstructor
public class WsController {
	private final ClientService clientService;
	private final SimpMessagingTemplate simpMessagingTemplate;

	@MessageMapping("/ws/update/websocket")
	public void send(String data) {
		System.out.println(data);
		simpMessagingTemplate.convertAndSend("/topic/output/", data);
	}
}
