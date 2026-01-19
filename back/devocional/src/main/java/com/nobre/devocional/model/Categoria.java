package com.nobre.devocional.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "categorias")
@NoArgsConstructor // construtor sem parâmetros
@AllArgsConstructor
@Getter
@Setter // construtor com todos os parâmetros
@EqualsAndHashCode(of = "id")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @OneToMany(mappedBy = "categoria")
    private List<Devocional> devocionais;


    private boolean ativo = true;


    public void ativar() {
        this.ativo = true;
    }   

    public void desativar() {
        this.ativo = false;
    }
}
