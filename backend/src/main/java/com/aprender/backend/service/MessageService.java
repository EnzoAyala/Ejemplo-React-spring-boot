package com.aprender.backend.service;

import com.aprender.backend.model.Message;
import com.aprender.backend.model.User;
import com.aprender.backend.repository.MessageRepository;
import com.aprender.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    // Usaremos AES-GCM por autenticación/integridad. IV de 12 bytes, tag de 128 bits.
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int GCM_TAG_LENGTH = 128; // bits
    private static final int IV_LENGTH = 12; // bytes

    @Value("${messages.aes.secret:}")
    private String base64Secret; // secreto en Base64 desde application.properties

    private SecretKey secretKey;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void init() throws Exception {
        if (base64Secret == null || base64Secret.isBlank()) {
            // Genera una clave aleatoria en entornos de desarrollo si no está configurada
            KeyGenerator keyGen = KeyGenerator.getInstance("AES");
            keyGen.init(256);
            secretKey = keyGen.generateKey();
        } else {
            byte[] keyBytes = Base64.getDecoder().decode(base64Secret);
            secretKey = new SecretKeySpec(keyBytes, "AES");
        }
    }

    public String computeChatId(Long userId1, Long userId2) {
        long a = Math.min(userId1, userId2);
        long b = Math.max(userId1, userId2);
        return "chat_" + a + "_" + b;
    }

    public Message saveMessage(Long emisorId, Long receptorId, String contenidoPlano, String chatId) {
        User emisor = userRepository.findById(emisorId).orElseThrow();
        User receptor = userRepository.findById(receptorId).orElseThrow();
        if (chatId == null || chatId.isBlank()) {
            chatId = computeChatId(emisorId, receptorId);
        }
        String encrypted = encrypt(contenidoPlano);
        Message m = new Message();
        m.setEmisor(emisor);
        m.setReceptor(receptor);
        m.setContenido(encrypted);
        m.setFecha(LocalDateTime.now());
        m.setStatus(false);
        m.setChatId(chatId);
        return messageRepository.save(m);
    }

    public List<Message> getConversation(Long userId1, Long userId2) {
        String chatId = computeChatId(userId1, userId2);
        return messageRepository.findByChatId(chatId);
    }

    public void markAsReadFor(Long userId1, Long userId2, Long receptorId) {
        String chatId = computeChatId(userId1, userId2);
        User receptor = userRepository.findById(receptorId).orElseThrow();
        List<Message> unread = messageRepository.findUnreadByChatIdAndReceptor(chatId, receptor);
        for (Message m : unread) {
            m.setStatus(true);
        }
        messageRepository.saveAll(unread);
    }

    public String encrypt(String plainText) {
        try {
            byte[] iv = new byte[IV_LENGTH];
            new SecureRandom().nextBytes(iv);

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, spec);

            byte[] cipherText = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

            ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + cipherText.length);
            byteBuffer.put(iv);
            byteBuffer.put(cipherText);
            byte[] ivPlusCipher = byteBuffer.array();

            return Base64.getEncoder().encodeToString(ivPlusCipher);
        } catch (Exception e) {
            throw new RuntimeException("Error al cifrar mensaje", e);
        }
    }

    public String decrypt(String base64IvAndCipherText) {
        try {
            byte[] ivPlusCipher = Base64.getDecoder().decode(base64IvAndCipherText);
            byte[] iv = new byte[IV_LENGTH];
            byte[] cipherText = new byte[ivPlusCipher.length - IV_LENGTH];
            System.arraycopy(ivPlusCipher, 0, iv, 0, IV_LENGTH);
            System.arraycopy(ivPlusCipher, IV_LENGTH, cipherText, 0, cipherText.length);

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, spec);

            byte[] plainBytes = cipher.doFinal(cipherText);
            return new String(plainBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Error al descifrar mensaje", e);
        }
    }
}
