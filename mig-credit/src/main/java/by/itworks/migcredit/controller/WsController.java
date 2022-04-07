package by.itworks.migcredit.controller;

import by.itworks.migcredit.dto.ConfirmationRequest;
import by.itworks.migcredit.dto.ConfirmationResponse;
import by.itworks.migcredit.dto.NewDataDto;
import by.itworks.migcredit.dto.SessionId;
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
	public void sendNewDataToClient(@Payload NewDataDto newData) {
		simpMessagingTemplate.convertAndSend("/new-data/output/" + newData.sessionId, newData);
	}

	@MessageMapping({"/confirmation-request"})
	public void sendConfirmationRequestToClient(@Payload SessionId sessionId) {

		var request = new ConfirmationRequest("настоящим удостоверяю правдивость и полноту предоставленной мною информации. " +
				"Согласен на проверку, сбор, поиск, обработку, накопление, хранение, использование и совершение иных действий с " +
				"сообщенными мною данными и сведениями, указанными в данном документе. ");
		simpMessagingTemplate.convertAndSend("/confirmation-request/output/" + sessionId.id, request);
	}

	@MessageMapping({"/confirmation-response"})
	public void sendConfirmationResponseToOperator(@Payload ConfirmationResponse confirmationResponse) {
		simpMessagingTemplate.convertAndSend("/confirmation-response/output/" + confirmationResponse.sessionId, confirmationResponse);
	}
}
