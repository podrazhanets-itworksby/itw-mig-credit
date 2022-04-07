package by.itworks.migcredit.dto;

import java.util.UUID;

public class ConfirmationResponse {
	public UUID sessionId;
	public Boolean isConfirmed;

	public ConfirmationResponse() {

	}

	public ConfirmationResponse(UUID sessionId, Boolean isConfirmed) {
		this.sessionId = sessionId;
		this.isConfirmed = isConfirmed;
	}
}
