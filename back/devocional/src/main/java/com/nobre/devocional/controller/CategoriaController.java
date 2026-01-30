package com.nobre.devocional.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nobre.devocional.dto.CategoriaDTO;
import com.nobre.devocional.service.CategoriaService;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @PostMapping
    public ResponseEntity<String> criarCategoria(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CategoriaDTO categoriaDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoriaService.criarCategoria(authHeader, categoriaDTO));
    }

    @GetMapping("/todas")
    public ResponseEntity<?> listarMinhasCategorias(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int pag,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(categoriaService.listarMinhasCategorias(authHeader, pag, size));
    }

    @GetMapping("/ativas")
    public ResponseEntity<?> listarMinhasCategoriasAtivas(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int pag,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(categoriaService.listarMinhasCategoriasAtivas(authHeader, pag, size));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> editarCategoria(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody CategoriaDTO categoriaDTO) {
        return ResponseEntity.ok(categoriaService.editarCategoria(authHeader, id, categoriaDTO));
    }

    @PostMapping("/ativar/{id}")
    public ResponseEntity<?> ativarCategoria(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        return ResponseEntity.accepted().body(categoriaService.ativarCategoria(authHeader, id));
    }

    @PostMapping("/desativar/{id}")
    public ResponseEntity<?> desativarCategoria(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        return ResponseEntity.accepted().body(categoriaService.desativarCategoria(authHeader, id));
    }
}
