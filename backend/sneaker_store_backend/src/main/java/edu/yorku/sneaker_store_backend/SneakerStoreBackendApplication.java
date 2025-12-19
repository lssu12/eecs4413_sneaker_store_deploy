package edu.yorku.sneaker_store_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(excludeName = "org.springframework.boot.devtools.autoconfigure.DevToolsDataSourceAutoConfiguration")
public class SneakerStoreBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SneakerStoreBackendApplication.class, args);
    }
}
