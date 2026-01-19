package com.nobre.devocional.repositorio;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import com.nobre.devocional.model.UsuarioModel;

public interface UsuarioRepository extends JpaRepository<UsuarioModel, String> {

        UserDetails findByEmail(String email);

        boolean existsByEmail(String email);

        Optional<UsuarioModel> findById(String id);

}
