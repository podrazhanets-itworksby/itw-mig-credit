package by.itworks.migcredit.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class NewData {
	public String sessionId;
	public String fieldName;
	public String fieldValue;
}
