import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import './App.css'; // Importar CSS personalizado

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
    if (email === 'test@example.com' && password === 'Password@123') {
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
function MapPage({ loggedInUser }) {
  return (
    <div className="App">
      <h1>Peluquerías en Estación Central</h1>
      {loggedInUser && <p>Usuario: {loggedInUser}</p>}
    </div>
  );
}

export default App;
