package com.afl.marvel.broadcast.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Pushnotification.
 */
@Entity
@Table(name = "pushnotification")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Pushnotification implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "fan_level")
    private String fanLevel;

    @Column(name = "priority")
    private String priority;

    @Column(name = "message_header")
    private String messageHeader;

    @Column(name = "message")
    private String message;

    @Column(name = "jhi_timestamp")
    private Instant timestamp;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Pushnotification id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFanLevel() {
        return this.fanLevel;
    }

    public Pushnotification fanLevel(String fanLevel) {
        this.setFanLevel(fanLevel);
        return this;
    }

    public void setFanLevel(String fanLevel) {
        this.fanLevel = fanLevel;
    }

    public String getPriority() {
        return this.priority;
    }

    public Pushnotification priority(String priority) {
        this.setPriority(priority);
        return this;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getMessageHeader() {
        return this.messageHeader;
    }

    public Pushnotification messageHeader(String messageHeader) {
        this.setMessageHeader(messageHeader);
        return this;
    }

    public void setMessageHeader(String messageHeader) {
        this.messageHeader = messageHeader;
    }

    public String getMessage() {
        return this.message;
    }

    public Pushnotification message(String message) {
        this.setMessage(message);
        return this;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public Pushnotification timestamp(Instant timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pushnotification)) {
            return false;
        }
        return id != null && id.equals(((Pushnotification) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pushnotification{" +
            "id=" + getId() +
            ", fanLevel='" + getFanLevel() + "'" +
            ", priority='" + getPriority() + "'" +
            ", messageHeader='" + getMessageHeader() + "'" +
            ", message='" + getMessage() + "'" +
            ", timestamp='" + getTimestamp() + "'" +
            "}";
    }
}
