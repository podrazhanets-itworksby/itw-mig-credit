package by.itworks.migcredit.dto;

import by.itworks.migcredit.enums.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ApplicationDto {
	public String firstname;
	public String lastname;
	public String patronymic;
	public Sex sex;
	public LocalDate birthday;
	public DocType document;
	public String persNumber;
	public String docNumber;
	public LocalDate validTo;
	public Education education;
	public String address;
	public String phone;
	public String phone2;
	public MaritalStatus maritalStatus;
	public Children children;
	public String organization;
	public String position;
	public Experience experience;
	public BigDecimal averageIncome;
}
