package com.fixflow.service;

import com.fixflow.entity.MaintenanceRequest;
import com.fixflow.entity.User;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class TechnicianAssignmentService {

    public User suggestBestTechnician(List<User> technicians, MaintenanceRequest request) {
        if (technicians == null || technicians.isEmpty()) {
            throw new IllegalArgumentException("No technicians available for assignment");
        }

        return technicians.stream()
            .sorted(Comparator
                .comparingInt(User::getActiveJobs)
                .thenComparingInt((User technician) -> -technician.getSkillScore(request)))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("No suitable technician found"));
    }
}
