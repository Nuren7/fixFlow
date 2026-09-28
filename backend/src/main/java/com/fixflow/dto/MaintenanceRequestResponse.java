package com.fixflow.dto;

import com.fixflow.domain.Priority;
import com.fixflow.domain.RequestStatus;

import java.time.Instant;

public record MaintenanceRequestResponse(
    Long id,
    String title,
    String description,
    Priority priority,
    RequestStatus status,
    Long propertyId,
    Long unitId,
    Long customerId,
    Instant createdAt,
    Instant updatedAt
) {}
