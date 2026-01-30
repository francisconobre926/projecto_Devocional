package com.nobre.devocional.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.nobre.devocional.dto.CategoriaDTO;
import com.nobre.devocional.model.Categoria;

@Mapper(componentModel = "spring")
public interface CategoriaMapper {

    @Mapping(target ="categoriaId", source = "id")
    CategoriaDTO toDTO(Categoria categoria);
}
