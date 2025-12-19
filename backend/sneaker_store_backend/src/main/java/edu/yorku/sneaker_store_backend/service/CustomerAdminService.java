package edu.yorku.sneaker_store_backend.service;

import edu.yorku.sneaker_store_backend.model.Customer;
import edu.yorku.sneaker_store_backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        existing.setBillingAddressLine1(payload.getBillingAddressLine1());
        existing.setBillingAddressLine2(payload.getBillingAddressLine2());
        existing.setBillingCity(payload.getBillingCity());
        existing.setBillingProvince(payload.getBillingProvince());
        existing.setBillingPostalCode(payload.getBillingPostalCode());
        existing.setBillingCountry(payload.getBillingCountry());
        existing.setCreditCardHolder(payload.getCreditCardHolder());
        existing.setCreditCardNumber(payload.getCreditCardNumber());
        existing.setCreditCardExpiry(payload.getCreditCardExpiry());
        existing.setCreditCardCvv(payload.getCreditCardCvv());
        if (payload.getRole() != null && !payload.getRole().isBlank()) {
            existing.setRole(payload.getRole());
        }
        if (payload.getPasswordHash() != null && !payload.getPasswordHash().isBlank()) {
            existing.setPasswordHash(payload.getPasswordHash());
        }
        return customerRepository.save(existing);
    }

    @Transactional
    public boolean delete(Long id) {
        if (!customerRepository.existsById(id)) {
            return false;
        }
        Customer customer = findById(id);
        if (customer != null && "ADMIN".equalsIgnoreCase(customer.getRole())) {
            throw new IllegalArgumentException("Cannot delete admin account");
        }
        customerRepository.deleteById(id);
        return true;
    }
}
