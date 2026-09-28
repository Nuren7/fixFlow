package com.fixflow.service;

import com.fixflow.domain.Priority;
import com.fixflow.domain.RequestStatus;
import com.fixflow.dto.MaintenanceRequestCreateRequest;
import com.fixflow.dto.MaintenanceRequestResponse;
import com.fixflow.entity.MaintenanceRequest;
import com.fixflow.entity.Property;
import com.fixflow.entity.Unit;
import com.fixflow.entity.User;
import com.fixflow.repository.MaintenanceRequestRepository;
import com.fixflow.repository.PropertyRepository;
import com.fixflow.repository.UnitRepository;
import com.fixflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceRequestService {

    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final PropertyRepository propertyRepository;
    private final UnitRepository unitRepository;
    private final UserRepository userRepository;
    private final RequestWorkflowService requestWorkflowService;

    public MaintenanceRequestService(MaintenanceRequestRepository maintenanceRequestRepository,
                                     PropertyRepository propertyRepository,
                                     UnitRepository unitRepository,
                                     UserRepository userRepository,
                                     RequestWorkflowService requestWorkflowService) {
        this.maintenanceRequestRepository = maintenanceRequestRepository;
        this.propertyRepository = propertyRepository;
        this.unitRepository = unitRepository;
        this.userRepository = userRepository;
        this.requestWorkflowService = requestWorkflowService;
    }

    public List<MaintenanceRequestResponse> getRequests() {
        return maintenanceRequestRepository.findAll().stream()
            .map(this::toResponse)
            .toList();
    }

    public MaintenanceRequestResponse createRequest(MaintenanceRequestCreateRequest request) {
        Property property = propertyRepository.findById(request.propertyId())
            .orElseThrow(() -> new IllegalArgumentException("Property not found"));

        Unit unit = unitRepository.findById(request.unitId())
            .orElseThrow(() -> new IllegalArgumentException("Unit not found"));

        User customer = userRepository.findById(request.customerId())
            .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        MaintenanceRequest entity = new MaintenanceRequest(
            request.title(),
            request.description(),
            request.priority() == null ? Priority.MEDIUM : request.priority(),
            RequestStatus.REPORTED,
            property,
            unit,
            customer
        );

        MaintenanceRequest saved = maintenanceRequestRepository.save(entity);
        return toResponse(saved);
    }

    public MaintenanceRequestResponse getRequestById(Long id) {
        return toResponse(maintenanceRequestRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Request not found")));
    }

    public MaintenanceRequestResponse updateStatus(Long id, RequestStatus newStatus) {
        MaintenanceRequest request = maintenanceRequestRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (!requestWorkflowService.canTransition(request.getStatus(), newStatus)) {
            throw new IllegalArgumentException(requestWorkflowService.validationMessage(request.getStatus(), newStatus));
        }

        request.setStatus(newStatus);
        return toResponse(maintenanceRequestRepository.save(request));
    }

    private MaintenanceRequestResponse toResponse(MaintenanceRequest request) {
        return new MaintenanceRequestResponse(
            request.getId(),
            request.getTitle(),
            request.getDescription(),
            request.getPriority(),
            request.getStatus(),
            request.getProperty() != null ? request.getProperty().getId() : null,
            request.getUnit() != null ? request.getUnit().getId() : null,
            request.getCustomer() != null ? request.getCustomer().getId() : null,
            request.getCreatedAt(),
            request.getUpdatedAt()
        );
    }
}
