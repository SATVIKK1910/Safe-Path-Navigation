
// const HERE_API_KEY = 'zbc0Wp2fOBVGaVgH7W2rVJ0YV0XiQOiwLc6oe9F89PY';
        import React, { useState, useRef, useEffect } from 'react';
        import { View, StyleSheet, Button, TextInput, FlatList, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
        import MapView, { Marker, Polyline } from 'react-native-maps';
        import axios from 'axios';

        const HERE_API_KEY = 'zbc0Wp2fOBVGaVgH7W2rVJ0YV0XiQOiwLc6oe9F89PY';

        const MapScreen = () => {
            const [origin, setOrigin] = useState({ title: '', latitude: null, longitude: null });
            const [destination, setDestination] = useState({ title: '', latitude: null, longitude: null });
            const [routeCoords, setRouteCoords] = useState([]);
            const [routeDetails, setRouteDetails] = useState([]);
            const [suggestions, setSuggestions] = useState([]);
            const [selectedField, setSelectedField] = useState('');
            const mapRef = useRef(null);

            // Function to fetch suggestions based on user input
            const fetchSuggestions = async (query) => {
                if (!query.trim()) {
                    setSuggestions([]);
                    return;
                }
                const latitude = 37.7749;  // Example user location (San Francisco)
                const longitude = -122.4194;
                const url = `https://autosuggest.search.hereapi.com/v1/autosuggest?q=${encodeURIComponent(query)}&at=${latitude},${longitude}&apiKey=${HERE_API_KEY}&limit=5`;

                try {
                    const response = await axios.get(url);
                    setSuggestions(response.data.items || []);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                    Alert.alert("Error", "Failed to fetch location suggestions.");
                }
            };

            const handleSelectLocation = (item) => {
                const location = {
                    latitude: item.position.lat,
                    longitude: item.position.lng,
                    title: item.title,
                };
                selectedField === 'origin' ? setOrigin(location) : setDestination(location);
                setSuggestions([]);
            };

            const findRoute = async () => {
                if (!origin.latitude || !destination.latitude) {
                    Alert.alert("Missing Data", "Please set both origin and destination locations.");
                    return;
                }
                try {
                    const graphHopperUrl = `https://graphhopper.com/api/1/route?point=${origin.latitude},${origin.longitude}&point=${destination.latitude},${destination.longitude}&vehicle=car&key=3bf6b28b-27c0-4559-b5ce-60ba16e252d0&instructions=true&algorithm=alternative_route`;
                    const response = await axios.get(graphHopperUrl);

                    if (response.data.paths?.length > 0) {
                        const routes = response.data.paths.map((route, index) => ({
                            coords: decodePolyline(route.points),
                            distance: route.distance / 1000,  // in km
                            time: route.time / 60000,  // in minutes
                            label: `Route ${index + 1}`
                        }));
                        setRouteCoords(routes.map(route => route.coords));
                        calculateProximityScore(routes);
                    } else {
                        Alert.alert("Route Error", "No route found.");
                    }
                } catch (error) {
                    console.error('GraphHopper Route fetch error:', error);
                    Alert.alert("Route Fetch Error", "Failed to fetch route.");
                }
            };

            const calculateProximityScore = async (routes) => {
                try {
                    const enhancedRoutes = await Promise.all(routes.map(async (route) => {
                        const midpoint = route.coords[Math.floor(route.coords.length / 2)];
                        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${midpoint.latitude}&lon=${midpoint.longitude}`;

                        try {
                            const response = await axios.get(url);
                            const score = response.data ? response.data.place_id % 100 : 0;  // Mock scoring logic
                            return { ...route, proximityScore: score };
                        } catch (error) {
                            console.error('Proximity Score Error:', error);
                            Alert.alert("Error", "Failed to calculate proximity score.");
                            return { ...route, proximityScore: 'N/A' };
                        }
                    }));
                    setRouteDetails(enhancedRoutes);
                } catch (error) {
                    console.error('Error in proximity score calculation:', error);
                    Alert.alert("Error", "Failed to calculate proximity scores.");
                }
            };

            const decodePolyline = (encoded) => {
                const coords = [];
                let index = 0, lat = 0, lng = 0;
                while (index < encoded.length) {
                    let b, shift = 0, result = 0;
                    do {
                        b = encoded.charCodeAt(index++) - 63;
                        result |= (b & 0x1f) << shift;
                        shift += 5;
                    } while (b >= 0x20);
                    const deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
                    lat += deltaLat;
                    shift = 0;
                    result = 0;
                    do {
                        b = encoded.charCodeAt(index++) - 63;
                        result |= (b & 0x1f) << shift;
                        shift += 5;
                    } while (b >= 0x20);
                    const deltaLng = ((result & 1) ? ~(result >> 1) : (result >> 1));
                    lng += deltaLng;
                    coords.push({ latitude: lat / 1E5, longitude: lng / 1E5 });
                }
                return coords;
            };

            return (
                <View style={styles.container}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter starting location"
                        onFocus={() => { setSelectedField('origin'); setSuggestions([]); }}
                        onChangeText={(text) => { setOrigin((prev) => ({ ...prev, title: text })); fetchSuggestions(text); }}
                        value={origin.title}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter destination"
                        onFocus={() => { setSelectedField('destination'); setSuggestions([]); }}
                        onChangeText={(text) => { setDestination((prev) => ({ ...prev, title: text })); fetchSuggestions(text); }}
                        value={destination.title}
                    />
                    {suggestions.length > 0 && (
                        <FlatList
                            data={suggestions}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelectLocation(item)} style={styles.suggestionItem}>
                                    <Text>{item.title}</Text>
                                </TouchableOpacity>
                            )}
                            style={styles.suggestionsContainer}
                        />
                    )}
                    <Button title="Find Routes" onPress={findRoute} />
                    <MapView ref={mapRef} style={styles.map}
                        initialRegion={{ latitude: origin.latitude || 37.78825, longitude: origin.longitude || -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}>
                        {origin.latitude && <Marker coordinate={{ latitude: origin.latitude, longitude: origin.longitude }} title={origin.title || "Start"} />}
                        {destination.latitude && <Marker coordinate={{ latitude: destination.latitude, longitude: destination.longitude }} title={destination.title || "End"} />}
                        {routeCoords.map((coords, idx) => (
                            <Polyline
                                key={idx}
                                coordinates={coords}
                                strokeColor={idx === 0 ? "blue" : idx === 1 ? "green" : "red"}
                                strokeWidth={4}
                            />
                        ))}
                    </MapView>
                    <ScrollView style={styles.detailsContainer}>
                        {routeDetails.map((route, idx) => (
                            <View key={idx} style={styles.routeCard}>
                                <Text style={[styles.routeTitle, { color: idx === 0 ? "blue" : idx === 1 ? "green" : "red" }]}>{route.label}</Text>
                                <Text>Distance: {route.distance.toFixed(2)} km</Text>
                                <Text>Time: {route.time.toFixed(2)} minutes</Text>
                                <Text>Proximity Score: {route.proximityScore || 'N/A'}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            );
        };

        const styles = StyleSheet.create({
            container: { flex: 1 },
            map: { flex: 1 },
            textInput: { height: 40, borderColor: 'gray', borderWidth: 1, margin: 5, padding: 10, borderRadius: 5 },
            suggestionsContainer: { position: 'absolute', top: 70, width: '100%' },
            suggestionItem: { padding: 8, borderBottomWidth: 0.5, borderBottomColor: '#ddd' },
            detailsContainer: { flex: 1, backgroundColor: '#f9f9f9', padding: 10 },
            routeCard: { margin: 5, padding: 10, backgroundColor: '#fff', borderRadius: 10, elevation: 3 },
            routeTitle: { fontSize: 16, fontWeight: 'bold' }
        });

        export default MapScreen;
