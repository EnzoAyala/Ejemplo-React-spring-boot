package com.aprender.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.aprender.backend.entity.Message;
import com.aprender.backend.entity.User;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    // Conversación entre dos usuarios (ordenados por fecha asc)
    @Query("SELECT m FROM Message m WHERE m.chatId = :chatId ORDER BY m.fecha ASC")
    List<Message> findByChatId(@Param("chatId") String chatId);

    // Mensajes no leídos para un receptor específico en un chat
    @Query("SELECT m FROM Message m WHERE m.chatId = :chatId AND m.receptor = :receptor AND m.status = false")
    List<Message> findUnreadByChatIdAndReceptor(@Param("chatId") String chatId, @Param("receptor") User receptor);
}
