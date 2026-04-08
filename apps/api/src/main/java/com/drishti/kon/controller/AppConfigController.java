package com.drishti.kon.controller;

import com.drishti.kon.dto.LinksResponse;
import com.drishti.kon.dto.UpdateLinksRequest;
import com.drishti.kon.entity.User;
import com.drishti.kon.security.CurrentUser;
import com.drishti.kon.service.AppConfigService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/config")
public class AppConfigController {

    private final AppConfigService appConfigService;

    public AppConfigController(AppConfigService appConfigService) {
        this.appConfigService = appConfigService;
    }

    @GetMapping("/links")
    public ResponseEntity<LinksResponse> getLinks() {
        return ResponseEntity.ok(appConfigService.getLinks());
    }

    @PatchMapping("/links")
    public ResponseEntity<LinksResponse> updateLinks(@RequestBody UpdateLinksRequest request,
                                                     @CurrentUser User requester) {
        LinksResponse updated = appConfigService.updateLinks(request, requester);
        return ResponseEntity.ok(updated);
    }
}
