package com.fixflow.controller;

import com.fixflow.domain.SlaStatus;
import com.fixflow.entity.MaintenanceRequest;
import com.fixflow.entity.User;
import com.fixflow.repository.MaintenanceRequestRepository;
import com.fixflow.repository.UserRepository;
import com.fixflow.service.SlaService;
import com.fixflow.service.TechnicianAssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RequestController {

    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final UserRepository userRepository;
    private final TechnicianAssignmentService technicianAssignmentService;
    private final SlaService slaService;

    public RequestController(MaintenanceRequestRepository maintenanceRequestRepository,
                            UserRepository userRepository,
                            TechnicianAssignmentService technicianAssignmentService,
                            SlaService slaService) {
        this.maintenanceRequestRepository = maintenanceRequestRepository;
        this.userRepository = userRepository;
        this.technicianAssignmentService = technicianAssignmentService;
        this.slaService = slaService;
    }

    @GetMapping("/requests/{id}/assignment")
    public ResponseEntity<Map<String, Object>> suggestAssignment(@PathVariable Long id) {
        MaintenanceRequest request = maintenanceRequestRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        User recommended = technicianAssignmentService.suggestBestTechnician(
            userRepository.findAll().stream()
                .filter(user -> user.getRole() == com.fixflow.domain.Role.TECHNICIAN)
                .toList(),
            request
        );

        return ResponseEntity.ok(Map.of(
            "requestId", id,
            "recommendedTechnicianId", recommended.getId(),
            "recommendedTechnicianUsername", recommended.getUsername(),
            "score", recommended.getSkillScore(request)
        ));
    }

    @GetMapping("/requests/{id}/sla")
    public ResponseEntity<Map<String, Object>> getSlaStatus(@PathVariable Long id) {
        MaintenanceRequest request = maintenanceRequestRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        SlaStatus slaStatus = slaService.calculateStatus(
            request.getCreatedAt(),
            request.getPriority(),
            Instant.now()
        );

        return ResponseEntity.ok(Map.of(
            "requestId", id,
            "priority", request.getPriority().name(),
            "status", slaStatus.name(),
            "createdAt", request.getCreatedAt()
        ));
    }
}
