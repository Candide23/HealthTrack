package com.HealthTrack.repositories;

import com.HealthTrack.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository <Notification, Long> {
    List<Notification> findByUserId(Long userId);

    @Query("SELECT CASE WHEN COUNT(n) > 0 THEN true ELSE false END " +
            "FROM Notification n WHERE n.user.id = :userId AND n.metricType = :metricType AND n.timestamp > :timestamp")
    boolean existsSimilarNotification(@Param("userId") Long userId,
                                      @Param("metricType") String metricType,
                                      @Param("timestamp") LocalDateTime timestamp);

}
