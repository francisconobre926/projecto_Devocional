package com.nobre.devocional.service;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.nobre.devocional.dto.CategoriaDTO;
import com.nobre.devocional.mapper.CategoriaMapper;
import com.nobre.devocional.model.Categoria;
import com.nobre.devocional.repositorio.CategoriaRepository;

import jakarta.transaction.Transactional;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaMapper categoriaMapper;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private TokenService tokenService;

    @Transactional
    public String criarCategoria(@RequestHeader("Authorization") String authHeader,
            @RequestBody CategoriaDTO categoriaDTO) {

        String token = authHeader.replace("Bearer ", "");
        String usuarioId = tokenService.getUsuarioIdfromToken(token);

        categoriaRepository.findByNomeAndAtivoTrueAndUsuarioUsuarioId(categoriaDTO.nome(), usuarioId)
                .ifPresent(c -> {
                    throw new RuntimeException("Categoria já existe");
                });

        Categoria novaCategoria = new Categoria();
        novaCategoria.setNome(categoriaDTO.nome());
        categoriaRepository.save(novaCategoria);

        return "Categoria criada com sucesso!";
    }

    public Page<CategoriaDTO> listarTodasCategorias( int pagina, int tamanhoPagina) {

        Pageable pageable = PageRequest.of(pagina, tamanhoPagina);
        return categoriaRepository.findAll(pageable).map(categoriaMapper::toDTO);
    }

    
    public Page<CategoriaDTO> listarTodasCategorias(@RequestHeader("Authorization") String auth, int pagina,
            int tamanhoPagina) {

        String token = auth.replace("Bearer ", "");
        String usuarioId = tokenService.getUsuarioIdfromToken(token);

        Pageable pageable = PageRequest.of(pagina, tamanhoPagina);
        return categoriaRepository.findByUsuarioUsuarioId(usuarioId, pageable).map(categoriaMapper::toDTO);
    }




    public Page<CategoriaDTO> listarCategoriasAtivas(@RequestHeader("Authorization") String auth, int pagina,
            int tamanhoPagina) {

        String token = auth.replace("Bearer ", "");
        String usuarioId = tokenService.getUsuarioIdfromToken(token);
        Pageable pageable = PageRequest.of(pagina, tamanhoPagina);
        return categoriaRepository.findByAtivoTrueAndUsuarioUsuarioId(usuarioId, pageable).map(categoriaMapper::toDTO);
    }



    @Transactional
    public String desativarCategoria(Long id) {

        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        categoria.desativar();
        categoriaRepository.save(categoria);

        return "Categoria desativada com sucesso!";
    }

    @Transactional
    public String ativarCategoria(Long id) {

        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        categoria.ativar();
        categoriaRepository.save(categoria);

        return "Categoria ativada com sucesso!";
    }

    public ResponseEntity<?> editarCategoria(@RequestHeader("Authorization") String auth,
            @RequestBody CategoriaDTO categoriaDTO) {

        String token = auth.replace("Bearer ", "");
        String usuarioId = tokenService.getUsuarioIdfromToken(token);

        Categoria categoria = categoriaRepository.findByAtivoTrueAndUsuarioUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Categoria nao encontrada para o usuario"));

        if (categoriaDTO == null) {
            return ResponseEntity.status(Response.SC_BAD_REQUEST).body("Dados invalidos para editar a categoria");
        }

        if (categoriaDTO.nome() != null) {
            categoria.setNome(categoriaDTO.nome());
        }

        return ResponseEntity.status(Response.SC_ACCEPTED).body("Categoria actualizada com sucesso!");

    }

}
