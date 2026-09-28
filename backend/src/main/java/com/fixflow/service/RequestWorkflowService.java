package com.fixflow.service;

import com.fixflow.domain.RequestStatus;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
public class RequestWorkflowService {

    private static final Map<RequestStatus, Set<RequestStatus>> VALID_TRANSITIONS = Map.of(
        RequestStatus.REPORTED, Set.of(RequestStatus.TRIAGED),
        RequestStatus.TRIAGED, Set.of(RequestStatus.ASSIGNED, RequestStatus.WAITING_FOR_PARTS),
        RequestStatus.ASSIGNED, Set.of(RequestStatus.IN_PROGRESS),
        RequestStatus.IN_PROGRESS, Set.of(RequestStatus.WAITING_FOR_PARTS, RequestStatus.COMPLETED),
        RequestStatus.WAITING_FOR_PARTS, Set.of(RequestStatus.IN_PROGRESS, RequestStatus.COMPLETED),
        RequestStatus.COMPLETED, Set.of(RequestStatus.VERIFIED),
        RequestStatus.VERIFIED, Set.of()
    );

    public boolean canTransition(RequestStatus current, RequestStatus next) {
        return VALID_TRANSITIONS.getOrDefault(current, Set.of()).contains(next);
    }

    public String validationMessage(RequestStatus current, RequestStatus next) {
        if (canTransition(current, next)) {
            return "";
        }

        return "Invalid status transition from " + current + " to " + next + ".";
    }
}
