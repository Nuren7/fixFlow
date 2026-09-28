package com.fixflow.service;

import com.fixflow.domain.RequestStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RequestWorkflowServiceTest {

    private final RequestWorkflowService service = new RequestWorkflowService();

    @Test
    void reportedCanTransitionToTriaged() {
        assertTrue(service.canTransition(RequestStatus.REPORTED, RequestStatus.TRIAGED));
    }

    @Test
    void reportedCannotTransitionToCompleted() {
        assertFalse(service.canTransition(RequestStatus.REPORTED, RequestStatus.COMPLETED));
    }

    @Test
    void invalidTransitionReturnsMessage() {
        String message = service.validationMessage(RequestStatus.REPORTED, RequestStatus.COMPLETED);
        assertTrue(message.contains("Invalid status transition"));
    }
}
