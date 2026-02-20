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
