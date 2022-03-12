package by.itworks.migcredit.service;

import by.itworks.migcredit.dto.ApplicationDto;
import by.itworks.migcredit.model.Application;
import by.itworks.migcredit.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OperatorService {

	private final ApplicationRepository applicationRepository;

	public void saveApplication(ApplicationDto dto, UUID sessionId) {
		Application app = new Application();
		app.setFirstname(dto.firstname);
		app.setLastname(dto.lastname);
		app.setPatronymic(dto.patronymic);
		app.setSex(dto.sex);
		app.setBirthday(dto.birthday);
		app.setDocument(dto.document);
		app.setPersNumber(dto.persNumber);
		app.setDocNumber(dto.docNumber);
		app.setValidTo(dto.validTo);
		app.setEducation(dto.education);
		app.setAddress(dto.address);
		app.setPhone("+375" + dto.phone);
		app.setPhone2(dto.phone2 != null ? "+375" + dto.phone2 : null);
		app.setMaritalStatus(dto.maritalStatus);
		app.setChildren(dto.children);
		app.setOrganization(dto.organization);
		app.setPosition(dto.position);
		app.setExperience(dto.experience);
		app.setAverageIncome(dto.averageIncome);
		app.setSessionId(sessionId);

		applicationRepository.save(app);
	}

}