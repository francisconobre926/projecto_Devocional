package com.nobre.devocional.dto.unsplashImagem;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UrlImagem( Urls urls, 

     @JsonProperty("alt_description")
        String descricao
) {

}
