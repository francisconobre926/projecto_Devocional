package com.nobre.devocional.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.nobre.devocional.dto.CategoriaDTO;
import com.nobre.devocional.mapper.CategoriaMapper;
import com.nobre.devocional.model.Categoria;
import com.nobre.devocional.model.UsuarioModel; // ajuste para teu model real
import com.nobre.devocional.repositorio.CategoriaRepository;
import com.nobre.devocional.repositorio.UsuarioRepository; // ajuste para teu repo real

import jakarta.transaction.Transactional;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaMapper categoriaMapper;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository; // necessário para associar a categoria ao usuário

    private String getUsuarioId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return tokenService.getUsuarioIdfromToken(token);
    }

    @Transactional
    public String criarCategoria(String authHeader, CategoriaDTO categoriaDTO) {
        String usuarioId = getUsuarioId(authHeader);

        String nome = (categoriaDTO == null || categoriaDTO.nome() == null) ? "" : categoriaDTO.nome().trim();
        if (nome.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o nome da categoria.");
        }

        nome= nome.toLowerCase();
        
        // (para o mesmo usuário)
        categoriaRepository.findByNomeAndUsuarioUsuarioId(nome, usuarioId)
                .ifPresent(c -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Categoria já existe");
                });

        UsuarioModel usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        Categoria nova = new Categoria();
        nova.setNome(nome);
        nova.setUsuario(usuario);
        nova.ativar();

        try {
            categoriaRepository.save(nova);
        } catch (org.springframework.dao.DataIntegrityViolationException ex) {
            // segurança extra caso o unique do banco dispare
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Categoria já existe");
        }

        return "Categoria criada com sucesso!";
    }

    public Page<CategoriaDTO> listarMinhasCategorias(String authHeader, int pagina, int tamanhoPagina) {
        String usuarioId = getUsuarioId(authHeader);
        Pageable pageable = PageRequest.of(pagina, tamanhoPagina);

        return categoriaRepository
                .findByUsuarioUsuarioId(usuarioId, pageable)
                .map(categoriaMapper::toDTO);
    }

    public Page<CategoriaDTO> listarMinhasCategoriasAtivas(String authHeader, int pagina, int tamanhoPagina) {
        String usuarioId = getUsuarioId(authHeader);
        Pageable pageable = PageRequest.of(pagina, tamanhoPagina);

        return categoriaRepository
                .findByAtivoTrueAndUsuarioUsuarioId(usuarioId, pageable)
                .map(categoriaMapper::toDTO);
    }

    @Transactional
    public String ativarCategoria(String authHeader, Long id) {
        String usuarioId = getUsuarioId(authHeader);

        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        // segurança: só dono pode mexer
        if (categoria.getUsuario() == null || !usuarioId.equals(categoria.getUsuario().getUsuarioId())) {
            throw new RuntimeException("Sem permissão para alterar esta categoria");
        }

        categoria.ativar();
        categoriaRepository.save(categoria);
        return "Categoria ativada com sucesso!";
    }

    @Transactional
    public String desativarCategoria(String authHeader, Long id) {
        String usuarioId = getUsuarioId(authHeader);

        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        if (categoria.getUsuario() == null || !usuarioId.equals(categoria.getUsuario().getUsuarioId())) {
            throw new RuntimeException("Sem permissão para alterar esta categoria");
        }

        categoria.desativar();
        categoriaRepository.save(categoria);
        return "Categoria desativada com sucesso!";
    }

    @Transactional
    public CategoriaDTO editarCategoria(String authHeader, Long id, CategoriaDTO categoriaDTO) {
        String usuarioId = getUsuarioId(authHeader);

        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        if (categoria.getUsuario() == null || !usuarioId.equals(categoria.getUsuario().getUsuarioId())) {
            throw new RuntimeException("Sem permissão para editar esta categoria");
        }

        String nome = (categoriaDTO == null || categoriaDTO.nome() == null) ? "" : categoriaDTO.nome().trim();
        if (nome.isEmpty())
            throw new RuntimeException("Informe o nome da categoria.");

        categoria.setNome(nome);
        categoriaRepository.save(categoria);

        return categoriaMapper.toDTO(categoria);
    }
}
