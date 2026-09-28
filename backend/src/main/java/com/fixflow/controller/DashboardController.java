package com.fixflow.controller;

import com.fixflow.service.DashboardService;
import com.fixflow.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard/metrics")
    public ResponseEntity<Map<String, Object>> metrics(@AuthenticationPrincipal User authenticatedUser) {
        return ResponseEntity.ok(dashboardService.getMetrics(authenticatedUser));
    }
}
