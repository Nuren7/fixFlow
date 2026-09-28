package com.fixflow.controller;

import com.fixflow.domain.Role;
import com.fixflow.dto.OwnerResponse;
import com.fixflow.repository.UserRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/owners")
@CrossOrigin
public class OwnerController {

    private final UserRepository userRepository;

    public OwnerController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<OwnerResponse> listOwners() {
        return userRepository.findByRoleOrderByUsernameAsc(Role.MANAGER).stream()
            .map(owner -> new OwnerResponse(owner.getId(), owner.getUsername()))
            .toList();
    }
}