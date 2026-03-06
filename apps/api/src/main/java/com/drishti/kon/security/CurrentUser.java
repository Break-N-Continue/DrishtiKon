package com.drishti.kon.security;

import java.lang.annotation.*;

/**
 * Resolves the currently authenticated {@link com.drishti.kon.entity.User} from the
 * Spring Security context.  Use as a controller method parameter annotation:
 *
 * <pre>
 * {@literal @}GetMapping("/profile")
 * public ResponseEntity<?> profile({@literal @}CurrentUser User user) { ... }
 * </pre>
 *
 * Returns {@code null} when the request is unauthenticated (public endpoints).
 * Throws {@link org.springframework.security.access.AccessDeniedException} if the
 * user is banned (403).
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface CurrentUser {
}
