package com.nobre.devocional.dto.devocional;

public record AtualizarDevocionalDTO(

        String livro,
        String capitulo,
        String versiculo,

        String reflexao,

        String imageUrl,

        boolean partilhado) {

}
