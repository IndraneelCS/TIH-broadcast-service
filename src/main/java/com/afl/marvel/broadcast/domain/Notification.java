package com.afl.marvel.broadcast.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Notification.
 */
@Entity
@Table(name = "notification")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Notification implements Serializable {

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

    @Column(name = "jhi_header")
    private String header;

    @Column(name = "jhi_body")
    private String body;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Notification id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFanLevel() {
        return this.fanLevel;
    }

    public Notification fanLevel(String fanLevel) {
        this.setFanLevel(fanLevel);
        return this;
    }

    public void setFanLevel(String fanLevel) {
        this.fanLevel = fanLevel;
    }

    public String getPriority() {
        return this.priority;
    }

    public Notification priority(String priority) {
        this.setPriority(priority);
        return this;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getHeader() {
        return this.header;
    }

    public Notification header(String header) {
        this.setHeader(header);
        return this;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public String getBody() {
        return this.body;
    }

    public Notification body(String body) {
        this.setBody(body);
        return this;
    }

    public void setBody(String body) {
        this.body = body;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Notification)) {
            return false;
        }
        return id != null && id.equals(((Notification) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Notification{" +
            "id=" + getId() +
            ", fanLevel='" + getFanLevel() + "'" +
            ", priority='" + getPriority() + "'" +
            ", header='" + getHeader() + "'" +
            ", body='" + getBody() + "'" +
            "}";
    }
}
