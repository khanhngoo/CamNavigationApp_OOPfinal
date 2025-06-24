package com.camnavi.camnavi.dto;

import java.util.List;

public record NodeRequest(
        String id,
        String name,
        String category,
        String description,
        double lat,
        double lng,
        List<String> connectTo
) {
} 