package by.itworks.migcredit.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

import static javax.persistence.GenerationType.IDENTITY;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "file")
public class File {
	@Id
	@GeneratedValue(strategy = IDENTITY)
	private Long id;

	@Column(name = "session_id", nullable = false, updatable = false)
	private UUID sessionId;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "data", nullable = false)
	private byte[] data;

	@Column(name = "content_type", nullable = false)
	private String contentType;

	@Column(name = "size", nullable = false)
	private Long size;

	@Column(name = "created", nullable = false, updatable = false)
	private OffsetDateTime created;

	@Column(name = "updated", nullable = false)
	private OffsetDateTime updated;

	@Column(name = "archived")
	private OffsetDateTime archived;

	@PrePersist
	public void onPrePersist() {
		OffsetDateTime offsetDateTime = OffsetDateTime.now();
		this.setCreated(offsetDateTime);
		this.setUpdated(offsetDateTime);
	}

	@PreUpdate
	public void onPreUpdate() {
		this.setUpdated(OffsetDateTime.now());
	}
}
