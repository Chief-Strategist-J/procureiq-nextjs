package com.procureiq.springboot_app.features.tenant.repository;

import com.procureiq.springboot_app.features.tenant.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
}
