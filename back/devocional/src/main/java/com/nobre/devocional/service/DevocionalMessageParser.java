// src/main/java/com/nobre/devocional/service/DevocionalMessageParser.java
package com.nobre.devocional.service;

import com.nobre.devocional.service.WhatsAppDevocionalService.ParsedDevocional;
import com.nobre.devocional.service.WhatsAppDevocionalService.TempDesafio;

public class DevocionalMessageParser {

    public static ParsedDevocional parse(String texto) {
        ParsedDevocional out = new ParsedDevocional();

        String raw = (texto == null) ? "" : texto;
        String[] linhas = raw.split("\\r?\\n");

        for (String linhaRaw : linhas) {
            String linha = (linhaRaw == null) ? "" : linhaRaw.trim();
            if (linha.isEmpty()) continue;
            if (linha.equalsIgnoreCase("NOVO")) continue;

            // desafios: "desafio: titulo | descricao"
            if (linha.regionMatches(true, 0, "desafio:", 0, "desafio:".length())) {
                String payload = linha.substring("desafio:".length()).trim();
                TempDesafio td = parseTempDesafio(payload);
                if (td != null) out.desafiosTemp.add(td);
                continue;
            }

            int idx = linha.indexOf(':');
            if (idx < 0) continue;

            String chave = linha.substring(0, idx).trim().toLowerCase();
            String valor = linha.substring(idx + 1).trim();

            switch (chave) {
                case "livro" -> out.livro = valor;
                case "capitulo" -> out.capitulo = valor;
                case "versiculo" -> out.versiculo = valor;
                case "categoria", "categorianome" -> out.categoria = valor;
                case "reflexao" -> out.reflexao = valor;
                case "imageurl", "imagem", "image" -> out.imageUrl = valor;
                default -> { /* ignora */ }
            }
        }

        return out;
    }

    private static TempDesafio parseTempDesafio(String payload) {
        // esperado: "titulo | descricao"
        if (payload == null) return null;

        String[] parts = payload.split("\\|", 2);
        if (parts.length < 2) return null;

        String titulo = parts[0].trim();
        String descricao = parts[1].trim();

        if (titulo.isEmpty() || descricao.isEmpty()) return null;

        return new TempDesafio(titulo, descricao);
    }
}
