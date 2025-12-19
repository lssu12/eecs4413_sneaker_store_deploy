package edu.yorku.sneaker_store_backend.controller;

import edu.yorku.sneaker_store_backend.model.Sneaker;
import edu.yorku.sneaker_store_backend.service.SneakerService;
import edu.yorku.sneaker_store_backend.service.dto.SneakerQueryParams;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller that exposes API endpoints for sneaker catalog operations.
 */
@RestController
@RequestMapping("/api/sneakers")
@CrossOrigin(origins = "http://localhost:5173")
public class SneakerController {

    private final SneakerService sneakerService;

    public SneakerController(SneakerService sneakerService) {
        this.sneakerService = sneakerService;
    }

    /**
     * GET /api/sneakers
     * Retrieves a list of all sneakers.
     */
    @GetMapping
    public List<Sneaker> list(
            @RequestParam(name = "q", required = false) String keyword,
            @RequestParam(name = "brand", required = false) String brand,
            @RequestParam(name = "colorway", required = false) String colorway,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "genre", required = false) String genre,
            @RequestParam(name = "sortBy", required = false) String sortBy,
            @RequestParam(name = "direction", required = false) String direction
    ) {
        SneakerQueryParams params = SneakerQueryParams.builder()
                .keyword(keyword)
                .brand(brand)
                .colorway(colorway)
                .category(category)
                .genre(genre)
                .sortBy(sortBy)
                .sortDirection(direction)
                .build();
        return sneakerService.find(params);
    }

    /**
     * GET /api/sneakers/{id}
     * Retrieves a sneaker by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Sneaker> getById(@PathVariable Long id) {
        Sneaker sneaker = sneakerService.findById(id);
        if (sneaker == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(sneaker);
    }

    /**
     * GET /api/sneakers/brand/{brand}
     * Filters sneakers by brand name.
     */
    @GetMapping("/brand/{brand}")
    public List<Sneaker> byBrand(@PathVariable String brand) {
        return sneakerService.findByBrand(brand);
    }

    /**
     * POST /api/sneakers
     * Creates a new sneaker entry.
     */
    @PostMapping
    public ResponseEntity<Sneaker> create(@RequestBody Sneaker sneaker) {
        Sneaker created = sneakerService.create(sneaker);
        return ResponseEntity.ok(created);
    }

    /**
     * PUT /api/sneakers/{id}
     * Updates an existing sneaker.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Sneaker> update(@PathVariable Long id, @RequestBody Sneaker sneaker) {
        Sneaker updated = sneakerService.update(id, sneaker);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/sneakers/{id}
     * Deletes a sneaker by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = sneakerService.delete(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
