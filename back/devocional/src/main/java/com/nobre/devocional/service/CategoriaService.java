package com.nobre.devocional.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

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

    @Transactional
    public String criarCategoria(@RequestBody CategoriaDTO categoriaDTO) {

        categoriaRepository.findByNomeAndAtivoTrue(categoriaDTO.nome())
                .ifPresent(c -> {
                    throw new RuntimeException("Categoria já existe");
                });

        Categoria novaCategoria = new Categoria();
        novaCategoria.setNome(categoriaDTO.nome());
        categoriaRepository.save(novaCategoria);

        return "Categoria criada com sucesso!";
    }

    public Page<CategoriaDTO> listarCategorias(int pagina, int tamanhoPagina) {

        Pageable pageable = PageRequest.of(pagina, tamanhoPagina);
        return categoriaRepository.findAll(pageable).map(categoriaMapper::toDTO);
    }

    public Page<CategoriaDTO> listarCategoriasAtivas(int pagina, int tamanhoPagina) {

        Pageable pageable = PageRequest.of(pagina, tamanhoPagina);
        return categoriaRepository.findByAtivoTrue(pageable).map(categoriaMapper::toDTO);
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

}
