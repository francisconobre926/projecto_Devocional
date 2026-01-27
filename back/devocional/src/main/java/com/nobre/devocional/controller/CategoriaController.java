package com.nobre.devocional.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.nobre.devocional.service.CategoriaService;
import com.nobre.devocional.dto.CategoriaDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/categorias")

public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    

    @PostMapping
    public ResponseEntity<String> criarCategoria(@RequestHeader("Authorization") String authHeader,
            @RequestBody CategoriaDTO categoriaDTO) {

        return ResponseEntity.status(201).body(categoriaService.criarCategoria(authHeader, categoriaDTO));
    }

    @PatchMapping("/editar")
    public ResponseEntity<?> editarCategorias(@RequestHeader("Authorization") String authHeader,
            @RequestBody CategoriaDTO categoriaDTO) {

        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(categoriaService.editarCategoria(authHeader, categoriaDTO));

    }

    @PostMapping("/ativar/{id}")
    public ResponseEntity<?> ativarCategoria(@PathVariable Long id) {
        return ResponseEntity.accepted().body(categoriaService.ativarCategoria(id));
    }

    @PostMapping("/desativar/{id}")
    public ResponseEntity<?> desativarCategoria(@PathVariable Long id) {
        return ResponseEntity.accepted().body(categoriaService.desativarCategoria(id));
    }

    @GetMapping("/todas")
    public ResponseEntity<?> listarTodasCategorias(@RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int pag, @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.status(HttpStatus.OK).body(categoriaService.listarTodasCategorias(authHeader, pag, size));
    }

}
