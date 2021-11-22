package com.afl.marvel.broadcast.service;

import com.afl.marvel.broadcast.domain.Notification;
import com.afl.marvel.broadcast.repository.NotificationRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Notification}.
 */
@Service
@Transactional
public class NotificationService {

    private final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /**
     * Save a notification.
     *
     * @param notification the entity to save.
     * @return the persisted entity.
     */
    public Notification save(Notification notification) {
        log.debug("Request to save Notification : {}", notification);
        return notificationRepository.save(notification);
    }

    /**
     * Partially update a notification.
     *
     * @param notification the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Notification> partialUpdate(Notification notification) {
        log.debug("Request to partially update Notification : {}", notification);

        return notificationRepository
            .findById(notification.getId())
            .map(existingNotification -> {
                if (notification.getFanLevel() != null) {
                    existingNotification.setFanLevel(notification.getFanLevel());
                }
                if (notification.getPriority() != null) {
                    existingNotification.setPriority(notification.getPriority());
                }
                if (notification.getHeader() != null) {
                    existingNotification.setHeader(notification.getHeader());
                }
                if (notification.getBody() != null) {
                    existingNotification.setBody(notification.getBody());
                }

                return existingNotification;
            })
            .map(notificationRepository::save);
    }

    /**
     * Get all the notifications.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Notification> findAll() {
        log.debug("Request to get all Notifications");
        return notificationRepository.findAll();
    }

    /**
     * Get one notification by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Notification> findOne(Long id) {
        log.debug("Request to get Notification : {}", id);
        return notificationRepository.findById(id);
    }

    /**
     * Delete the notification by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Notification : {}", id);
        notificationRepository.deleteById(id);
    }
}
