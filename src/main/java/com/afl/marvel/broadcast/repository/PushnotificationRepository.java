package com.afl.marvel.broadcast.repository;

import com.afl.marvel.broadcast.domain.Pushnotification;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Pushnotification entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PushnotificationRepository extends JpaRepository<Pushnotification, Long> {}
