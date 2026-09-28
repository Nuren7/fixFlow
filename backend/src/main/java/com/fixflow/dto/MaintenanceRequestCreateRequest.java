package com.fixflow.dto;

import com.fixflow.domain.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MaintenanceRequestCreateRequest(
    @NotBlank String title,
    @NotBlank String description,
    @NotNull Priority priority,
    Long propertyId,
    Long unitId,
    Long customerId,
    Long ownerId
) {}
