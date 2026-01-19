package com.nobre.devocional.dto.usuario;

import java.time.Instant;

public record ListarUsuarioDTO(String nome, String email, Instant createdTimestamp, Instant updatedTimestamp) {

}
