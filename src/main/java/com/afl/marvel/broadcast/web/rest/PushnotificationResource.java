package com.afl.marvel.broadcast.web.rest;

import com.afl.marvel.broadcast.domain.Pushnotification;
import com.afl.marvel.broadcast.repository.PushnotificationRepository;
import com.afl.marvel.broadcast.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.afl.marvel.broadcast.domain.Pushnotification}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PushnotificationResource {

    private final Logger log = LoggerFactory.getLogger(PushnotificationResource.class);

    private static final String ENTITY_NAME = "pushnotification";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PushnotificationRepository pushnotificationRepository;

    public PushnotificationResource(PushnotificationRepository pushnotificationRepository) {
        this.pushnotificationRepository = pushnotificationRepository;
    }

    /**
     * {@code POST  /pushnotifications} : Create a new pushnotification.
     *
     * @param pushnotification the pushnotification to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pushnotification, or with status {@code 400 (Bad Request)} if the pushnotification has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @CrossOrigin(origins = "*")
    @PostMapping("/pushnotifications")
    public ResponseEntity<Pushnotification> createPushnotification(@RequestBody Pushnotification pushnotification)
        throws URISyntaxException {
        log.debug("REST request to save Pushnotification : {}", pushnotification);
        if (pushnotification.getId() != null) {
            throw new BadRequestAlertException("A new pushnotification cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Pushnotification result = pushnotificationRepository.save(pushnotification);
        return ResponseEntity
            .created(new URI("/api/pushnotifications/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /pushnotifications/:id} : Updates an existing pushnotification.
     *
     * @param id the id of the pushnotification to save.
     * @param pushnotification the pushnotification to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pushnotification,
     * or with status {@code 400 (Bad Request)} if the pushnotification is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pushnotification couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @CrossOrigin
    @PutMapping("/pushnotifications/{id}")
    public ResponseEntity<Pushnotification> updatePushnotification(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Pushnotification pushnotification
    ) throws URISyntaxException {
        log.debug("REST request to update Pushnotification : {}, {}", id, pushnotification);
        if (pushnotification.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pushnotification.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pushnotificationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Pushnotification result = pushnotificationRepository.save(pushnotification);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, pushnotification.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /pushnotifications/:id} : Partial updates given fields of an existing pushnotification, field will ignore if it is null
     *
     * @param id the id of the pushnotification to save.
     * @param pushnotification the pushnotification to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pushnotification,
     * or with status {@code 400 (Bad Request)} if the pushnotification is not valid,
     * or with status {@code 404 (Not Found)} if the pushnotification is not found,
     * or with status {@code 500 (Internal Server Error)} if the pushnotification couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/pushnotifications/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Pushnotification> partialUpdatePushnotification(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Pushnotification pushnotification
    ) throws URISyntaxException {
        log.debug("REST request to partial update Pushnotification partially : {}, {}", id, pushnotification);
        if (pushnotification.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pushnotification.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pushnotificationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Pushnotification> result = pushnotificationRepository
            .findById(pushnotification.getId())
            .map(existingPushnotification -> {
                if (pushnotification.getFanLevel() != null) {
                    existingPushnotification.setFanLevel(pushnotification.getFanLevel());
                }
                if (pushnotification.getPriority() != null) {
                    existingPushnotification.setPriority(pushnotification.getPriority());
                }
                if (pushnotification.getMessageHeader() != null) {
                    existingPushnotification.setMessageHeader(pushnotification.getMessageHeader());
                }
                if (pushnotification.getMessage() != null) {
                    existingPushnotification.setMessage(pushnotification.getMessage());
                }
                if (pushnotification.getTimestamp() != null) {
                    existingPushnotification.setTimestamp(pushnotification.getTimestamp());
                }

                return existingPushnotification;
            })
            .map(pushnotificationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, pushnotification.getId().toString())
        );
    }

    /**
     * {@code GET  /pushnotifications} : get all the pushnotifications.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pushnotifications in body.
     */
    @GetMapping("/pushnotifications")
    public List<Pushnotification> getAllPushnotifications() {
        log.debug("REST request to get all Pushnotifications");
        return pushnotificationRepository.findAll();
    }

    /**
     * {@code GET  /pushnotifications/:id} : get the "id" pushnotification.
     *
     * @param id the id of the pushnotification to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pushnotification, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/pushnotifications/{id}")
    public ResponseEntity<Pushnotification> getPushnotification(@PathVariable Long id) {
        log.debug("REST request to get Pushnotification : {}", id);
        Optional<Pushnotification> pushnotification = pushnotificationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(pushnotification);
    }

    /**
     * {@code DELETE  /pushnotifications/:id} : delete the "id" pushnotification.
     *
     * @param id the id of the pushnotification to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/pushnotifications/{id}")
    public ResponseEntity<Void> deletePushnotification(@PathVariable Long id) {
        log.debug("REST request to delete Pushnotification : {}", id);
        pushnotificationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
