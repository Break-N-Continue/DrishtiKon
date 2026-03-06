package com.drishti.kon.security;

import com.drishti.kon.entity.User;
import org.springframework.core.MethodParameter;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * Resolves {@link CurrentUser}-annotated controller parameters to the authenticated
 * {@link User} loaded fresh from the database by {@link JwtAuthenticationFilter}.
 *
 * <ul>
 *   <li>Returns {@code null} for unauthenticated requests (public endpoints).</li>
 *   <li>Throws {@link AccessDeniedException} (→ HTTP 403) if the resolved user is banned.</li>
 * </ul>
 */
@Component
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUser.class)
                && User.class.isAssignableFrom(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof User user)) {
            return null;
        }

        if (user.isBanned()) {
            throw new AccessDeniedException("Your account has been banned.");
        }

        return user;
    }
}
