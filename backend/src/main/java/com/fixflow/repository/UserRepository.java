package com.fixflow.repository;

import com.fixflow.domain.Role;
import com.fixflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByRoleOrderByUsernameAsc(Role role);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
