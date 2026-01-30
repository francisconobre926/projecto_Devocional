package com.nobre.devocional.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.nobre.devocional.dto.LoginRequest;
import com.nobre.devocional.dto.LoginResponse;
import com.nobre.devocional.dto.usuario.CadastrarUsuarioDTO;
import com.nobre.devocional.dto.usuario.EditarUsuarioDTO;
import com.nobre.devocional.dto.usuario.ListarUsuarioDTO;
import com.nobre.devocional.mapper.UserMapper;
import com.nobre.devocional.model.UsuarioModel;
import com.nobre.devocional.repositorio.UsuarioRepository;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@Service
public class UsuarioService {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            var authToken = new UsernamePasswordAuthenticationToken(
                    loginRequest.email(),
                    loginRequest.senha());

            var auth = authenticationManager.authenticate(authToken);

            UsuarioModel usuarioModel = (UsuarioModel) auth.getPrincipal();
            var token = tokenService.gerarToken(usuarioModel);

            return ResponseEntity.ok(new LoginResponse(token));

        } catch (AuthenticationException e) {

            // retorna JSON simples e status 401
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Email ou senha inválidos"));
        }

    }

    @Transactional
    public ResponseEntity<?> cadastrarUsuario(@RequestBody @Valid CadastrarUsuarioDTO cadastrarUsuarioDTO) {

        if (usuarioRepository.existsByEmail(cadastrarUsuarioDTO.email())) {
              return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Email já cadastrado"));
        }

        UsuarioModel usuario = new UsuarioModel();

        usuario.setNome(cadastrarUsuarioDTO.nome());
        usuario.setEmail(cadastrarUsuarioDTO.email());
        usuario.setSenha(passwordEncoder.encode(cadastrarUsuarioDTO.senha()));
        usuario.setTelWhatsapp(cadastrarUsuarioDTO.telWhatsapp());

         usuarioRepository.save(usuario);

         return ResponseEntity.status(200).body("Usuario cadastrado com sucesso");
    }

    @Transactional
    public ResponseEntity<?> editarUsuario(@PathVariable("id") String id,
            @RequestBody @Valid EditarUsuarioDTO editarUsuario) {
        
        UsuarioModel usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado!"));

        if (editarUsuario.email() != null) {
            usuarioExistente.setEmail(editarUsuario.email());
        }

        if (editarUsuario.senha() != null) {
            usuarioExistente.setSenha(editarUsuario.senha());
        }
        if (editarUsuario.nome() != null) {
            usuarioExistente.setNome(editarUsuario.nome());
        }

        return ResponseEntity.ok(usuarioRepository.save(usuarioExistente));
    }

    public ResponseEntity<?> getUserById(@PathVariable("id") String id) {

        ListarUsuarioDTO usuario = usuarioRepository.findById(id)
                .map(userMapper::toUsuario)
                .orElseThrow(() -> new RuntimeException("usuario nao encontrado"));

        return ResponseEntity.ok().body(usuario);

    }

    @Transactional
    public ResponseEntity<?> deletarUsuario(@PathVariable("id") String id) {
        UsuarioModel usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado!"));

        usuarioExistente.desativarUsuario();
        usuarioRepository.save(usuarioExistente);

        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<?> ativarUsuario(@PathVariable("id") String id) {
        UsuarioModel usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado!"));

        usuarioExistente.ativarUsuario();
        usuarioRepository.save(usuarioExistente);

        return ResponseEntity.noContent().build();
    }

}
