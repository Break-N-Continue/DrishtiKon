package com.drishti.kon.controller;

import com.drishti.kon.dto.OtpRequest;
import com.drishti.kon.dto.OtpVerifyRequest;
import com.drishti.kon.entity.User;
import com.drishti.kon.security.JwtUtil;
import com.drishti.kon.service.EmailService;
import com.drishti.kon.service.OtpService;
import com.drishti.kon.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final OtpService otpService;
    private final EmailService emailService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Value("${app.auth.frontend-url}")
    private String frontendUrl;

    @Value("${app.auth.allowed-domain}")
    private String allowedDomain;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    public AuthController(OtpService otpService, EmailService emailService,
                          UserService userService, JwtUtil jwtUtil) {
        this.otpService = otpService;
        this.emailService = emailService;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/request-otp")
    public ResponseEntity<Map<String, String>> requestOtp(@Valid @RequestBody OtpRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        System.out.println("Received OTP request for email: " + email);
        // Validate domain
        if (!email.endsWith("@" + allowedDomain)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only @" + allowedDomain + " emails are allowed"));
        }

        String otp = otpService.generateAndSaveOtp(email);
        emailService.sendOtpEmail(email, otp);

        log.info("OTP requested for email={}", email);
        return ResponseEntity.ok(Map.of("message", "OTP sent to " + email + ". If you don't see it, please check your Spam or Junk folder."));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@Valid @RequestBody OtpVerifyRequest request,
                                                         HttpServletResponse httpResponse) {
        String email = request.getEmail().toLowerCase().trim();

        // Validate domain
        if (!email.endsWith("@" + allowedDomain)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only @" + allowedDomain + " emails are allowed"));
        }

        OtpService.OtpValidationResult result = otpService.validateOtp(email, request.getOtp());

        return switch (result) {
            case VALID -> {
                User user = userService.findOrCreateByEmail(email);
                String token = jwtUtil.generateToken(user);

                boolean isSecure = frontendUrl.startsWith("https");
                ResponseCookie cookie = ResponseCookie.from("drishti_token", token)
                        .httpOnly(true)
                        .secure(isSecure)
                        .path("/")
                        .maxAge(Duration.ofMillis(jwtExpirationMs))
                        .sameSite("Lax")
                        .build();
                httpResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

                log.info("User authenticated: id={}, email={}", user.getId(), email);
                yield ResponseEntity.ok(Map.of(
                        "message", (Object) "Login successful",
                        "user", Map.of(
                                "id", user.getId(),
                                "email", user.getEmail(),
                                "firstName", user.getFirstName(),
                                "lastName", user.getLastName(),
                                "role", user.getRole()
                        )
                ));
            }
            case INVALID -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid OTP. Please try again."));
            case EXPIRED -> ResponseEntity.status(HttpStatus.GONE)
                    .body(Map.of("error", "OTP has expired. Please request a new one."));
            case NOT_FOUND -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "No OTP found. Please request one first."));
            case MAX_ATTEMPTS_EXCEEDED -> ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("error", "Too many attempts. Please request a new OTP."));
        };
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "role", user.getRole()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletResponse response) {
        boolean isSecure = frontendUrl.startsWith("https");
        ResponseCookie cookie = ResponseCookie.from("drishti_token", "")
                .httpOnly(true)
                .secure(isSecure)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
