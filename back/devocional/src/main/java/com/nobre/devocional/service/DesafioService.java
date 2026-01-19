package com.nobre.devocional.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.nobre.devocional.dto.devocional.DesafioDTO;
import com.nobre.devocional.model.Desafio;
import com.nobre.devocional.model.Devocional;
import com.nobre.devocional.repositorio.DesafioRepository;
import com.nobre.devocional.repositorio.DevocionalRepository;

@Service
public class DesafioService {




    @Autowired
    private DesafioRepository desafioRepository;

    @Autowired
    private DevocionalRepository devocionalRepository;  

    public Desafio criaDesafio(@RequestBody DesafioDTO criarDesafioDTO) {

        Devocional devocional=devocionalRepository.findById(criarDesafioDTO.devocional_id())
        .orElseThrow(() -> new RuntimeException("Devocional nao encontrado!"));

        Desafio desafio = new Desafio();

        desafio.setDescricao(criarDesafioDTO.descricao());
        desafio.setTitulo(criarDesafioDTO.titulo());
        desafio.setDevocional(devocional);

        desafioRepository.save(desafio);

        return desafio;
    }


}
