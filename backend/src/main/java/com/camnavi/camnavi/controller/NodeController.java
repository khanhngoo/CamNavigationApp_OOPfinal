package com.camnavi.camnavi.controller;

import com.camnavi.camnavi.dto.NodeRequest;
import com.camnavi.camnavi.service.PathService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/node")
@CrossOrigin(origins = "http://localhost:3000")
public class NodeController {

    private final PathService pathService;

    public NodeController(PathService pathService) {
        this.pathService = pathService;
    }

    @PostMapping
    public ResponseEntity<Void> addNode(@RequestBody NodeRequest request) {
        pathService.addNode(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
} 