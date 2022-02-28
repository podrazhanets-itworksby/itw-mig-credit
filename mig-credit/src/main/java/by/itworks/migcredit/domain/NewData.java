package by.itworks.migcredit.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class NewData {
	private String sessionId;
	private String fieldName;
	private String fieldValue;

	public NewData(){}

	public NewData(String sessionId, String fieldName, String fieldValue) {
		this.sessionId = sessionId;
		this.fieldName = fieldName;
		this.fieldValue = fieldValue;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public String getFieldName() {
		return fieldName;
	}

	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}

	public String getFieldValue() {
		return fieldValue;
	}

	public void setFieldValue(String fieldValue) {
		this.fieldValue = fieldValue;
	}

	@Override
	public String toString() {
		return "NewData{" +
				"sessionId='" + sessionId + '\'' +
				", fieldName='" + fieldName + '\'' +
				", fieldValue='" + fieldValue + '\'' +
				'}';
	}
}
