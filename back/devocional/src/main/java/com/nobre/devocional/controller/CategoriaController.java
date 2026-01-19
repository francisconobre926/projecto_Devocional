package com.nobre.devocional.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.nobre.devocional.service.CategoriaService;
// import com.nobre.devocional.service.TokenService;
import com.nobre.devocional.dto.CategoriaDTO;

@RestController
@RequestMapping("/categorias")

public class CategoriaController {

    @Autowired
    private CategoriaService CategoriaService;

    // @Autowired
    // private TokenService tokenService;

    @PostMapping
    public ResponseEntity<String> criarCategoria(@RequestHeader("Authorization") String authHeader, @RequestBody CategoriaDTO categoriaDTO) {
    
        // String token = authHeader.replace("Bearer ", "");
        // String usuarioId=tokenService.getUsuarioIdfromToken(token);
        return ResponseEntity.status(201).body(CategoriaService.criarCategoria(categoriaDTO));
    }
}
