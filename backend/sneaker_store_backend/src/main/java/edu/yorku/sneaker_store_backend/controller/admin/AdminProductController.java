package edu.yorku.sneaker_store_backend.controller.admin;

import edu.yorku.sneaker_store_backend.model.Product;
import edu.yorku.sneaker_store_backend.service.ProductAdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only endpoints for managing products in the catalog.
 */
@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminProductController {

    private final ProductAdminService productAdminService;

    public AdminProductController(ProductAdminService productAdminService) {
        this.productAdminService = productAdminService;
    }

    /**
     * GET /api/admin/products
     * Use when populating admin tables – returns every product with inventory levels.
     */
    @GetMapping
    public List<Product> listAll() {
        return productAdminService.listAll();
    }

    /**
     * GET /api/admin/products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        Product product = productAdminService.findById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }

    /**
     * POST /api/admin/products
     * <p>
     * Example payload:
     * <pre>{"sku":"AJ1-RED","name":"Air Jordan 1","price":199.99,"stockQuantity":25}</pre>
     */
    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product product) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productAdminService.create(product));
    }

    /**
     * PUT /api/admin/products/{id}
     * Updates full product details.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product product) {
        Product updated = productAdminService.update(id, product);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/admin/products/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = productAdminService.delete(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
