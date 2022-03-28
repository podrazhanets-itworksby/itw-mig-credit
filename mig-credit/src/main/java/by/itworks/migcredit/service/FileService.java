package by.itworks.migcredit.service;

import by.itworks.migcredit.model.File;
import by.itworks.migcredit.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {

	private final FileRepository fileRepository;

	public void saveFile(MultipartFile document, String sessionId) {
		String format = FilenameUtils.getExtension(document.getOriginalFilename());

		if (Objects.isNull(format)) {
			throw new RuntimeException("Unrecognized extension file");
		}

		try {
			File file = new File();
			file.setData(document.getBytes());
			file.setName(StringUtils.cleanPath(document.getOriginalFilename()));
			file.setContentType(document.getContentType());
			file.setSize(document.getSize());
			file.setSessionId(UUID.fromString(sessionId));
			fileRepository.save(file);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}