package com.aprender.backend.domain.mappers;

import com.aprender.backend.domain.dto.request.MessageRequest;
import com.aprender.backend.domain.dto.response.ChatMessageResponse;
import com.aprender.backend.persistence.entity.Message;
import com.aprender.backend.persistence.entity.User;
import com.aprender.backend.domain.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MessageMapper {

    @Autowired
    private MessageService messageService;

    public ChatMessageResponse toChatMessageResponse(Message message) {
        if (message == null) {
            return null;
        }
        return new ChatMessageResponse(
                message.getId(),
                messageService.decrypt(message.getContenido()),
                message.getFecha(),
                message.getEmisor().getId(),
                message.getReceptor().getId(),
                message.isStatus(),
                message.getChatId()
        );
    }

    public Message toEntity(MessageRequest messageRequest, User emisor, User receptor) {
        if (messageRequest == null) {
            return null;
        }
        Message message = new Message();
        message.setContenido(messageRequest.getContenido());
        message.setEmisor(emisor);
        message.setReceptor(receptor);
        if (messageRequest.getChatId() != null && !messageRequest.getChatId().isBlank()) {
            message.setChatId(messageRequest.getChatId());
        }
        return message;
    }
}
