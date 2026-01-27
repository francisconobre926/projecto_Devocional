package com.nobre.devocional.service;

import com.nobre.devocional.dto.devocional.CriarDevocionalDTO;
import com.nobre.devocional.dto.devocional.DesafioDTO;
import com.nobre.devocional.model.Devocional;
import com.nobre.devocional.model.UsuarioModel;
import com.nobre.devocional.repositorio.UsuarioRepository;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class WhatsAppDevocionalService {

    @Autowired
    private  DevocionalService devocionalService;
    
    @Autowired
    private  DesafioService desafioService;
    
    @Autowired
    private  UsuarioRepository usuarioRepository;

  

    @Transactional
    public String processarMensagem(String from, String body) {

        // From vem assim: "whatsapp:+25884xxxxxxx"
        String telefone = normalizarTelefone(from); // "+25884xxxxxxx"

        // 1) achar o usuário pelo telefone
        Optional<UsuarioModel> optUsuario = usuarioRepository.findByTelWhatsapp(telefone);
        if (optUsuario.isEmpty()) {
            return "Seu número não está vinculado a um usuário. Entre no site e associe seu telefone.";
        }
        UsuarioModel usuario = optUsuario.get();

        String texto = body == null ? "" : body.trim();

        // ajuda
        if (!texto.toUpperCase().startsWith("NOVO")) {
            return """
            Para criar, envie:

            NOVO
            livro: ...
            capitulo: ...
            versiculo: ...
            categoria: ...
            reflexao: ...
            (opcional) imageUrl: ...
            (opcional) desafio: titulo | descricao
            """.trim();
        }

        ParsedDevocional parsed = DevocionalMessageParser.parse(texto);

        // valida obrigatórios
        if (isBlank(parsed.livro) || isBlank(parsed.capitulo) || isBlank(parsed.versiculo)
                || isBlank(parsed.categoria) || isBlank(parsed.reflexao)) {
            return "Faltam campos obrigatórios (livro, capitulo, versiculo, categoria, reflexao).";
        }

        // 2) criar devocional SEM desafios (porque ainda não temos id)
        CriarDevocionalDTO dtoSemDesafios = new CriarDevocionalDTO(
                parsed.livro,
                parsed.capitulo,
                parsed.versiculo,
                parsed.categoria,
                parsed.reflexao,
                List.of(),        // vazio aqui
                parsed.imageUrl
        );

        Devocional devocionalCriado = devocionalService.criarDevocionalPorUsuario(usuario.getUsuarioId(), dtoSemDesafios);

        // 3) salvar desafios agora com devocionalId
        int totalDesafios = 0;
        for (TempDesafio td : parsed.desafiosTemp) {
            if (isBlank(td.titulo) || isBlank(td.descricao)) continue;

            DesafioDTO desafioDTO = new DesafioDTO(
                td.titulo,
                td.descricao,
                devocionalCriado.getId()
            );

            desafioService.criaDesafio(desafioDTO);
            totalDesafios++;
        }

        return "Devocional criado com sucesso. ID: " + devocionalCriado.getId()
                + (totalDesafios > 0 ? (" | Desafios: " + totalDesafios) : "");
    }

    private String normalizarTelefone(String from) {
        if (from == null) return "";
        return from.replace("whatsapp:", "").trim(); // "+258..."
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    // Dados parseados
    public static class ParsedDevocional {
        String livro;
        String capitulo;
        String versiculo;
        String categoria;
        String reflexao;
        String imageUrl;
        List<TempDesafio> desafiosTemp = new ArrayList<>();
    }

    public static class TempDesafio {
        String titulo;
        String descricao;

        public TempDesafio(String titulo, String descricao) {
            this.titulo = titulo;
            this.descricao = descricao;
        }
    }
}
