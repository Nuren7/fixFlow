package com.fixflow.dto;

import com.fixflow.domain.RequestStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(
    @NotNull RequestStatus status
) {}
