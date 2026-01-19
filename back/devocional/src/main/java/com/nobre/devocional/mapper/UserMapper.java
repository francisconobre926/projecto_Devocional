package com.nobre.devocional.mapper;

import org.mapstruct.Mapper;
// import org.mapstruct.Mapping;

import com.nobre.devocional.dto.usuario.ListarUsuarioDTO;
import com.nobre.devocional.model.UsuarioModel;

@Mapper(componentModel = "spring")

public interface UserMapper {



    ListarUsuarioDTO toUsuario(UsuarioModel usuarioModel);


}
