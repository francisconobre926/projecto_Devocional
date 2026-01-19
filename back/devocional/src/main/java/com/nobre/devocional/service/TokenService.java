package com.nobre.devocional.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.nobre.devocional.model.UsuarioModel;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String gerarToken(UsuarioModel usuarioModel) {
        Algorithm algorithm = Algorithm.HMAC512(secret);
        String token = JWT.create()
                .withIssuer("Nobre-api")
                .withSubject(usuarioModel.getEmail())
                .withClaim("userId", usuarioModel.getUsuarioId())
                .withExpiresAt(dataExpiracao())
                .sign(algorithm);

        return token;
    }

    public String validarToken(String token) {
        Algorithm algorithm = Algorithm.HMAC512(secret);

        try {
            return JWT.require(algorithm)
                    .withIssuer("Nobre-api")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            return "";
        }
    }

    public String getUsuarioIdfromToken(String token) {

        try {
            Algorithm algorithm = Algorithm.HMAC512(secret);

            var verificar = JWT.require(algorithm)
                    .withIssuer("Nobre-api")
                    .build();

            var jwt = verificar.verify(token);

            return jwt.getClaim("userId").asString();
            
        } catch (JWTVerificationException exception) {

            throw new RuntimeException("token Invalido!");
        }

    }

    private Instant dataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }

}
