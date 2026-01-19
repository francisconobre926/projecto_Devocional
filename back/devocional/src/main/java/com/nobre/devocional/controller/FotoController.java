package com.nobre.devocional.controller;

import java.util.concurrent.ThreadLocalRandom;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nobre.devocional.dto.unsplashImagem.FotoDTOResponse;
import com.nobre.devocional.service.FotoService;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/fotos")
public class FotoController {

    private final FotoService fotoService;

    public FotoController(FotoService fotoService) {
        this.fotoService = fotoService;
    }

    /**
     * Teste “manual”:
     * GET /fotos/buscar?query=amor&page=1&size=10
     */
    @GetMapping("/buscar")
    public Mono<ResponseEntity<FotoDTOResponse>> buscar(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "1") int size) {
        return fotoService.buscarFoto(query, page, size)
                .map(ResponseEntity::ok);
    }

    /**
     * Teste “automático”:
     * - gera page e size para variar e não retornar sempre a mesma foto
     * GET /fotos/por-termo?termo=fe
     */
    @GetMapping("/por-termo")
    public Mono<ResponseEntity<FotoDTOResponse>> buscarPorTermo(
            @RequestParam("termo") String termo) {
        int page = ThreadLocalRandom.current().nextInt(1, 6); // 1..5
        int size = 10; // fixo (recomendado)

        return fotoService.buscarFoto(termo, page, size)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/galeria")
    public Mono<ResponseEntity<java.util.List<FotoDTOResponse>>> galeria(
            @RequestParam String query,
            @RequestParam(required = false) Integer page,
            @RequestParam(defaultValue = "10") int tam) {

        int randomPage = java.util.concurrent.ThreadLocalRandom.current().nextInt(1, 6); // 1..5
        int finalPage = (page == null) ? randomPage : Math.max(page, 1);
        return fotoService.buscarGaleria(query, finalPage, tam)
                .map(ResponseEntity::ok);
    }
}