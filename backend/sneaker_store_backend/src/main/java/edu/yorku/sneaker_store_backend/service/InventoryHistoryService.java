package edu.yorku.sneaker_store_backend.service;

import edu.yorku.sneaker_store_backend.dto.InventoryEventDto;
import edu.yorku.sneaker_store_backend.dto.InventoryHistoryResponseDto;
import edu.yorku.sneaker_store_backend.model.InventoryEvent;
import edu.yorku.sneaker_store_backend.model.Product;
import edu.yorku.sneaker_store_backend.repository.InventoryEventRepository;
import edu.yorku.sneaker_store_backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Central place that records and surfaces inventory-related events for admin dashboards.
 */
@Service
public class InventoryHistoryService {

    private final InventoryEventRepository inventoryEventRepository;
    private final ProductRepository productRepository;

    public InventoryHistoryService(InventoryEventRepository inventoryEventRepository,
                                   ProductRepository productRepository) {
        this.inventoryEventRepository = inventoryEventRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public void recordPriceChange(Product product, BigDecimal previousPrice, BigDecimal newPrice) {
        if (previousPrice == null || newPrice == null) {
            return;
        }
        if (previousPrice.compareTo(newPrice) == 0) {
            return;
        }
        InventoryEvent event = baseEvent(product, InventoryEvent.EventType.PRICE_CHANGE);
        event.setPreviousPrice(previousPrice);
        event.setNewPrice(newPrice);
        inventoryEventRepository.save(event);
    }

    @Transactional
    public void recordStockAdjustment(Product product, Integer previousStock, Integer newStock) {
        int from = defaultStock(previousStock);
        int to = defaultStock(newStock);
        if (from == to) {
            return;
        }
        InventoryEvent.EventType type = to > from
                ? InventoryEvent.EventType.RESTOCK
                : InventoryEvent.EventType.ADJUSTMENT;
        InventoryEvent event = baseEvent(product, type);
        event.setPreviousStock(from);
        event.setNewStock(to);
        event.setQuantityDelta(to - from);
        inventoryEventRepository.save(event);
    }

    @Transactional
    public void recordSale(Product product, int previousStock, int newStock, int quantity, Long orderId) {
        InventoryEvent event = baseEvent(product, InventoryEvent.EventType.SALE);
        event.setPreviousStock(previousStock);
        event.setNewStock(newStock);
        event.setQuantityDelta(-Math.abs(quantity));
        event.setOrderId(orderId);
        event.setNote(orderId != null ? "Order #" + orderId : null);
        inventoryEventRepository.save(event);
    }

    public InventoryHistoryResponseDto getHistoryForProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        List<InventoryEvent> events = inventoryEventRepository
                .findByProductIdOrderByEventTimeDesc(productId);

        List<InventoryEventDto> priceChanges = new ArrayList<>();
        List<InventoryEventDto> transactions = new ArrayList<>();
        List<InventoryEventDto> restocks = new ArrayList<>();

        for (InventoryEvent event : events) {
            InventoryEventDto dto = toDto(event);
            switch (event.getType()) {
                case PRICE_CHANGE -> priceChanges.add(dto);
                case SALE -> transactions.add(dto);
                case RESTOCK, ADJUSTMENT -> restocks.add(dto);
            }
        }

        return InventoryHistoryResponseDto.builder()
                .productId(product.getId())
                .productName(product.getName())
                .priceChanges(priceChanges)
                .transactions(transactions)
                .restocks(restocks)
                .build();
    }

    private InventoryEventDto toDto(InventoryEvent event) {
        return InventoryEventDto.builder()
                .type(event.getType())
                .eventTime(event.getEventTime())
                .quantityDelta(event.getQuantityDelta())
                .previousStock(event.getPreviousStock())
                .newStock(event.getNewStock())
                .previousPrice(event.getPreviousPrice())
                .newPrice(event.getNewPrice())
                .orderId(event.getOrderId())
                .note(event.getNote())
                .build();
    }

    private InventoryEvent baseEvent(Product product, InventoryEvent.EventType type) {
        return InventoryEvent.builder()
                .product(product)
                .type(type)
                .eventTime(LocalDateTime.now())
                .build();
    }

    private int defaultStock(Integer stock) {
        return Objects.requireNonNullElse(stock, 0);
    }
}
