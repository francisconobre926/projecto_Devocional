package com.nobre.devocional.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.nobre.devocional.dto.devocional.CriarDevocionalDTO;
import com.nobre.devocional.dto.devocional.DesafioDTO;
import com.nobre.devocional.dto.devocional.ListarDevocional;
import com.nobre.devocional.model.Desafio;
import com.nobre.devocional.model.Devocional;

@Mapper(componentModel = "spring")
public interface DevocionalMapper {

    @Mapping(target = "id", ignore = true) // será gerado pelo banco
    @Mapping(target = "devocional", ignore = true)
    Desafio toDesafio(DesafioDTO dto);

    // Mapeia o DTO do devocional para Devocional
    @Mapping(target = "usuario", ignore = true) // será setado no service
    @Mapping(target = "desafios", ignore = true) // será setado no service
    @Mapping(target = "reflexao", ignore = true) // será setado no service
    Devocional toDevocional(CriarDevocionalDTO dto);

    ListarDevocional toDevocionalDTO(Devocional devocional);
}
