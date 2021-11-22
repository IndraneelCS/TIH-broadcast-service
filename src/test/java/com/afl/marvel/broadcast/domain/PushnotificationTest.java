package com.afl.marvel.broadcast.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.afl.marvel.broadcast.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PushnotificationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pushnotification.class);
        Pushnotification pushnotification1 = new Pushnotification();
        pushnotification1.setId(1L);
        Pushnotification pushnotification2 = new Pushnotification();
        pushnotification2.setId(pushnotification1.getId());
        assertThat(pushnotification1).isEqualTo(pushnotification2);
        pushnotification2.setId(2L);
        assertThat(pushnotification1).isNotEqualTo(pushnotification2);
        pushnotification1.setId(null);
        assertThat(pushnotification1).isNotEqualTo(pushnotification2);
    }
}
