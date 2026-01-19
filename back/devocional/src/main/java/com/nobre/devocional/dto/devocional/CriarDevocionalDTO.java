package com.nobre.devocional.dto.devocional;

import java.util.List;

public record CriarDevocionalDTO(
    String livro,String capitulo ,
    String versiculo, String categoriaNome,
    String reflexao, List<DesafioDTO> desafios,
    String imageUrl

) {

}
