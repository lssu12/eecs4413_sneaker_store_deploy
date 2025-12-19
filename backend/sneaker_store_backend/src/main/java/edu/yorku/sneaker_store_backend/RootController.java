package edu.yorku.sneaker_store_backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    @GetMapping("/")
    public String home() {
        return "Sneaker Store Backend is running. Try /api/health";
    }
}

