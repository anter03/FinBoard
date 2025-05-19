package pwork.greco.antonio.finboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FinBoardApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinBoardApplication.class, args);
		
	}

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")                                // tutte le rotte
                        .allowedOrigins("http://localhost:4200")           // solo Angular su porta 4200 :contentReference[oaicite:0]{index=0}
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  
                        .allowedHeaders("*")                               // tutti gli header
                        .allowCredentials(true);                          // supporto cookie/credenziali
            }
        };
    }
	
}
