package com.nobre.devocional.dto.devocional;

import java.util.List;

import com.nobre.devocional.dto.CategoriaDTO;
import com.nobre.devocional.dto.usuario.ListarUsuarioDTO;

public record ListarDevocional(

        Long id, String livro, String capitulo, String versiculo, String reflexao,
        ListarUsuarioDTO usuario,
        List<DesafioDTO> desafios,
        CategoriaDTO categoria,
        String imageUrl,
        boolean partilhado

) {

}
