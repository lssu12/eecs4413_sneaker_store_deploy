package edu.yorku.sneaker_store_backend.service;

import edu.yorku.sneaker_store_backend.model.Product;
import edu.yorku.sneaker_store_backend.model.Sneaker;
import edu.yorku.sneaker_store_backend.repository.ProductRepository;
import edu.yorku.sneaker_store_backend.repository.SneakerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

/**
 * Admin-focused operations for managing products in the catalog.
 */
@Service
public class ProductAdminService {

    private final ProductRepository productRepository;
    private final SneakerRepository sneakerRepository;
    private final InventoryHistoryService inventoryHistoryService;

    public ProductAdminService(ProductRepository productRepository,
                               SneakerRepository sneakerRepository,
                               InventoryHistoryService inventoryHistoryService) {
        this.productRepository = productRepository;
        this.sneakerRepository = sneakerRepository;
        this.inventoryHistoryService = inventoryHistoryService;
    }

    public List<Product> listAll() {
        return productRepository.findAll();
    }

    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product create(Product product) {
        Product saved = productRepository.save(product);
        synchronizeSneaker(saved);
        return saved;
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

        synchronizeSneaker(saved);

        return saved;
    }

    public boolean delete(Long id) {
        if (!productRepository.existsById(id)) {
            return false;
        }
        productRepository.deleteById(id);
        return true;
    }

    private void synchronizeSneaker(Product product) {
        if (product == null) {
            return;
        }
        Sneaker sneaker = sneakerRepository.findFirstByNameIgnoreCase(product.getName())
                .orElseGet(Sneaker::new);

        sneaker.setName(product.getName());
        sneaker.setBrand(product.getBrand());
        sneaker.setColorway(null);
        sneaker.setPrice(product.getPrice());
        sneaker.setStock(product.getStockQuantity());
        sneaker.setCategory(null);
        sneaker.setGenre(null);
        sneaker.setDescription(product.getDescription());
        sneaker.setImageUrl(product.getImageUrl());
        if (sneaker.getAvailableSizes() == null || sneaker.getAvailableSizes().isEmpty()) {
            sneaker.setAvailableSizes(List.of("8", "9", "10"));
        }

        sneakerRepository.save(sneaker);
    }
}
