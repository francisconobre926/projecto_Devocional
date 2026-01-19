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
    
    Optional<Categoria> findByNomeAndAtivoTrue(String nome);

    Page<Categoria> findByAtivoTrue(Pageable pageable);

}
