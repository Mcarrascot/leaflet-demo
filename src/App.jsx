import { useEffect, useRef } from 'react';
import './App.css'; // Importar CSS personalizado si es necesario
import L from 'leaflet'; // Importar Leaflet
import 'leaflet/dist/leaflet.css'; // Importar estilos de Leaflet

// Importar una imagen de tijeras o usar un enlace a una imagen de tijeras
import scissorsIconUrl from '../public/hair-cut-tool.png'; // Asegúrate de tener esta imagen en tu proyecto

function App() {
  const mapRef = useRef(null); // Reference for the map container
  const mapInstance = useRef(null); // Reference for the Leaflet map instance

  // List of peluquerías with coordinates and names
  const peluquerias = [
    {
      nombre: 'Peluquería Central Look',
      coordenadas: [-33.4558, -70.6823],
    },
    {
      nombre: 'Barbería Estilo Urbano',
      coordenadas: [-33.4505, -70.6848],
    },
    {
      nombre: 'Salón Glamour',
      coordenadas: [-33.4521, -70.6807],
    },
    {
      nombre: 'Peluquería Estación Chic',
      coordenadas: [-33.4572, -70.6819],
    },
  ];

  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      // Initialize the map centered on Estación Central
      const map = L.map(mapRef.current).setView([-33.4525, -70.6815], 14); // Central coordinates and Zoom
      mapInstance.current = map; // Store the map instance

      // Add tile layer (using OpenStreetMap as an example)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Create a custom icon for scissors
      const scissorsIcon = L.icon({
        iconUrl: scissorsIconUrl, // URL of the scissors image
        iconSize: [30, 30], // Icon size (adjust as needed)
        iconAnchor: [15, 30], // Point of the icon aligned with marker position
        popupAnchor: [0, -30], // Position of the popup relative to the icon
      });

      // Add markers for each peluquería with hover functionality
      peluquerias.forEach((peluqueria) => {
        const marker = L.marker(peluqueria.coordenadas, { icon: scissorsIcon }).addTo(map);

        // Bind a popup to the marker
        const popup = L.popup({
          closeButton: false, // Disable close button for better UX
          autoClose: false, // Prevent popup from closing automatically
        }).setContent(`<b>${peluqueria.nombre}</b><br>Estación Central.`);

        // Show popup on hover
        marker.on('mouseover', () => {
          marker.bindPopup(popup).openPopup();
        });

        // Hide popup on mouseout
        marker.on('mouseout', () => {
          marker.closePopup();
        });
      });
    }

    // Clean up the map instance on component unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove(); // Remove the map
        mapInstance.current = null; // Clear reference
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="App">
      <h1>Peluquerías en Estación Central</h1>
      {/* Use mapRef as the container */}
      <div ref={mapRef} style={{ height: '500px', width: '100%' }}></div>
    </div>
  );
}
export default App;
