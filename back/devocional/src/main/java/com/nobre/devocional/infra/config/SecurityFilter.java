package com.nobre.devocional.infra.config;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.nobre.devocional.repositorio.UsuarioRepository;
import com.nobre.devocional.service.TokenService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String uri = request.getRequestURI();

        // 🔓 libera login, cadastro e OPTIONS
        if (uri.equals("/auth/login")
                || uri.equals("/auth/cadastrar")
                || request.getMethod().equals("OPTIONS")) {

            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = recuperarToken(request);

            if (token != null) {
                String subject = tokenService.validarToken(token);
                UserDetails usuario = usuarioRepository.findByEmail(subject);

                if (usuario != null) {
                    var auth = new UsernamePasswordAuthenticationToken(
                            usuario, null, usuario.getAuthorities());

                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        } catch (Exception e) {
            // ❗ token inválido NÃO pode quebrar a request
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.equals("/twilio/webhook")
                || path.equals("/whatsapp/webhook")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs");
    }

    private String recuperarToken(HttpServletRequest request) {

        var authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        return authHeader.replace("Bearer ", "");

    }

}
