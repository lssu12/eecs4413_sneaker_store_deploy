package edu.yorku.sneaker_store_backend.service.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class SneakerQueryParams {

    String keyword;
    String brand;
    String colorway;
    String category;
    String genre;
    String sortBy;
    String sortDirection;
}
