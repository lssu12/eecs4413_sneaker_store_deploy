package edu.yorku.sneaker_store_backend;

import edu.yorku.sneaker_store_backend.model.Customer;
import edu.yorku.sneaker_store_backend.model.Product;
import edu.yorku.sneaker_store_backend.model.Sneaker;
import edu.yorku.sneaker_store_backend.repository.CustomerRepository;
import edu.yorku.sneaker_store_backend.repository.ProductRepository;
import edu.yorku.sneaker_store_backend.repository.SneakerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

@SpringBootApplication
public class SneakerStoreBackendApplication {

    private static final Logger log = LoggerFactory.getLogger(SneakerStoreBackendApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(SneakerStoreBackendApplication.class, args);
    }

    /**
     * Seeds lightweight demo data so the application can be exercised locally without importing
     * SQL dumps or running admin scripts.
     */
    @Bean
    public CommandLineRunner dataInitializer(SneakerRepository sneakerRepository,
                                             ProductRepository productRepository,
                                             CustomerRepository customerRepository,
                                             PasswordEncoder passwordEncoder) {
        return args -> {
            seedSneakers(sneakerRepository);
            seedProducts(productRepository);
            seedDemoCustomer(customerRepository, passwordEncoder);
            log.info("Sneaker Store backend is ready. REST API listening on http://localhost:8080");
        };
    }

    private void seedSneakers(SneakerRepository repository) {
        if (repository.count() > 0) {
            return;
        }

        List<Sneaker> sneakers = List.of(
                Sneaker.builder()
                        .name("Air Jordan 1 Retro High OG")
                        .brand("Nike")
                        .colorway("Bred")
                        .price(new BigDecimal("240.00"))
                        .stock(25)
                        .availableSizes(List.of("7", "8", "9", "10", "11", "12"))
                        .description("Iconic Jordan 1 bringing back the premium leather Bred colorway.")
                        .imageUrl("https://static.sneakerstore.local/img/aj1-bred.jpg")
                        .build(),
                Sneaker.builder()
                        .name("Yeezy Boost 350 V2")
                        .brand("Adidas")
                        .colorway("Zebra")
                        .price(new BigDecimal("300.00"))
                        .stock(18)
                        .availableSizes(List.of("6", "7", "8", "9", "10", "11"))
                        .description("Primeknit upper with the instantly recognizable Zebra pattern.")
                        .imageUrl("https://static.sneakerstore.local/img/yeezy-350-v2.jpg")
                        .build(),
                Sneaker.builder()
                        .name("Nike Dunk Low Panda")
                        .brand("Nike")
                        .colorway("Black/White")
                        .price(new BigDecimal("140.00"))
                        .stock(40)
                        .availableSizes(List.of("5", "6", "7", "8", "9", "10"))
                        .description("Everyday staple Dunk Low dressed in the versatile Panda blocking.")
                        .imageUrl("https://static.sneakerstore.local/img/dunk-low-panda.jpg")
                        .build(),
                Sneaker.builder()
                        .name("New Balance 550")
                        .brand("New Balance")
                        .colorway("White/Grey")
                        .price(new BigDecimal("150.00"))
                        .stock(32)
                        .availableSizes(List.of("7", "8", "9", "10", "11", "12"))
                        .description("Retro basketball-inspired silhouette with leather overlays.")
                        .imageUrl("https://static.sneakerstore.local/img/nb-550.jpg")
                        .build()
        );

        repository.saveAll(sneakers);
        log.info("Seeded {} sneakers for local development", sneakers.size());
    }

    private void seedProducts(ProductRepository repository) {
        if (repository.count() > 0) {
            return;
        }

        List<Product> products = List.of(
                Product.builder()
                        .sku("AJ1-RED")
                        .name("Air Jordan 1 Retro High OG")
                        .brand("Nike")
                        .description("Matches the AJ1 sneaker entry for checkout flows.")
                        .price(new BigDecimal("240.00"))
                        .stockQuantity(25)
                        .imageUrl("https://static.sneakerstore.local/img/aj1-bred.jpg")
                        .build(),
                Product.builder()
                        .sku("YZY-350-ZEB")
                        .name("Yeezy Boost 350 V2 Zebra")
                        .brand("Adidas")
                        .description("Primeknit upper with Boost cushioning for all-day wear.")
                        .price(new BigDecimal("300.00"))
                        .stockQuantity(18)
                        .imageUrl("https://static.sneakerstore.local/img/yeezy-350-v2.jpg")
                        .build(),
                Product.builder()
                        .sku("NK-DUNK-PND")
                        .name("Nike Dunk Low Panda")
                        .brand("Nike")
                        .description("Clean black & white Dunk Low ready for everyday rotations.")
                        .price(new BigDecimal("140.00"))
                        .stockQuantity(40)
                        .imageUrl("https://static.sneakerstore.local/img/dunk-low-panda.jpg")
                        .build(),
                Product.builder()
                        .sku("NB-550-WG")
                        .name("New Balance 550 White Grey")
                        .brand("New Balance")
                        .description("Neutral white and grey take on the resurgent 550 silhouette.")
                        .price(new BigDecimal("150.00"))
                        .stockQuantity(32)
                        .imageUrl("https://static.sneakerstore.local/img/nb-550.jpg")
                        .build()
        );

        repository.saveAll(products);
        log.info("Seeded {} products for local development", products.size());
    }

    private void seedDemoCustomer(CustomerRepository repository, PasswordEncoder passwordEncoder) {
        String email = "demo@sneakerstore.test";
        if (repository.existsByEmail(email)) {
            return;
        }

        Customer customer = Customer.builder()
                .firstName("Demo")
                .lastName("Customer")
                .email(email)
                .passwordHash(passwordEncoder.encode("password"))
                .phoneNumber("416-555-0199")
                .addressLine1("123 Sneaker St")
                .addressLine2("Unit 5")
                .city("Toronto")
                .province("ON")
                .postalCode("M5V 2T6")
                .country("Canada")
                .build();

        repository.save(customer);
        log.info("Created demo customer (email: {}, password: password)", email);
    }
}
