package by.itworks.migcredit.controller;

import by.itworks.migcredit.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "api")
@RequiredArgsConstructor
public class ClientController {
	private final ClientService clientService;


}
