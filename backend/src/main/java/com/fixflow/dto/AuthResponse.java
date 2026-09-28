package com.fixflow.dto;

public record AuthResponse(
    String token,
    String username,
    String role
) {}
