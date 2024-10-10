package com.HealthTrack.repositories;

import com.HealthTrack.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository <Notification, Long> {
    List<Notification> findByUserId(Long userId);

}
