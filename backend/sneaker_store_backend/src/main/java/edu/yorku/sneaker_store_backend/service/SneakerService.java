package edu.yorku.sneaker_store_backend.service;

import edu.yorku.sneaker_store_backend.model.Sneaker;
import edu.yorku.sneaker_store_backend.repository.SneakerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SneakerService {

    private final SneakerRepository repo;

    public SneakerService(SneakerRepository repo) {
        this.repo = repo;
    }

    public List<Sneaker> getAllSneakers() {
        return repo.findAll();
    }

    public Sneaker getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Sneaker save(Sneaker s) {
        return repo.save(s);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
