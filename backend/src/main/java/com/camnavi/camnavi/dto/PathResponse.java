package com.camnavi.camnavi.dto;

import java.util.List;

public record PathResponse(List<List<String>> paths, List<Integer> weights, List<List<Coordinate>> coordinates) {
} 