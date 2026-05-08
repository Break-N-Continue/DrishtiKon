package com.drishti.kon.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final String FROM_NAME = "DrishtiKon";

    private final JavaMailSender mailSender;

    @Value("${app.mail.from-email}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String toEmail, String otp) {
        String subject = "Your verification code for DrishtiKon";

        String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; color: #333;">
                    <p>Hi,</p>
                    <p>Someone requested a login to DrishtiKon using this email address. If that was you, use the code below to continue signing in:</p>
                    <p style="margin: 20px 0;">%s</p>
                    <p>This code is valid for 5 minutes. If you didn't make this request, you can safely ignore this email.</p>
                    <p style="margin-top: 24px;">Thanks,<br>DrishtiKon Team</p>
                    <p style="font-size: 12px; color: #999; margin-top: 32px;">DrishtiKon is a student community platform. This is an automated message — please do not reply directly.</p>
                </div>
                """.formatted(otp);

        String textContent = "Your verification code for DrishtiKon is: " + otp
                + "\n\nThis code is valid for 5 minutes. If you didn't make this request, you can ignore this email.";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, FROM_NAME);

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(textContent, htmlContent);

            mailSender.send(message);
            log.info("OTP email sent to {}", toEmail);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
}
