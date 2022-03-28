package by.itworks.migcredit.controller;

import by.itworks.migcredit.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping(value = "api")
@RequiredArgsConstructor
public class FileController {
	private final FileService fileService;

	@RequestMapping(
			method = RequestMethod.POST,
			value = "/file/save",
			produces = {"text/plain"},
			consumes = {"multipart/form-data"}
	)
	ResponseEntity<Void> saveFile(@RequestPart(value = "file") MultipartFile file, @RequestPart(value = "sessionId") String sessionId) {
		fileService.saveFile(file, sessionId);
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
