package com.fixflow.service;

import com.fixflow.domain.Priority;
import com.fixflow.domain.SlaStatus;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
public class SlaService {

    public SlaStatus calculateStatus(Instant reportedAt, Priority priority, Instant now) {
        if (reportedAt == null || priority == null || now == null) {
            return SlaStatus.ON_TRACK;
        }

        long elapsedHours = Duration.between(reportedAt, now).toHours();
        long thresholdHours = switch (priority) {
            case LOW -> 48;
            case MEDIUM -> 24;
            case HIGH -> 8;
            case URGENT -> 2;
        };

        if (elapsedHours > thresholdHours) {
            return SlaStatus.OVERDUE;
        }
        if (elapsedHours >= thresholdHours * 0.7) {
            return SlaStatus.AT_RISK;
        }
        return SlaStatus.ON_TRACK;
    }
}
