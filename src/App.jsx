import { useEffect, useRef } from 'react';
import './App.css'; // Import custom CSS if needed
import L from 'leaflet'; // Import Leaflet

function App() {
  const mapRef = useRef(null); // Reference for the map container
  const mapInstance = useRef(null); // Reference for the Leaflet map instance

  useEffect(() => {
    // Initialize the map if it doesn't already exist
    if (!mapInstance.current && mapRef.current) {
      const map = L.map(mapRef.current).setView([51.505, -0.09], 13); // Latitude, Longitude, and Zoom
      mapInstance.current = map; // Store the map instance

      // Add tile layer (OpenStreetMap example)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add a marker
      const marker = L.marker([51.5, -0.09]).addTo(map);
      marker.bindPopup('<b>¡Hola!</b><br>Este es un marcador.').openPopup();
    }

    // Cleanup function to destroy the map instance when the component unmounts
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove(); // Properly remove the map
        mapInstance.current = null; // Clear the map instance reference
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="App">
      <h1>Demo de Mapa con Leaflet</h1>
      {/* Use mapRef for the container */}
      <div ref={mapRef} style={{ height: '500px', width: '100%' }}></div>
    </div>
  );
}

export default App;
