package com.nobre.devocional.repositorio;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.nobre.devocional.model.Devocional;

@Repository
public interface DevocionalRepository extends JpaRepository<Devocional, Long> {

    Page<Devocional> findByUsuarioUsuarioId(String usuarioId, Pageable pageable);

    Optional<Devocional> findByIdAndUsuarioUsuarioId(Long id, String usuarioId);

    Page<Devocional> findAllByPartilhadoTrue(Pageable paginacao);

    Page<Devocional> findAllByAtivoTrue(Pageable paginacao);

}
