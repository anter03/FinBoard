package pwork.greco.antonio.finboard.service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pwork.greco.antonio.finboard.controller.JwtService;
import pwork.greco.antonio.finboard.dto.AuthResponseDto;
import pwork.greco.antonio.finboard.dto.LoginRequest;
import pwork.greco.antonio.finboard.dto.UserDto;
import pwork.greco.antonio.finboard.entity.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import pwork.greco.antonio.finboard.security.JwtUtils;
@Service
@Transactional
@AllArgsConstructor
public class AuthService {

        private final AuthenticationManager authenticationManager;
        private final JwtUtils jwtUtils;
        private final UserService userService;

        //public AuthService(AuthenticationManager authenticationManager, JwtUtils jwtUtils, UserService userService) {
        //    this.authenticationManager = authenticationManager;
        //    this.jwtUtils = jwtUtils;
        //    this.userService = userService;
        //}

        public AuthResponseDto login(LoginRequest request) {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            User user = userService.findByUsername(request.getUsername()); // o via email
            String token = jwtUtils.generateToken(user);

            UserDto userDto = userService.toDto(user); // mappatura a DTO
            return new AuthResponseDto(token, userDto);
        }
    }



