package by.itworks.migcredit.model;

import by.itworks.migcredit.enums.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "application")
public class Application {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "session_id", nullable = false, updatable = false)
	private UUID sessionId;

	@Column(name = "firstname", nullable = false)
	private String firstname;

	@Column(name = "lastname", nullable = false)
	private String lastname;

	@Column(name = "patronymic")
	private String patronymic;

	@Enumerated(EnumType.STRING)
	@Column(name = "sex", nullable = false)
	private Sex sex;

	@Column(name = "birthday", nullable = false)
	private LocalDate birthday;

	@Enumerated(EnumType.STRING)
	@Column(name = "document", nullable = false)
	private DocType document;

	@Column(name = "pers_number", nullable = false)
	private String persNumber;

	@Column(name = "doc_number", nullable = false)
	private String docNumber;

	@Column(name = "valid_to", nullable = false)
	private LocalDate validTo;

	@Enumerated(EnumType.STRING)
	@Column(name = "education", nullable = false)
	private Education education;

	@Column(name = "address", nullable = false)
	private String address;

	@Column(name = "phone", nullable = false)
	private String phone;

	@Column(name = "phone2")
	private String phone2;

	@Enumerated(EnumType.STRING)
	@Column(name = "marital_status", nullable = false)
	private MaritalStatus maritalStatus;

	@Enumerated(EnumType.STRING)
	@Column(name = "children", nullable = false)
	private Children children;

	@Column(name = "organization", nullable = false)
	private String organization;

	@Column(name = "position", nullable = false)
	private String position;

	@Enumerated(EnumType.STRING)
	@Column(name = "experience", nullable = false)
	private Experience experience;

	@Column(name = "average_income", nullable = false)
	private BigDecimal averageIncome;

	@Column(name = "created", nullable = false, updatable = false)
	private LocalDateTime created;

	@PrePersist
	public void setCreated() {
		setCreated(LocalDateTime.now());
	}
}
