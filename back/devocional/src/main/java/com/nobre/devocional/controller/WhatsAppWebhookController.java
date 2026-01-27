package com.nobre.devocional.controller;

import com.nobre.devocional.service.MetaWhatsAppSender;
import com.nobre.devocional.service.WhatsAppDevocionalService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/whatsapp")
public class WhatsAppWebhookController {

    private final WhatsAppDevocionalService whatsAppDevocionalService;
    private final MetaWhatsAppSender metaWhatsAppSender;

    @Value("${meta.whatsapp.verify-token}")
    private String verifyToken;

    public WhatsAppWebhookController(
            WhatsAppDevocionalService whatsAppDevocionalService,
            MetaWhatsAppSender metaWhatsAppSender
    ) {
        this.whatsAppDevocionalService = whatsAppDevocionalService;
        this.metaWhatsAppSender = metaWhatsAppSender;
    }

    // 1) Verificação do webhook (Meta chama esse GET)
    @GetMapping("/webhook")
    public ResponseEntity<String> verify(
            @RequestParam(name = "hub.mode", required = false) String mode,
            @RequestParam(name = "hub.verify_token", required = false) String token,
            @RequestParam(name = "hub.challenge", required = false) String challenge
    ) {
        if ("subscribe".equals(mode) && verifyToken != null && verifyToken.equals(token)) {
            return ResponseEntity.ok(challenge); // tem que devolver exatamente o challenge
        }
        return ResponseEntity.status(403).body("Forbidden");
    }

    // 2) Receber eventos (mensagens chegam em JSON)
    @PostMapping("/webhook")
    public ResponseEntity<Void> receive(@RequestBody Map<String, Object> payload) {

        // Extrai "from" e "body" do JSON da Meta
        MetaInbound inbound = MetaInbound.tryParse(payload);
        if (inbound == null) {
            // pode ser status, ack, evento diferente, etc.
            return ResponseEntity.ok().build();
        }

        String from = inbound.from();     // ex: "25884xxxxxxx" (sem whatsapp:)
        String body = inbound.text();     // texto do usuário

        // reaproveita tua lógica
        // OBS: teu normalizarTelefone remove "whatsapp:"; aqui não existe, então podes ajustar
        String resposta = whatsAppDevocionalService.processarMensagem("whatsapp:+" + from, body);

        // Envia a resposta chamando a API da Meta (não é no retorno do webhook)
        metaWhatsAppSender.sendText(from, resposta);

        return ResponseEntity.ok().build();
    }

    /**
     * Parser mínimo do payload da Meta:
     * entry[0].changes[0].value.messages[0].from
     * entry[0].changes[0].value.messages[0].text.body
     */
    record MetaInbound(String from, String text) {
        @SuppressWarnings("unchecked")
        static MetaInbound tryParse(Map<String, Object> payload) {
            try {
                List<Map<String, Object>> entry = (List<Map<String, Object>>) payload.get("entry");
                if (entry == null || entry.isEmpty()) return null;

                List<Map<String, Object>> changes = (List<Map<String, Object>>) entry.get(0).get("changes");
                if (changes == null || changes.isEmpty()) return null;

                Map<String, Object> value = (Map<String, Object>) changes.get(0).get("value");
                if (value == null) return null;

                List<Map<String, Object>> messages = (List<Map<String, Object>>) value.get("messages");
                if (messages == null || messages.isEmpty()) return null;

                Map<String, Object> msg = messages.get(0);
                String from = (String) msg.get("from");
                if (from == null || from.isBlank()) return null;

                String type = (String) msg.get("type");
                if (!"text".equals(type)) return null; // por enquanto só texto

                Map<String, Object> text = (Map<String, Object>) msg.get("text");
                if (text == null) return null;

                String body = (String) text.get("body");
                if (body == null) body = "";

                return new MetaInbound(from.trim(), body.trim());
            } catch (Exception e) {
                return null;
            }
        }
    }
}
