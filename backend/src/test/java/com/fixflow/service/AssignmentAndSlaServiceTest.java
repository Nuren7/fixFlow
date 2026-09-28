package com.fixflow.service;

import com.fixflow.domain.Priority;
import com.fixflow.domain.RequestStatus;
import com.fixflow.domain.SlaStatus;
import com.fixflow.entity.MaintenanceRequest;
import com.fixflow.entity.User;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AssignmentAndSlaServiceTest {

    private final TechnicianAssignmentService technicianAssignmentService = new TechnicianAssignmentService();
    private final SlaService slaService = new SlaService();

    @Test
    void suggestsTechnicianMatchingSkillAndLowerLoad() {
        User firstTechnician = new User("ahmed", "secret", "ahmed@test.com", com.fixflow.domain.Role.TECHNICIAN, "PLUMBING", "Stockholm", 2);
        User secondTechnician = new User("sara", "secret", "sara@test.com", com.fixflow.domain.Role.TECHNICIAN, "PLUMBING", "Stockholm", 6);

        MaintenanceRequest request = new MaintenanceRequest(
            "Kitchen sink leaking",
            "The sink is leaking under the cabinet",
            Priority.HIGH,
            RequestStatus.REPORTED,
            null,
            null,
            null
        );

        User suggestion = technicianAssignmentService.suggestBestTechnician(List.of(firstTechnician, secondTechnician), request);

        assertEquals("ahmed", suggestion.getUsername());
    }

    @Test
    void marksUrgentRequestAsOverdueWhenBeyondSlaWindow() {
        Instant reportedAt = Instant.now().minusSeconds(3 * 60 * 60);
        SlaStatus status = slaService.calculateStatus(reportedAt, Priority.URGENT, Instant.now());

        assertEquals(SlaStatus.OVERDUE, status);
    }
}
