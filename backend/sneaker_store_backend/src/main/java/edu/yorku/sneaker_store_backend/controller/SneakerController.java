package edu.yorku.sneaker_store_backend.controller;

import edu.yorku.sneaker_store_backend.model.Sneaker;
import edu.yorku.sneaker_store_backend.service.SneakerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sneakers")
@CrossOrigin("*") // allow frontend access
public class SneakerController {

    private final SneakerService service;

    public SneakerController(SneakerService service) {
        this.service = service;
    }

    @GetMapping
    public List<Sneaker> getAll() {
        return service.getAllSneakers();
    }

    @GetMapping("/{id}")
    public Sneaker getOne(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Sneaker create(@RequestBody Sneaker s) {
        return service.save(s);
    }
}
