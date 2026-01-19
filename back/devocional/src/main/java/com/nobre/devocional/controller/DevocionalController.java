package com.nobre.devocional.controller;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.nobre.devocional.dto.devocional.AtualizarDevocionalDTO;
import com.nobre.devocional.dto.devocional.CriarDevocionalDTO;
import com.nobre.devocional.dto.devocional.ListarDevocional;
import com.nobre.devocional.service.DevocionalService;

@RestController
@RequestMapping("/devocional")
public class DevocionalController {

    @Autowired
    private DevocionalService devocionalService;

    @PostMapping
    public ResponseEntity<?> criarDevocional(@RequestHeader("Authorization") String authHeader,
            @RequestBody CriarDevocionalDTO criarDevocionalDTO) {

        return ResponseEntity.status(Response.SC_CREATED)
                .body(devocionalService.criarDevocional(authHeader, criarDevocionalDTO));
    }

    @GetMapping("/listar")
    public ResponseEntity<Page<ListarDevocional>> listarDevocionais(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int pag,
            @RequestParam(defaultValue = "25") int size) {

        Page<ListarDevocional> devocionais = devocionalService.listarDevocionaisPorUsuario(authHeader, pag, size);
        return ResponseEntity.ok(devocionais);
    }

    @GetMapping("/todos")
    public ResponseEntity<Page<ListarDevocional>> listarTodosDevocionais(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int pag,
            @RequestParam(defaultValue = "10") int size) {

        Page<ListarDevocional> devocionais = devocionalService.listarDevocionais(authHeader, pag, size);
        return ResponseEntity.ok(devocionais);
    }

    
    @GetMapping("/partilhados")
    public ResponseEntity<Page<ListarDevocional>> listarDevocionaisPartilhados(
            @RequestParam(defaultValue = "0") int pag,
            @RequestParam(defaultValue = "10") int size) {

        Page<ListarDevocional> devocionais = devocionalService.listarDevocionaisPartilhados(pag, size);
        return ResponseEntity.ok(devocionais);
    }

    @PatchMapping("/atualizar/{id}")
    public ResponseEntity<?> atualizarDevocional(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody AtualizarDevocionalDTO atualizarDevocionalDTO,
            @PathVariable Long id) {

        return ResponseEntity.ok(devocionalService.atualizarDevocional(authHeader, atualizarDevocionalDTO, id));
    }

}