package com.camnavi.camnavi.controller;

import com.camnavi.camnavi.dto.PathRequest;
import com.camnavi.camnavi.dto.PathResponse;
import com.camnavi.camnavi.service.PathService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/path")
@CrossOrigin(origins = "http://localhost:3000")
public class PathController {

    private final PathService pathService;

    public PathController(PathService pathService) {
        this.pathService = pathService;
    }

    @PostMapping
    public ResponseEntity<PathResponse> getPath(@RequestBody PathRequest request) {
        PathResponse response = pathService.findKShortestPaths(request.start(), request.end(), 2);
        return ResponseEntity.ok(response);
    }
} 