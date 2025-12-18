package edu.yorku.sneaker_store_backend.service;

import edu.yorku.sneaker_store_backend.model.Product;
import edu.yorku.sneaker_store_backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

/**
 * Admin-focused operations for managing products in the catalog.
 */
@Service
public class ProductAdminService {

    private final ProductRepository productRepository;
    private final InventoryHistoryService inventoryHistoryService;

    public ProductAdminService(ProductRepository productRepository,
                               InventoryHistoryService inventoryHistoryService) {
        this.productRepository = productRepository;
        this.inventoryHistoryService = inventoryHistoryService;
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
        var previousPrice = existing.getPrice();
        var previousStock = existing.getStockQuantity();

        existing.setSku(payload.getSku());
        existing.setName(payload.getName());
        existing.setBrand(payload.getBrand());
        existing.setDescription(payload.getDescription());
        existing.setPrice(payload.getPrice());
        existing.setStockQuantity(payload.getStockQuantity());
        existing.setImageUrl(payload.getImageUrl());

        Product saved = productRepository.save(existing);

        if (payload.getPrice() != null
                && previousPrice != null
                && payload.getPrice().compareTo(previousPrice) != 0) {
            inventoryHistoryService.recordPriceChange(saved, previousPrice, saved.getPrice());
        }

        if (payload.getStockQuantity() != null && !Objects.equals(previousStock, payload.getStockQuantity())) {
            inventoryHistoryService.recordStockAdjustment(saved, previousStock, saved.getStockQuantity());
        }

        return saved;
    }

    public boolean delete(Long id) {
        if (!productRepository.existsById(id)) {
            return false;
        }
        productRepository.deleteById(id);
        return true;
    }
}
