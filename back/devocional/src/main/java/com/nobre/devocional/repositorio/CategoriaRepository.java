package com.nobre.devocional.repositorio;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import com.nobre.devocional.model.Categoria;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    Optional<Categoria> findByNome(String nome);

    Page<Categoria> findByUsuarioUsuarioId(String usuarioId, Pageable pageable);

    Optional<Categoria> findByNomeAndAtivoTrueAndUsuarioUsuarioId(String nome, String usuarioId);

    Optional<Categoria> findByNomeAndAtivoTrue(String nome);

    Optional<Categoria> findByAtivoTrueAndUsuarioUsuarioId(String usuarioId);

    Page<Categoria> findByAtivoTrueAndUsuarioUsuarioId(String usuarioId, Pageable pageable);


    Optional<Categoria>findByNomeAndUsuarioUsuarioId(String nome, String usuarioId);

}
