package com.aprender.backend.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.aprender.backend.entity.User;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

@Service
public class PasswordResetService {

    @Autowired
    private JavaMailSender mailSender;

    // Envia un correo con el código de 6 dígitos para restablecer la contraseña
    public void sendResetCodeEmail(User user, String code) throws MessagingException {
        // Crear el correo en formato HTML
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(user.getEmail());
        helper.setSubject("Código para restablecer contraseña");

        // HTML para el mensaje
        String htmlContent = "<html>" +
                "<body style='font-family: Arial, sans-serif;'>" +
                "<div style='background-color: #f1f5f9; padding: 30px; border-radius: 15px; max-width: 600px; margin: 0 auto;'>"
                +
                "<h2 style='color: #0ea5e9; font-size: 28px; text-align: center; margin-bottom: 20px;'>¡Hola, "
                + user.getName() + "!</h2>" +
                "<p style='color: #1e293b; font-size: 16px; line-height: 1.5;'>Recibiste este correo porque hemos recibido una solicitud para restablecer tu contraseña.</p>"
                +
                "<h3 style='color: #333; font-size: 18px; margin-top: 20px;'>Tu código de restablecimiento es:</h3>" +
                "<div style='background-color: #ffffff; padding: 20px; border-radius: 8px; text-align: center; font-size: 30px; font-weight: bold; color: #22c55e; border: 2px solid #22c55e; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);'>"
                +
                code +
                "</div>" +
                "<p style='color: #64748b; font-size: 14px; margin-top: 15px;'>Este código es válido por 5 minutos. Si no solicitaste este cambio, por favor ignora este correo.</p>"
                +
                "<br>" +
                "<p style='color: #1e293b; font-size: 14px; text-align: center;'>Saludos,<br><strong>El equipo de tu PtaMadre</strong></p>"
                +
                "<style>" +
                "@media (max-width: 600px) {" +
                "  body { padding: 15px; }" +
                "  .container { padding: 10px; }" +
                "}" +
                "</style>" +
                "</div>" +
                "</body>" +
                "</html>";

        // Establecer el contenido HTML
        helper.setText(htmlContent, true);

        // Enviar el mensaje
        mailSender.send(message);
    }
}