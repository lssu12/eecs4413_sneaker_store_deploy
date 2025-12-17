package edu.yorku.sneaker_store_backend.service;

import edu.yorku.sneaker_store_backend.model.Product;
import edu.yorku.sneaker_store_backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Admin-focused operations for managing products in the catalog.
 */
@Service
public class ProductAdminService {

    private final ProductRepository productRepository;

    public ProductAdminService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> listAll() {
        return productRepository.findAll();
    }

    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product create(Product product) {
        return productRepository.save(product);
    }

    public Product update(Long id, Product payload) {
        Product existing = findById(id);
        if (existing == null) {
            return null;
        }
        existing.setSku(payload.getSku());
        existing.setName(payload.getName());
        existing.setBrand(payload.getBrand());
        existing.setDescription(payload.getDescription());
        existing.setPrice(payload.getPrice());
        existing.setStockQuantity(payload.getStockQuantity());
        existing.setImageUrl(payload.getImageUrl());
        return productRepository.save(existing);
    }

    public boolean delete(Long id) {
        if (!productRepository.existsById(id)) {
            return false;
        }
        productRepository.deleteById(id);
        return true;
    }
}
