package edu.yorku.sneaker_store_backend.controller.admin;

import edu.yorku.sneaker_store_backend.model.Customer;
import edu.yorku.sneaker_store_backend.service.CustomerAdminService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin endpoints for reviewing and updating customer profiles.
 */
@RestController
@RequestMapping("/api/admin/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminCustomerController {

    private final CustomerAdminService customerAdminService;

    public AdminCustomerController(CustomerAdminService customerAdminService) {
        this.customerAdminService = customerAdminService;
    }

    /**
     * GET /api/admin/customers
     */
    @GetMapping
    public List<Customer> listAll() {
        return customerAdminService.listAll();
    }

    /**
     * GET /api/admin/customers/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getById(@PathVariable Long id) {
        Customer customer = customerAdminService.findById(id);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(customer);
    }

    /**
     * PUT /api/admin/customers/{id}
     * <p>
     * Provide the updated fields such as phone number or address. Use this for manual account
     * corrections from the admin panel.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Customer> update(@PathVariable Long id, @RequestBody Customer payload) {
        Customer updated = customerAdminService.update(id, payload);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/admin/customers/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            boolean deleted = customerAdminService.delete(id);
            if (!deleted) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", ex.getMessage()));
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "message", "Customer has active orders and cannot be deleted."
            ));
        }
    }
}
