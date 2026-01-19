package com.nobre.devocional.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nobre.devocional.dto.usuario.EditarUsuarioDTO;
import com.nobre.devocional.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/editar/{id}")
    public ResponseEntity<?> editarUsuario(@PathVariable("id") String id,
            @RequestBody @Valid EditarUsuarioDTO editarUsuarioDTO) {

        return ResponseEntity.ok(usuarioService.editarUsuario(id, editarUsuarioDTO));
    }

    @GetMapping("/listar/{id}")
    public ResponseEntity<?> listarUsuarioPorId(@PathVariable("id") String id) {

        return ResponseEntity.ok(usuarioService.getUserById(id));
    }

}
