package com.nobre.devocional.dto.unsplashImagem;

import com.fasterxml.jackson.annotation.JsonProperty;

public record FotoDTOResponse(String url,
      
    @JsonProperty("alt_description")
    String desc ) {

}
