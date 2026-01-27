package com.nobre.devocional.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.nobre.devocional.dto.unsplashImagem.FotoDTOResponse;
import com.nobre.devocional.dto.unsplashImagem.RespostaImagem;
import com.nobre.devocional.dto.unsplashImagem.UrlImagem;

import reactor.core.publisher.Mono;

@Service
public class FotoService {

        @Value("${access_key}")
        private String access_Key;

        private final WebClient webClient;
        
        public FotoService() {
                this.webClient = WebClient.builder()
                                .baseUrl("https://api.unsplash.com")
                                .build();
        }

        public Mono<FotoDTOResponse> buscarFoto(String query, int page, int tam) {

                String termo = (query == null || query.isBlank()) ? "faith" : query.trim();

                return webClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/search/photos")
                                                .queryParam("query", termo)
                                                .queryParam("page", Math.max(page, 1))
                                                .queryParam("per_page", Math.min(Math.max(tam, 1), 30))
                                                .build())
                                .header(HttpHeaders.AUTHORIZATION, "Client-ID " + access_Key.trim())
                                .retrieve()

                                // 👇 mostra o erro REAL quando Unsplash responde 4xx/5xx
                                .onStatus(
                                                status -> status.is4xxClientError() || status.is5xxServerError(),
                                                response -> response.bodyToMono(String.class).flatMap(body -> {
                                                        System.err.println("Unsplash STATUS: " + response.statusCode());
                                                        System.err.println("Unsplash BODY: " + body);
                                                        return Mono.error(new RuntimeException(
                                                                        "Erro Unsplash: " + response.statusCode()));
                                                }))

                                .bodyToMono(RespostaImagem.class)
                                .map(response -> {
                                        if (response != null && response.results() != null
                                                        && !response.results().isEmpty()) {
                                                UrlImagem fotoApi = response.results().get(0);

                                                return new FotoDTOResponse(
                                                                fotoApi.urls().regular(),
                                                                fotoApi.descricao());
                                        }

                                        // sem resultados (não é erro)
                                        return new FotoDTOResponse(null, "Sem resultados");
                                })

                                // 👇 não esconde mais o erro: loga e devolve algo controlado
                                .onErrorResume(e -> {
                                        System.err.println("Erro ao buscar no Unsplash:");
                                        e.printStackTrace();
                                        return Mono.just(new FotoDTOResponse(null, "Erro ao buscar"));
                                });
        }

        
        public Mono<java.util.List<FotoDTOResponse>> buscarGaleria(String query, int page, int tam) {

                String termo = (query == null || query.isBlank()) ? "faith" : query.trim();
                int perPage = Math.min(Math.max(tam, 1), 30);
                int safePage = Math.max(page, 1);

                return webClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/search/photos")
                                                .queryParam("query", termo)
                                                .queryParam("page", safePage)
                                                .queryParam("per_page", perPage)
                                                .build())
                                .header(HttpHeaders.AUTHORIZATION, "Client-ID " + access_Key.trim())
                                .retrieve()
                                .onStatus(
                                                status -> status.is4xxClientError() || status.is5xxServerError(),
                                                response -> response.bodyToMono(String.class).flatMap(body -> {
                                                        System.err.println("Unsplash STATUS: " + response.statusCode());
                                                        System.err.println("Unsplash BODY: " + body);
                                                        return Mono.error(new RuntimeException(
                                                                        "Erro Unsplash: " + response.statusCode()));
                                                }))
                                .bodyToMono(RespostaImagem.class)
                                .map(resp -> {
                                        if (resp == null || resp.results() == null || resp.results().isEmpty()) {
                                                return java.util.List.<FotoDTOResponse>of();
                                        }

                                        return resp.results().stream()
                                                        .filter(r -> r != null && r.urls() != null
                                                                        && r.urls().regular() != null)
                                                        .limit(perPage)
                                                        .map(r -> new FotoDTOResponse(r.urls().regular(),
                                                                        r.descricao()))
                                                        .toList();
                                })
                                .onErrorResume(e -> {
                                        System.err.println("Erro ao buscar galeria no Unsplash:");
                                        e.printStackTrace();
                                        return Mono.just(java.util.List.of());
                                });
        }

}
