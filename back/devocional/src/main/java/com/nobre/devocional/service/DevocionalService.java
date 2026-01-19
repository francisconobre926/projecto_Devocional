package com.nobre.devocional.service;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
// import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.server.ResponseStatusException;

import com.nobre.devocional.dto.devocional.AtualizarDevocionalDTO;
import com.nobre.devocional.dto.devocional.CriarDevocionalDTO;
import com.nobre.devocional.dto.devocional.ListarDevocional;
// import com.nobre.devocional.dto.unsplashImagem.FotoDTOResponse;
import com.nobre.devocional.mapper.DevocionalMapper;
// import com.nobre.devocional.mapper.UserMapper;
import com.nobre.devocional.model.Desafio;
import com.nobre.devocional.model.Devocional;
import com.nobre.devocional.repositorio.CategoriaRepository;
// import com.nobre.devocional.model.UsuarioModel;
import com.nobre.devocional.repositorio.DesafioRepository;
import com.nobre.devocional.repositorio.DevocionalRepository;
import com.nobre.devocional.repositorio.UsuarioRepository;

@Service
public class DevocionalService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DesafioRepository desafioRepository;

    @Autowired
    private DevocionalMapper devocionalMapper;

    @Autowired
    private DevocionalRepository devocionalRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public ResponseEntity<?> criarDevocional(@RequestHeader("Authorization") String authHeader,
            @RequestBody CriarDevocionalDTO criarDevocionalDTO) {

        String token = authHeader.replace("Bearer ", "");
        String usuarioId = tokenService.getUsuarioIdfromToken(token);

        Devocional devocional = new Devocional();
        devocional.setUsuario(usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado!")));

        devocional.setCategoria(categoriaRepository.findByNomeAndAtivoTrue(criarDevocionalDTO.categoriaNome())
                .orElseThrow(() -> new RuntimeException("Categoria nao encontrada")));

        devocional.setReflexao(criarDevocionalDTO.reflexao());
        devocional.setVersiculo(criarDevocionalDTO.versiculo());
        devocional.setCapitulo(criarDevocionalDTO.capitulo());
        devocional.setLivro(criarDevocionalDTO.livro());
        devocionalRepository.save(devocional);

        if (criarDevocionalDTO.desafios() != null && !criarDevocionalDTO.desafios().isEmpty()) {
            List<Desafio> desafios = criarDevocionalDTO.desafios().stream()
                    .map(d -> {
                        Desafio desafio = devocionalMapper.toDesafio(d);
                        desafio.setDevocional(devocional);

                        return desafio;
                    }).collect(Collectors.toList());

            devocional.setDesafios(desafios);
            desafioRepository.saveAll(desafios);
        }

        devocional.setImageUrl(criarDevocionalDTO.imageUrl());
        devocionalRepository.save(devocional);

        return ResponseEntity.status(Response.SC_CREATED).body("Devocional criado com sucesso!");
    }

    
    public Page<ListarDevocional> listarDevocionais(@RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int pag,
            @RequestParam(defaultValue = "10") int size) {

        String token = authHeader.replace("Bearer ", "");
        String usuarioId = tokenService.getUsuarioIdfromToken(token);

        Pageable paginacao = PageRequest.of(pag, size);

        Page<Devocional> devocionais = devocionalRepository.findAllByAtivoTrue(paginacao);

        return devocionais.map(devocionalMapper::toDevocionalDTO);
    }

    // listar devocionais
    public Page<ListarDevocional> listarDevocionaisPorUsuario(@RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int pag,
            @RequestParam(defaultValue = "25") int size) {

        String token = authHeader.replace("Bearer ", "");
        String usuarioId = tokenService.getUsuarioIdfromToken(token);

        Pageable paginacao = PageRequest.of(pag, size);

        Page<Devocional> devocionais = devocionalRepository.findByUsuarioUsuarioId(usuarioId, paginacao);

        return devocionais.map(devocionalMapper::toDevocionalDTO);
    }

    public Page<ListarDevocional> listarDevocionaisPartilhados(
            @RequestParam(defaultValue = "0") int pag,
            @RequestParam(defaultValue = "10") int size) {

        Pageable paginacao = PageRequest.of(pag, size);

        Page<Devocional> devocionais = devocionalRepository.findAllByPartilhadoTrue(paginacao);

        return devocionais.map(devocionalMapper::toDevocionalDTO);

    }

    public ResponseEntity<?> atualizarDevocional(@RequestHeader("Authorization") String authHeader,
            @RequestBody AtualizarDevocionalDTO atualizarDevocionalDTO,
            @PathVariable Long devocionalId) {

        String token = authHeader.replace("Bearer ", "");
        String usuarioId = tokenService.getUsuarioIdfromToken(token);

        Devocional devocional = devocionalRepository.findByIdAndUsuarioUsuarioId(devocionalId, usuarioId)
                .orElseThrow(
                        () -> new RuntimeException("Devocional nao encontrado para o usuario autenticado."));

        if (atualizarDevocionalDTO == null) {
            return ResponseEntity.status(Response.SC_BAD_REQUEST)
                    .body("Dados invalidos para atualizacao do devocional.");
        }

        if (atualizarDevocionalDTO.livro() != null) {
            devocional.setLivro(atualizarDevocionalDTO.livro());

        }
        if (atualizarDevocionalDTO.capitulo() != null) {
            devocional.setCapitulo(atualizarDevocionalDTO.capitulo());

        }
        if (atualizarDevocionalDTO.imageUrl() != null) {
            devocional.setImageUrl(atualizarDevocionalDTO.imageUrl());

        }

        if (atualizarDevocionalDTO.versiculo() != null) {
            devocional.setVersiculo(atualizarDevocionalDTO.versiculo());
        }

        if (atualizarDevocionalDTO.reflexao() != null) {
            devocional.setReflexao(atualizarDevocionalDTO.reflexao());
        }

        if (atualizarDevocionalDTO.partilhado()) {
            devocional.partilhar();
        } else {
            devocional.despartilhar();
        }
        devocionalRepository.save(devocional);

        return ResponseEntity.status(Response.SC_OK).body("Devocional atualizado com sucesso!");
    }

    // private int randomBetween(int min, int max) {
    // return ThreadLocalRandom.current().nextInt(min, max + 1);
    // }

}
