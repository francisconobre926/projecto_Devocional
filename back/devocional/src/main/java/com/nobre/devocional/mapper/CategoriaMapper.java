package com.nobre.devocional.mapper;

import org.mapstruct.Mapper;

import com.nobre.devocional.dto.CategoriaDTO;
import com.nobre.devocional.model.Categoria;

@Mapper(componentModel = "spring")
public interface CategoriaMapper {

    CategoriaDTO toDTO(Categoria categoria);
}
