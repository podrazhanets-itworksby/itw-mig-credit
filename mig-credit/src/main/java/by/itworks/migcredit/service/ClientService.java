package by.itworks.migcredit.service;

import by.itworks.migcredit.dto.ApplicationDto;
import by.itworks.migcredit.dto.ClientNotificationData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClientService {
	public ClientNotificationData generateInfoForNotification(ApplicationDto application) {
		var data = new ClientNotificationData();
		data.sex = application.sex;
		data.maskedPhone = "+375" + application.phone.substring(0, 3) + "***" + application.phone.substring(6, 9);
		data.name = application.lastname + " " + application.firstname + (application.patronymic != null ? (" " + application.patronymic) : "");
		return data;
	}
}