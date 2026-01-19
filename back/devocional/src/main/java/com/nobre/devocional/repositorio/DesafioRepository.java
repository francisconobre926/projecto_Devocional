package com.nobre.devocional.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nobre.devocional.model.Desafio;

@Repository
public interface DesafioRepository extends JpaRepository<Desafio, Long> {

}
