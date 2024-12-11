import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import './App.css'; // Importar CSS personalizado
import L from 'leaflet'; // Importar Leaflet
import 'leaflet/dist/leaflet.css'; // Importar estilos de Leaflet

// Importar una imagen de tijeras o usar un enlace a una imagen de tijeras
import scissorsIconUrl from '../public/hair-cut-tool.png'; // Asegúrate de tener esta imagen en tu proyecto

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <Router>
      <header>
        <nav className="navbar">
          <div className="logo">
            <Link to="/">MyApp</Link>
          </div>
          <div className="nav-links">
            {loggedInUser ? (
              <span className="welcome-message">Bienvenido, {loggedInUser}</span>
            ) : (<>
              <Link to="/">Iniciar sesión</Link>
              <Link to="/signup">Registrarse</Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<LoginPage setLoggedInUser={setLoggedInUser} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/map"
          element={
            <ProtectedRoute loggedInUser={loggedInUser}>
              <MapPage loggedInUser={loggedInUser} />
             </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

// Componente de ruta protegida
function ProtectedRoute({ children, loggedInUser }) {
  if (!loggedInUser) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Página de inicio de sesión
function LoginPage({ setLoggedInUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'demo@gmail.com' && password === 'password1?') {
      setLoggedInUser(email);
      navigate('/map');
    } else {
      setError('Correo o contraseña inválidos.');
    }
  };

  return (
    <div className="form-container">
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleLogin}>
        <div className="form-field">
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && !email && <p className="error-text">El correo es obligatorio.</p>}
        </div>
        <div className="form-field">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && !password && <p className="error-text">La contraseña es obligatoria.</p>}
          {error && <p className="error-text">{error}</p>}
        </div>
        <button type="submit" className="submit-button">Iniciar sesión</button>
      </form>
      <p>
        ¿No tienes una cuenta? <Link to="/signup">Regístrate</Link>
      </p>
    </div>
  );
}

// Página de registro
function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    number: false,
    special: false,
  });

  const validatePassword = (password) => {
    const length = password.length >= 8;
    const number = /\d/.test(password);
    const special = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordChecks({ length, number, special });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!email) {
      validationErrors.email = 'El correo es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Por favor, ingresa un correo válido.';
    }

    if (!password) {
      validationErrors.password = 'La contraseña es obligatoria.';
    } else {
      if (!passwordChecks.length) validationErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
      if (!passwordChecks.number) validationErrors.password = 'La contraseña debe incluir un número.';
      if (!passwordChecks.special) validationErrors.password = 'La contraseña debe incluir un carácter especial.';
    }

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      alert('¡Registro exitoso!');
      navigate('/');
    }
  };

  return (
    <div className="form-container">
      <h1>Regístrate</h1>
      <form onSubmit={handleSignup}>
        <div className="form-field">
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
        <div className="form-field">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Crea una contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
          <div className="password-tooltip">
            <ul>
              <li style={{ color: passwordChecks.length ? 'green' : 'red' }}>
                {passwordChecks.length ? '✔️' : '❌'} Al menos 8 caracteres
              </li>
              <li style={{ color: passwordChecks.number ? 'green' : 'red' }}>
                {passwordChecks.number ? '✔️' : '❌'} Incluye un número
              </li>
              <li style={{ color: passwordChecks.special ? 'green' : 'red' }}>
                {passwordChecks.special ? '✔️' : '❌'} Incluye un carácter especial
              </li>
            </ul>
          </div>
        </div>
        <div className="form-field">
          <label>Confirmar contraseña</label>
          <input
            type="password"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
        </div>
        <button type="submit" className="submit-button">Registrarse</button>
      </form>
      <p>
        ¿Ya tienes una cuenta? <Link to="/">Inicia sesión</Link>
      </p>
    </div>
  );
}


// Página de mapa
function MapPage() {
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
    <div className="map-container">
      <h1>Peluquerías en Estación Central</h1>
      {/* Use mapRef as the container */}
      <div ref={mapRef} style={{ height: '500px', maxWidth: '1250px', margin: '20px' }}></div>
    </div>
  );
}
export default App;
