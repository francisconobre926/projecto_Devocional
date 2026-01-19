package com.nobre.devocional.model;

import java.time.Instant;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@Table(name = "devocionais")

public class Devocional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private UsuarioModel usuario;

    private String livro;
    private String capitulo;
    private String versiculo;

    @Lob
    private String reflexao;

    private String imageUrl;

    private boolean partilhado = false;

    public void partilhar() {
        this.partilhado = true;
    }

    public void despartilhar() {
        this.partilhado = false;
    }

    @OneToMany(mappedBy = "devocional", cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.LAZY)
    private List<Desafio> desafios;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @CreationTimestamp
    private Instant createdTimestamp;

    @UpdateTimestamp
    private Instant updatedTimestamp;

    private boolean ativo = true;

    public void ativar() {

        this.ativo = true;

    }

    public void desativar() {
        this.ativo = false;
    }

}
