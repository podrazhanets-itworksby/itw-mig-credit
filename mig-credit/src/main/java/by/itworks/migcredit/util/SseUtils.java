package by.itworks.migcredit.util;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

@Component
public class SseUtils {

	private final Map<UUID, SseEmitter> emittersMap = new ConcurrentHashMap<>();
	private final ConcurrentLinkedQueue<UUID> emittersQueue = new ConcurrentLinkedQueue<>();

	/**
	 * Поместить emitter в очередь
	 *
	 * @param uniqueId уникальный идентификатор пользователя
	 * @param emitter  sseEmitter
	 */
	public void addEmitter(UUID uniqueId, SseEmitter emitter) {
		emittersMap.put(uniqueId, emitter);
		emittersQueue.add(uniqueId);
	}

	/**
	 * Получение emitter из очереди
	 *
	 * @return emitter с начала очереди или null если очередь пуста
	 */
	public SseEmitter getEmitterFromQueue() {
		UUID uniqueId = emittersQueue.poll();
		if (uniqueId == null) {
			return null;
		}
		var sse = emittersMap.get(uniqueId);
		emittersMap.remove(uniqueId);
		return sse;

	}

	/**
	 * Получить эмиттер по уникальному идентификатору клиента
	 *
	 * @param uniqueId Уникальный идентификатор
	 * @return Найденный эмиттер или null
	 */
	public SseEmitter getEmitter(UUID uniqueId) {
		return emittersMap.get(uniqueId);
	}

	/**
	 * Удаляет emitter из очереди
	 *
	 * @param uniqueId Уникальный идентификатор клиента
	 */
	public void removeEmitter(UUID uniqueId) {
		emittersQueue.remove(uniqueId);
		emittersMap.remove(uniqueId);
	}
}
