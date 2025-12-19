package edu.yorku.sneaker_store_backend.service;

import edu.yorku.sneaker_store_backend.model.Sneaker;
import edu.yorku.sneaker_store_backend.repository.SneakerRepository;
import edu.yorku.sneaker_store_backend.service.dto.SneakerQueryParams;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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
    public List<Sneaker> find(SneakerQueryParams params) {
        Specification<Sneaker> spec = Specification.where(null);

        if (!isBlank(params.getKeyword())) {
            String keyword = params.getKeyword().toLowerCase();
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + keyword + "%"));
        }
        if (!isBlank(params.getBrand())) {
            spec = spec.and((root, query, cb) -> cb.equal(cb.lower(root.get("brand")), params.getBrand().toLowerCase()));
        }
        if (!isBlank(params.getColorway())) {
            spec = spec.and((root, query, cb) -> cb.equal(cb.lower(root.get("colorway")), params.getColorway().toLowerCase()));
        }
        if (!isBlank(params.getCategory())) {
            spec = spec.and((root, query, cb) -> cb.equal(cb.lower(root.get("category")), params.getCategory().toLowerCase()));
        }
        if (!isBlank(params.getGenre())) {
            spec = spec.and((root, query, cb) -> cb.equal(cb.lower(root.get("genre")), params.getGenre().toLowerCase()));
        }

        Sort sort = resolveSort(params.getSortBy(), params.getSortDirection());
        return sneakerRepository.findAll(spec, sort);
    }

    public List<Sneaker> findByBrand(String brand) {
        return sneakerRepository.findByBrandIgnoreCase(brand);
    }

    private Sort resolveSort(String sortBy, String direction) {
        if (isBlank(sortBy)) {
            return Sort.by("name").ascending();
        }
        Sort.Direction dir = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return switch (sortBy.toLowerCase()) {
            case "price" -> Sort.by(dir, "price");
            case "name" -> Sort.by(dir, "name");
            default -> Sort.by(dir, "name");
        };
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

}
