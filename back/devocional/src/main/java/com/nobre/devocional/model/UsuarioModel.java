package com.nobre.devocional.model;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "usuarios")
@EqualsAndHashCode(of = "usuarioId")
public class UsuarioModel implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String usuarioId;

    private String nome;

    @Email
    @Column(unique = true)
    private String email;

    private String senha;

    private boolean ativo = true;


    private String telWhatsapp;

    public void ativarUsuario() {
        this.ativo = true;
    }

    public void desativarUsuario() {
        this.ativo = false;
    }



    @OneToMany(mappedBy = "usuario")
    private List<Devocional> devocionais;

    @OneToMany(mappedBy = "usuario")
    private List<Categoria> categorias;

    @CreationTimestamp
    private Instant createdTimestamp;

    @UpdateTimestamp
    private Instant updatedTimestamp;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    public boolean isAccountNonExpired() {
        return true;
    }

    public boolean isAccountNonLocked() {
        return true;
    }

    public boolean isCredentialsNonExpired() {
        return true;
    }

    public boolean isEnabled() {
        return true;
    }

}
