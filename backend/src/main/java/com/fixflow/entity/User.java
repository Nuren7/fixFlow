package com.fixflow.entity;

import com.fixflow.domain.Role;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "primary_skill")
    private String primarySkill;

    @Column(name = "location")
    private String location;

    @Column(name = "active_jobs")
    private Integer activeJobs;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    public User() {
    }

    public User(String username, String password, String email, Role role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    public User(String username, String password, String email, Role role, String primarySkill, String location, Integer activeJobs) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.primarySkill = primarySkill;
        this.location = location;
        this.activeJobs = activeJobs == null ? 0 : activeJobs;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getPrimarySkill() {
        return primarySkill;
    }

    public void setPrimarySkill(String primarySkill) {
        this.primarySkill = primarySkill;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getActiveJobs() {
        return activeJobs == null ? 0 : activeJobs;
    }

    public void setActiveJobs(Integer activeJobs) {
        this.activeJobs = activeJobs == null ? 0 : activeJobs;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public int getSkillScore(MaintenanceRequest request) {
        if (request == null || primarySkill == null || primarySkill.isBlank()) {
            return 0;
        }

        String combined = (request.getTitle() + " " + request.getDescription()).toLowerCase();
        String skill = primarySkill.toLowerCase();

        if (combined.contains(skill.toLowerCase())) {
            return 100;
        }

        if (skill.contains("plumbing") && (combined.contains("sink") || combined.contains("pipe") || combined.contains("toilet") || combined.contains("leak"))) {
            return 95;
        }

        if (skill.contains("electrical") && (combined.contains("light") || combined.contains("breaker") || combined.contains("wiring") || combined.contains("outlet"))) {
            return 95;
        }

        if (skill.contains("hvac") && (combined.contains("ac") || combined.contains("heater") || combined.contains("air") || combined.contains("ventilation"))) {
            return 95;
        }

        return 50;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
