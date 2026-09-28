package com.fixflow.repository;

import com.fixflow.entity.MaintenanceRequest;
import com.fixflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
	List<MaintenanceRequest> findByCustomerOrderByCreatedAtDesc(User customer);
	List<MaintenanceRequest> findByOwnerOrderByCreatedAtDesc(User owner);
}
