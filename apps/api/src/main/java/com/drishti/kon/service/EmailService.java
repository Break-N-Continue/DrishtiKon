package com.drishti.kon.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Value("${app.sendgrid.api-key}")
    private String sendGridApiKey;

    @Value("${app.sendgrid.from-email}")
    private String fromEmail;

    @Value("${app.sendgrid.from-name}")
    private String fromName;

    public void sendOtpEmail(String toEmail, String otp) {
        Email from = new Email(fromEmail, fromName);
        Email to = new Email(toEmail);
        String subject = "DrishtiKon - Your Login OTP";

        String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
                    <h2 style="color: #2563eb; margin-bottom: 8px;">DrishtiKon</h2>
                    <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">College Community Platform</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin-bottom: 24px;">
                    <p style="font-size: 16px; color: #111827;">Your one-time password is:</p>
                    <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 16px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111827;">%s</span>
                    </div>
                    <p style="font-size: 14px; color: #6b7280;">This OTP expires in <strong>5 minutes</strong>.</p>
                    <p style="font-size: 14px; color: #6b7280;">If you didn't request this, please ignore this email.</p>
                    <p style="font-size: 13px; color: #f59e0b; margin-top: 12px;">⚠ Can't find this email? Please check your <strong>Spam</strong> or <strong>Junk</strong> folder.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin-top: 24px;">
                    <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">Army Institute of Technology, Pune</p>
                </div>
                """.formatted(otp);

        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                log.info("OTP email sent to {}", toEmail);
            } else {
                log.error("Failed to send OTP email to {}. Status: {}, Body: {}",
                        toEmail, response.getStatusCode(), response.getBody());
                throw new RuntimeException("Failed to send OTP email");
            }
        } catch (IOException e) {
            log.error("SendGrid error sending to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
}
