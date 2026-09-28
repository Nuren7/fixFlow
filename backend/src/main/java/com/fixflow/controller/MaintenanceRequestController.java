package com.fixflow.controller;

import com.fixflow.dto.MaintenanceRequestCreateRequest;
import com.fixflow.dto.MaintenanceRequestResponse;
import com.fixflow.dto.StatusUpdateRequest;
import com.fixflow.service.MaintenanceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MaintenanceRequestController {

    private final MaintenanceRequestService maintenanceRequestService;

    public MaintenanceRequestController(MaintenanceRequestService maintenanceRequestService) {
        this.maintenanceRequestService = maintenanceRequestService;
    }

    @GetMapping("/requests")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'TECHNICIAN', 'CUSTOMER')")
    public ResponseEntity<List<MaintenanceRequestResponse>> listRequests() {
        return ResponseEntity.ok(maintenanceRequestService.getRequests());
    }

    @PostMapping("/requests")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CUSTOMER')")
    public ResponseEntity<MaintenanceRequestResponse> createRequest(@Valid @RequestBody MaintenanceRequestCreateRequest request) {
        return ResponseEntity.ok(maintenanceRequestService.createRequest(request));
    }

    @GetMapping("/requests/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'TECHNICIAN', 'CUSTOMER')")
    public ResponseEntity<MaintenanceRequestResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceRequestService.getRequestById(id));
    }

    @PatchMapping("/requests/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'TECHNICIAN')")
    public ResponseEntity<MaintenanceRequestResponse> updateStatus(@PathVariable Long id,
                                                                  @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(maintenanceRequestService.updateStatus(id, request.status()));
    }
}
