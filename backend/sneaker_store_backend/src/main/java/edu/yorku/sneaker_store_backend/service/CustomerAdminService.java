package edu.yorku.sneaker_store_backend.service;

import edu.yorku.sneaker_store_backend.model.Customer;
import edu.yorku.sneaker_store_backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Admin-facing customer management operations (view/update/delete customers).
 */
@Service
public class CustomerAdminService {

    private final CustomerRepository customerRepository;

    public CustomerAdminService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> listAll() {
        return customerRepository.findAll();
    }

    public Customer findById(Long id) {
        return customerRepository.findById(id).orElse(null);
    }

    public Customer update(Long id, Customer payload) {
        Customer existing = findById(id);
        if (existing == null) {
            return null;
        }
        existing.setFirstName(payload.getFirstName());
        existing.setLastName(payload.getLastName());
        existing.setEmail(payload.getEmail());
        existing.setPhoneNumber(payload.getPhoneNumber());
        existing.setAddressLine1(payload.getAddressLine1());
        existing.setAddressLine2(payload.getAddressLine2());
        existing.setCity(payload.getCity());
        existing.setProvince(payload.getProvince());
        existing.setPostalCode(payload.getPostalCode());
        existing.setCountry(payload.getCountry());
        if (payload.getPasswordHash() != null && !payload.getPasswordHash().isBlank()) {
            existing.setPasswordHash(payload.getPasswordHash());
        }
        return customerRepository.save(existing);
    }

    public boolean delete(Long id) {
        if (!customerRepository.existsById(id)) {
            return false;
        }
        customerRepository.deleteById(id);
        return true;
    }
}
