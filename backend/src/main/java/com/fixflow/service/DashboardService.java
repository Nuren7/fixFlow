package com.fixflow.service;

import com.fixflow.domain.RequestStatus;
import com.fixflow.entity.MaintenanceRequest;
import com.fixflow.repository.MaintenanceRequestRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final MaintenanceRequestRepository maintenanceRequestRepository;

    public DashboardService(MaintenanceRequestRepository maintenanceRequestRepository) {
        this.maintenanceRequestRepository = maintenanceRequestRepository;
    }

    public Map<String, Object> getMetrics() {
        List<MaintenanceRequest> requests = maintenanceRequestRepository.findAll();

        long openRequests = requests.stream().filter(r -> r.getStatus() != RequestStatus.VERIFIED && r.getStatus() != RequestStatus.COMPLETED).count();
        long overdue = requests.stream().filter(r -> r.getStatus() != RequestStatus.COMPLETED && r.getStatus() != RequestStatus.VERIFIED).count();
        long inProgress = requests.stream().filter(r -> r.getStatus() == RequestStatus.IN_PROGRESS || r.getStatus() == RequestStatus.ASSIGNED).count();
        long completed = requests.stream().filter(r -> r.getStatus() == RequestStatus.COMPLETED || r.getStatus() == RequestStatus.VERIFIED).count();

        double avgResolutionHours = requests.stream()
            .filter(r -> r.getUpdatedAt() != null)
            .mapToDouble(r -> Duration.between(r.getCreatedAt(), r.getUpdatedAt()).toMinutes() / 60.0)
            .average()
            .orElse(0.0);

        return Map.of(
            "openRequests", openRequests,
            "overdue", overdue,
            "inProgress", inProgress,
            "completed", completed,
            "avgResolutionHours", Math.round(avgResolutionHours * 10.0) / 10.0
        );
    }
}
