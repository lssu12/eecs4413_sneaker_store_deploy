package edu.yorku.sneaker_store_backend.service;

import edu.yorku.sneaker_store_backend.model.Sneaker;
import edu.yorku.sneaker_store_backend.repository.SneakerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for handling sneaker-related business logic.
 */
@Service
public class SneakerService {

    private final SneakerRepository sneakerRepository;

    public SneakerService(SneakerRepository sneakerRepository) {
        this.sneakerRepository = sneakerRepository;
    }

    /**
     * Returns all sneakers from the database.
     */
    public List<Sneaker> findAll() {
        return sneakerRepository.findAll();
    }

    /**
     * Finds a sneaker by its ID. Returns null if not found.
     */
    public Sneaker findById(Long id) {
        return sneakerRepository.findById(id).orElse(null);
    }

    /**
     * Searches sneakers by keyword. If keyword is empty, returns all sneakers.
     */
    public List<Sneaker> searchByKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return findAll();
        }
        return sneakerRepository.findByNameContainingIgnoreCase(keyword);
    }

    /**
     * Applies optional filters for brand, colorway, and keyword.
     */
    public List<Sneaker> filter(String brand, String colorway, String keyword) {
        List<Sneaker> base = searchByKeyword(keyword);

        return base.stream()
                .filter(s -> isBlank(brand) || equalsIgnoreCase(s.getBrand(), brand))
                .filter(s -> isBlank(colorway) || equalsIgnoreCase(s.getColorway(), colorway))
                .collect(Collectors.toList());
    }

    /**
     * Returns sneakers filtered by brand.
     */
    public List<Sneaker> findByBrand(String brand) {
        return sneakerRepository.findByBrandIgnoreCase(brand);
    }

    /**
     * Saves a new sneaker to the database.
     */
    public Sneaker create(Sneaker sneaker) {
        return sneakerRepository.save(sneaker);
    }

    /**
     * Updates an existing sneaker if it exists.
     */
    public Sneaker update(Long id, Sneaker updated) {
        Sneaker existing = findById(id);
        if (existing == null) {
            return null;
        }
        existing.setName(updated.getName());
        existing.setBrand(updated.getBrand());
        existing.setColorway(updated.getColorway());
        existing.setPrice(updated.getPrice());
        existing.setStock(updated.getStock());
        existing.setAvailableSizes(updated.getAvailableSizes());
        existing.setDescription(updated.getDescription());
        existing.setImageUrl(updated.getImageUrl());
        return sneakerRepository.save(existing);
    }

    /**
     * Deletes a sneaker by ID. Returns true if successful.
     */
    public boolean delete(Long id) {
        if (!sneakerRepository.existsById(id)) {
            return false;
        }
        sneakerRepository.deleteById(id);
        return true;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private boolean equalsIgnoreCase(String value, String target) {
        return value != null && value.equalsIgnoreCase(target);
    }
}
