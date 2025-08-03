package com.aprender.backend.security.services;

import com.aprender.backend.model.User;
// import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetService {

    @Autowired
    private JavaMailSender mailSender;

    // Envia un correo con el código de 6 dígitos para restablecer la contraseña
    public void sendResetCodeEmail(User user, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Código para restablecer contraseña");
        message.setText("Hola " + user.getName() + ",\n\n" +
                "Tu código para restablecer la contraseña es: " + code + "\n\n" +
                "Este código es válido por 5 minutos.\n\n" +
                "Si no solicitaste este cambio, puedes ignorar este correo.");

        mailSender.send(message);
    }

}