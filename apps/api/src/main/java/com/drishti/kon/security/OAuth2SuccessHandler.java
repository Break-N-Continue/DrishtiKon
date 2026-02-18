package com.drishti.kon.security;

import com.drishti.kon.entity.User;
import com.drishti.kon.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2SuccessHandler.class);

    private final JwtUtil jwtUtil;
    private final UserService userService;

    @Value("${app.oauth2.frontend-url}")
    private String frontendUrl;

    @Value("${app.oauth2.allowed-domain}")
    private String allowedDomain;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    public OAuth2SuccessHandler(JwtUtil jwtUtil, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();

        String email = oidcUser.getEmail();
        if (email == null) {
            email = oidcUser.getAttribute("preferred_username");
        }

        String name = oidcUser.getAttribute("name");
        String oid = oidcUser.getAttribute("oid");

        log.info("OAuth2 login success for email={}, oid={}", email, oid);

        // Validate domain
        if (email == null || !email.toLowerCase().endsWith("@" + allowedDomain)) {
            log.warn("Unauthorized domain for email: {}", email);
            clearAuthenticationAttributes(request);
            response.sendRedirect(frontendUrl + "?error=unauthorized_domain");
            return;
        }

        // Find or create user in database
        User user = userService.findOrCreateUser(email, name, oid);

        // Generate JWT
        String token = jwtUtil.generateToken(user);

        // Set HTTP-only cookie
        ResponseCookie cookie = ResponseCookie.from("drishti_token", token)
                .httpOnly(true)
                .secure(false) // Set to true in production with HTTPS
                .path("/")
                .maxAge(Duration.ofMillis(jwtExpirationMs))
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // Clean up session used during OAuth2 flow
        clearAuthenticationAttributes(request);

        log.info("JWT issued for user id={}, redirecting to frontend", user.getId());

        // Redirect to frontend
        response.sendRedirect(frontendUrl);
    }
}
