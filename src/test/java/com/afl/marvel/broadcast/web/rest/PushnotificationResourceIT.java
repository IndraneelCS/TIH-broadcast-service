package com.afl.marvel.broadcast.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.afl.marvel.broadcast.IntegrationTest;
import com.afl.marvel.broadcast.domain.Pushnotification;
import com.afl.marvel.broadcast.repository.PushnotificationRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PushnotificationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PushnotificationResourceIT {

    private static final String DEFAULT_FAN_LEVEL = "AAAAAAAAAA";
    private static final String UPDATED_FAN_LEVEL = "BBBBBBBBBB";

    private static final String DEFAULT_PRIORITY = "AAAAAAAAAA";
    private static final String UPDATED_PRIORITY = "BBBBBBBBBB";

    private static final String DEFAULT_MESSAGE_HEADER = "AAAAAAAAAA";
    private static final String UPDATED_MESSAGE_HEADER = "BBBBBBBBBB";

    private static final String DEFAULT_MESSAGE = "AAAAAAAAAA";
    private static final String UPDATED_MESSAGE = "BBBBBBBBBB";

    private static final Instant DEFAULT_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/pushnotifications";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PushnotificationRepository pushnotificationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPushnotificationMockMvc;

    private Pushnotification pushnotification;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pushnotification createEntity(EntityManager em) {
        Pushnotification pushnotification = new Pushnotification()
            .fanLevel(DEFAULT_FAN_LEVEL)
            .priority(DEFAULT_PRIORITY)
            .messageHeader(DEFAULT_MESSAGE_HEADER)
            .message(DEFAULT_MESSAGE)
            .timestamp(DEFAULT_TIMESTAMP);
        return pushnotification;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pushnotification createUpdatedEntity(EntityManager em) {
        Pushnotification pushnotification = new Pushnotification()
            .fanLevel(UPDATED_FAN_LEVEL)
            .priority(UPDATED_PRIORITY)
            .messageHeader(UPDATED_MESSAGE_HEADER)
            .message(UPDATED_MESSAGE)
            .timestamp(UPDATED_TIMESTAMP);
        return pushnotification;
    }

    @BeforeEach
    public void initTest() {
        pushnotification = createEntity(em);
    }

    @Test
    @Transactional
    void createPushnotification() throws Exception {
        int databaseSizeBeforeCreate = pushnotificationRepository.findAll().size();
        // Create the Pushnotification
        restPushnotificationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pushnotification))
            )
            .andExpect(status().isCreated());

        // Validate the Pushnotification in the database
        List<Pushnotification> pushnotificationList = pushnotificationRepository.findAll();
        assertThat(pushnotificationList).hasSize(databaseSizeBeforeCreate + 1);
        Pushnotification testPushnotification = pushnotificationList.get(pushnotificationList.size() - 1);
        assertThat(testPushnotification.getFanLevel()).isEqualTo(DEFAULT_FAN_LEVEL);
        assertThat(testPushnotification.getPriority()).isEqualTo(DEFAULT_PRIORITY);
        assertThat(testPushnotification.getMessageHeader()).isEqualTo(DEFAULT_MESSAGE_HEADER);
        assertThat(testPushnotification.getMessage()).isEqualTo(DEFAULT_MESSAGE);
        assertThat(testPushnotification.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
    }

    @Test
    @Transactional
    void createPushnotificationWithExistingId() throws Exception {
        // Create the Pushnotification with an existing ID
        pushnotification.setId(1L);

        int databaseSizeBeforeCreate = pushnotificationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPushnotificationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pushnotification))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pushnotification in the database
        List<Pushnotification> pushnotificationList = pushnotificationRepository.findAll();
        assertThat(pushnotificationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPushnotifications() throws Exception {
        // Initialize the database
        pushnotificationRepository.saveAndFlush(pushnotification);

        // Get all the pushnotificationList
        restPushnotificationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pushnotification.getId().intValue())))
            .andExpect(jsonPath("$.[*].fanLevel").value(hasItem(DEFAULT_FAN_LEVEL)))
            .andExpect(jsonPath("$.[*].priority").value(hasItem(DEFAULT_PRIORITY)))
            .andExpect(jsonPath("$.[*].messageHeader").value(hasItem(DEFAULT_MESSAGE_HEADER)))
            .andExpect(jsonPath("$.[*].message").value(hasItem(DEFAULT_MESSAGE)))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())));
    }

    @Test
    @Transactional
    void getPushnotification() throws Exception {
        // Initialize the database
        pushnotificationRepository.saveAndFlush(pushnotification);

        // Get the pushnotification
        restPushnotificationMockMvc
            .perform(get(ENTITY_API_URL_ID, pushnotification.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pushnotification.getId().intValue()))
            .andExpect(jsonPath("$.fanLevel").value(DEFAULT_FAN_LEVEL))
            .andExpect(jsonPath("$.priority").value(DEFAULT_PRIORITY))
            .andExpect(jsonPath("$.messageHeader").value(DEFAULT_MESSAGE_HEADER))
            .andExpect(jsonPath("$.message").value(DEFAULT_MESSAGE))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPushnotification() throws Exception {
        // Get the pushnotification
        restPushnotificationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPushnotification() throws Exception {
        // Initialize the database
        pushnotificationRepository.saveAndFlush(pushnotification);

        int databaseSizeBeforeUpdate = pushnotificationRepository.findAll().size();

        // Update the pushnotification
        Pushnotification updatedPushnotification = pushnotificationRepository.findById(pushnotification.getId()).get();
        // Disconnect from session so that the updates on updatedPushnotification are not directly saved in db
        em.detach(updatedPushnotification);
        updatedPushnotification
            .fanLevel(UPDATED_FAN_LEVEL)
            .priority(UPDATED_PRIORITY)
            .messageHeader(UPDATED_MESSAGE_HEADER)
            .message(UPDATED_MESSAGE)
            .timestamp(UPDATED_TIMESTAMP);

        restPushnotificationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPushnotification.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPushnotification))
            )
            .andExpect(status().isOk());

        // Validate the Pushnotification in the database
        List<Pushnotification> pushnotificationList = pushnotificationRepository.findAll();
        assertThat(pushnotificationList).hasSize(databaseSizeBeforeUpdate);
        Pushnotification testPushnotification = pushnotificationList.get(pushnotificationList.size() - 1);
        assertThat(testPushnotification.getFanLevel()).isEqualTo(UPDATED_FAN_LEVEL);
        assertThat(testPushnotification.getPriority()).isEqualTo(UPDATED_PRIORITY);
        assertThat(testPushnotification.getMessageHeader()).isEqualTo(UPDATED_MESSAGE_HEADER);
        assertThat(testPushnotification.getMessage()).isEqualTo(UPDATED_MESSAGE);
        assertThat(testPushnotification.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void putNonExistingPushnotification() throws Exception {
        int databaseSizeBeforeUpdate = pushnotificationRepository.findAll().size();
        pushnotification.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPushnotificationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pushnotification.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pushnotification))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pushnotification in the database
        List<Pushnotification> pushnotificationList = pushnotificationRepository.findAll();
        assertThat(pushnotificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPushnotification() throws Exception {
        int databaseSizeBeforeUpdate = pushnotificationRepository.findAll().size();
        pushnotification.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPushnotificationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pushnotification))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pushnotification in the database
        List<Pushnotification> pushnotificationList = pushnotificationRepository.findAll();
        assertThat(pushnotificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPushnotification() throws Exception {
        int databaseSizeBeforeUpdate = pushnotificationRepository.findAll().size();
        pushnotification.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPushnotificationMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pushnotification))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pushnotification in the database
        List<Pushnotification> pushnotificationList = pushnotificationRepository.findAll();
        assertThat(pushnotificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePushnotificationWithPatch() throws Exception {
        // Initialize the database
        pushnotificationRepository.saveAndFlush(pushnotification);

        int databaseSizeBeforeUpdate = pushnotificationRepository.findAll().size();

        // Update the pushnotification using partial update
        Pushnotification partialUpdatedPushnotification = new Pushnotification();
        partialUpdatedPushnotification.setId(pushnotification.getId());

        partialUpdatedPushnotification.priority(UPDATED_PRIORITY).message(UPDATED_MESSAGE);

        restPushnotificationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPushnotification.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPushnotification))
            )
            .andExpect(status().isOk());

        // Validate the Pushnotification in the database
        List<Pushnotification> pushnotificationList = pushnotificationRepository.findAll();
        assertThat(pushnotificationList).hasSize(databaseSizeBeforeUpdate);
        Pushnotification testPushnotification = pushnotificationList.get(pushnotificationList.size() - 1);
        assertThat(testPushnotification.getFanLevel()).isEqualTo(DEFAULT_FAN_LEVEL);
        assertThat(testPushnotification.getPriority()).isEqualTo(UPDATED_PRIORITY);
        assertThat(testPushnotification.getMessageHeader()).isEqualTo(DEFAULT_MESSAGE_HEADER);
        assertThat(testPushnotification.getMessage()).isEqualTo(UPDATED_MESSAGE);
        assertThat(testPushnotification.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
    }

    @Test
    @Transactional
    void fullUpdatePushnotificationWithPatch() throws Exception {
        // Initialize the database
        pushnotificationRepository.saveAndFlush(pushnotification);

        int databaseSizeBeforeUpdate = pushnotificationRepository.findAll().size();

        // Update the pushnotification using partial update
        Pushnotification partialUpdatedPushnotification = new Pushnotification();
        partialUpdatedPushnotification.setId(pushnotification.getId());

        partialUpdatedPushnotification
            .fanLevel(UPDATED_FAN_LEVEL)
            .priority(UPDATED_PRIORITY)
            .messageHeader(UPDATED_MESSAGE_HEADER)
            .message(UPDATED_MESSAGE)
            .timestamp(UPDATED_TIMESTAMP);

        restPushnotificationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPushnotification.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPushnotification))
            )
            .andExpect(status().isOk());

        // Validate the Pushnotification in the database
        List<Pushnotification> pushnotificationList = pushnotificationRepository.findAll();
        assertThat(pushnotificationList).hasSize(databaseSizeBeforeUpdate);
        Pushnotification testPushnotification = pushnotificationList.get(pushnotificationList.size() - 1);
        assertThat(testPushnotification.getFanLevel()).isEqualTo(UPDATED_FAN_LEVEL);
        assertThat(testPushnotification.getPriority()).isEqualTo(UPDATED_PRIORITY);
        assertThat(testPushnotification.getMessageHeader()).isEqualTo(UPDATED_MESSAGE_HEADER);
        assertThat(testPushnotification.getMessage()).isEqualTo(UPDATED_MESSAGE);
        assertThat(testPushnotification.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void patchNonExistingPushnotification() throws Exception {
        int databaseSizeBeforeUpdate = pushnotificationRepository.findAll().size();
        pushnotification.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPushnotificationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pushnotification.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pushnotification))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pushnotification in the database
        List<Pushnotification> pushnotificationList = pushnotificationRepository.findAll();
        assertThat(pushnotificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPushnotification() throws Exception {
        int databaseSizeBeforeUpdate = pushnotificationRepository.findAll().size();
        pushnotification.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPushnotificationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pushnotification))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pushnotification in the database
        List<Pushnotification> pushnotificationList = pushnotificationRepository.findAll();
        assertThat(pushnotificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPushnotification() throws Exception {
        int databaseSizeBeforeUpdate = pushnotificationRepository.findAll().size();
        pushnotification.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPushnotificationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pushnotification))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pushnotification in the database
        List<Pushnotification> pushnotificationList = pushnotificationRepository.findAll();
        assertThat(pushnotificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePushnotification() throws Exception {
        // Initialize the database
        pushnotificationRepository.saveAndFlush(pushnotification);

        int databaseSizeBeforeDelete = pushnotificationRepository.findAll().size();

        // Delete the pushnotification
        restPushnotificationMockMvc
            .perform(delete(ENTITY_API_URL_ID, pushnotification.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Pushnotification> pushnotificationList = pushnotificationRepository.findAll();
        assertThat(pushnotificationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
