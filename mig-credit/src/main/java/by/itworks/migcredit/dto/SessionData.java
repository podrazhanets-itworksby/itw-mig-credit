package by.itworks.migcredit.dto;

import java.util.UUID;

public class SessionData {
	public UUID sessionId;
	public String token;

	public SessionData() {
	}

	public SessionData(UUID sessionId, String token) {
		this.sessionId = sessionId;
		this.token = token;
	}
}
