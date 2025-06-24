package com.camnavi.camnavi.service;

import com.camnavi.camnavi.dto.Coordinate;
import com.camnavi.camnavi.dto.PathResponse;
import org.springframework.stereotype.Service;
import com.camnavi.camnavi.dto.NodeRequest;

import java.util.*;

@Service
public class PathService {

    private record Edge(String target, int distance) {}

    // Hard-coded graph: node -> list of edges (undirected)
    private final Map<String, List<Edge>> graph = new HashMap<>();
    // Optional coordinates for each node (lat, lng)
    private final Map<String, Coordinate> coordinates = new HashMap<>();

    public PathService() {
        // Initialize graph edges
        addUndirectedEdge("Building E Door 1", "Walking Path 1", 20);
        addUndirectedEdge("Building E Door 1", "Building E", 29);
        addUndirectedEdge("Building E", "VinUniversity Store", 34);
        addUndirectedEdge("VinUniversity Store", "Fresh Garden Cafe", 12);
        addUndirectedEdge("Fresh Garden Cafe", "Highlands Coffee", 21);
        addUndirectedEdge("Highlands Coffee", "Library Entrance", 11);
        addUndirectedEdge("Highlands Coffee", "ChangeMaker Award Display", 11);
        addUndirectedEdge("ChangeMaker Award Display", "Building I Door 1", 11);
        addUndirectedEdge("Building I Door 1", "Building C Door 1", 13);
        addUndirectedEdge("Building C Door 1", "Vinamilk Vending Machine", 13);
        addUndirectedEdge("Entrepreneurship Lab", "Fresh Garden Cafe", 30);
        addUndirectedEdge("Entrepreneurship Lab", "VinUniversity Store", 30);
        addUndirectedEdge("Entrepreneurship Lab", "Building E", 39);
        addUndirectedEdge("Entrepreneurship Lab", "A117", 19);
        addUndirectedEdge("A117", "Auditorium Secret Path", 16);
        addUndirectedEdge("Auditorium Secret Path", "Super Lab", 36);
        addUndirectedEdge("Library Entrance", "Library", 30);
        addUndirectedEdge("Library", "247 Room", 24);
        addUndirectedEdge("247 Room", "Building C Door 1", 54);
        addUndirectedEdge("Walking Path 1", "Building I Lookout View", 85);
        addUndirectedEdge("Building I Lookout View", "Center Square", 74);

        // Coordinates (dummy values, replace with real campus lat/lng)
        coordinates.put("Building E", new Coordinate(20.988626, 105.945269));
        coordinates.put("A117", new Coordinate(20.989119786867963, 105.94534407471079));
        coordinates.put("Library", new Coordinate(20.98931050124268, 105.94496118414739));
        coordinates.put("VinUniversity Store", new Coordinate(20.98881519377598, 105.94501107931139));
        coordinates.put("Highlands Coffee", new Coordinate(20.98902972397877, 105.9447991847992));
        coordinates.put("Fresh Garden Cafe", new Coordinate(20.98891828517566, 105.94496414065361));
        coordinates.put("Building I Door 1", new Coordinate(20.98898339549769, 105.94459936022758));
        coordinates.put("Building C Door 1", new Coordinate(20.98904746235655, 105.94449542462827));
        coordinates.put("Vinamilk Vending Machine", new Coordinate(20.98898339549769, 105.94438612461092));
        coordinates.put("Auditorium Secret Path", new Coordinate(20.98923882802536, 105.94542950391771));
        coordinates.put("Entrepreneurship Lab", new Coordinate(20.9889742132737, 105.94524644315244));
        coordinates.put("Super Lab", new Coordinate(20.98944292330945, 105.94516128301623));
        coordinates.put("Library Entrance", new Coordinate(20.98912238089781, 105.94475761055948));
        coordinates.put("247 Room", new Coordinate(20.98944939258201, 105.94478845596315));
        coordinates.put("ChangeMaker Award Display", new Coordinate(20.98899800357806, 105.94470128417015));
        coordinates.put("Building E Door 1", new Coordinate(20.98847273781853, 105.94549521803856));
        coordinates.put("Walking Path 1", new Coordinate(20.98831976973192, 105.94540268182757));
        coordinates.put("Building I Lookout View", new Coordinate(20.98872420616275, 105.94470262527467));
        coordinates.put("Center Square", new Coordinate(20.98816158428634, 105.94431437551977));
    }

    private void addUndirectedEdge(String a, String b, int distance) {
        graph.computeIfAbsent(a, k -> new ArrayList<>()).add(new Edge(b, distance));
        graph.computeIfAbsent(b, k -> new ArrayList<>()).add(new Edge(a, distance));
    }

    public void addNode(NodeRequest newNode) {
        String newNodeName = newNode.name();
        Coordinate newNodeCoord = new Coordinate(newNode.lat(), newNode.lng());

        if (coordinates.containsKey(newNodeName)) {
            System.out.println("Node " + newNodeName + " already exists. Skipping add operation.");
            return;
        }

        coordinates.put(newNodeName, newNodeCoord);

        for (String connectionName : newNode.connectTo()) {
            if (!coordinates.containsKey(connectionName)) {
                System.err.println("Warning: Cannot connect '" + newNodeName + "' to unknown node: '" + connectionName + "'");
                continue;
            }
            Coordinate existingCoord = coordinates.get(connectionName);
            int distance = (int) haversineDistance(newNodeCoord, existingCoord);
            addUndirectedEdge(newNodeName, connectionName, distance);
        }
    }

    private double haversineDistance(Coordinate c1, Coordinate c2) {
        final double EARTH_RADIUS = 6371e3; // metres

        double lat1 = Math.toRadians(c1.lat());
        double lat2 = Math.toRadians(c2.lat());
        double dLat = Math.toRadians(c2.lat() - c1.lat());
        double dLon = Math.toRadians(c2.lng() - c1.lng());

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }

    public PathResponse findKShortestPaths(String start, String end, int k) {
        if (!graph.containsKey(start) || !graph.containsKey(end)) {
            throw new IllegalArgumentException("Unknown node(s): " + start + " or " + end);
        }

        record Entry(String node, List<String> path, int dist) {
        }

        PriorityQueue<Entry> pq = new PriorityQueue<>(Comparator.comparingInt(Entry::dist));
        pq.add(new Entry(start, List.of(start), 0));

        List<List<String>> resultPaths = new ArrayList<>();
        List<Integer> resultWeights = new ArrayList<>();

        while (!pq.isEmpty() && resultPaths.size() < k) {
            Entry e = pq.poll();
            if (e.node.equals(end)) {
                resultPaths.add(e.path);
                resultWeights.add(e.dist);
                continue;
            }
            for (Edge edge : graph.getOrDefault(e.node, List.of())) {
                if (e.path.contains(edge.target)) continue; // avoid cycles
                List<String> newPath = new ArrayList<>(e.path);
                newPath.add(edge.target);
                pq.add(new Entry(edge.target, newPath, e.dist + edge.distance));
            }
        }

        if (resultPaths.isEmpty()) {
            throw new IllegalArgumentException("No path found from " + start + " to " + end);
        }

        List<List<Coordinate>> coords = resultPaths.stream()
                .map(p -> p.stream().map(coordinates::get).toList())
                .toList();

        return new PathResponse(resultPaths, resultWeights, coords);
    }
} 