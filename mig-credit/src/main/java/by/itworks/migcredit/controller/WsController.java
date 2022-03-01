package by.itworks.migcredit.controller;

import by.itworks.migcredit.domain.NewData;
import by.itworks.migcredit.service.ClientService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
public class WsController {
	private final ClientService clientService;
	private final SimpMessagingTemplate simpMessagingTemplate;

	@MessageMapping({"/new-data"})
	public void sendNewDataToClient(@Payload String data) throws JsonProcessingException {
		data = data.substring(1, data.length() - 1).replaceAll("\\\\", "");
		System.out.println(data);
		ObjectMapper mapper = new ObjectMapper();
		NewData newData = mapper.readValue(data, NewData.class);
		simpMessagingTemplate.convertAndSend("/topic/send/", data);
	}
}
