package com.HealthTrack.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Repository;

import java.util.LongSummaryStatistics;

@Repository
public interface UserRepository extends JpaRepository <User, Long> {
}
