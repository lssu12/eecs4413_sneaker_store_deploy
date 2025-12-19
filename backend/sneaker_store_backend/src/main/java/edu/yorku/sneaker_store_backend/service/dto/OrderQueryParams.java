package edu.yorku.sneaker_store_backend.service.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDate;

@Value
@Builder
public class OrderQueryParams {

    Long customerId;
    OrderStatus status;
    Long productId;
    LocalDate dateFrom;
    LocalDate dateTo;

    public enum OrderStatus {
        PENDING,
        PAID,
        SHIPPED,
        DELIVERED,
        CANCELLED
    }
}
