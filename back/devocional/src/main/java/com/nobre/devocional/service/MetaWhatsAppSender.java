package com.nobre.devocional.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class MetaWhatsAppSender {

    private final RestClient rest;

    @Value("${meta.whatsapp.phone-number-id}")
    private String phoneNumberId;

    @Value("${meta.whatsapp.access-token}")
    private String accessToken;

    public MetaWhatsAppSender(RestClient.Builder builder) {
        this.rest = builder.build();
    }

    public void sendText(String to, String text) {
        String url = "https://graph.facebook.com/v19.0/" + phoneNumberId + "/messages";

        Map<String, Object> body = Map.of(
                "messaging_product", "whatsapp",
                "to", to,
                "type", "text",
                "text", Map.of("body", text == null ? "" : text));

        rest.post()
                .uri(url)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + accessToken)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }
}
