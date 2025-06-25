import React, { useState, useEffect } from "react";

// Composant pour le Dashboard principal
const Dashboard = ({ token, onLogout }) => {
  const [activationRate, setActivationRate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          "https://yessi-yessi-backend.onrender.com/api/analytics/overview",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          setActivationRate(result.data.activationRate);
        } else {
          throw new Error(
            result.message || "Erreur lors de la récupération des données."
          );
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  if (isLoading) {
    return <div style={{ padding: "20px" }}>Chargement des données...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px", color: "red" }}>Erreur: {error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={onLogout}
        style={{ float: "right", padding: "8px 12px" }}
      >
        Déconnexion
      </button>
      <h1>Tableau de Bord Yessi-Yessi</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <h2>Taux d'Activation des Utilisateurs</h2>
        <p
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            color: "#2e7d32",
            margin: "10px 0",
          }}
        >
          {activationRate}%
        </p>
        <p>des utilisateurs ont configuré leur épargne.</p>
      </div>
    </div>
  );
};

// Composant pour la page de Login
const LoginPage = ({ onLogin }) => {
  const [token, setToken] = useState("");

  const handleLogin = () => {
    if (token) {
      onLogin(token);
    } else {
      alert("Veuillez coller un token JWT valide.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Accès au Dashboard Admin</h1>
      <p>Veuillez coller un token JWT valide pour continuer.</p>
      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        rows="8"
        style={{
          width: "90%",
          maxWidth: "600px",
          marginBottom: "10px",
          padding: "8px",
        }}
        placeholder="Collez le token ici..."
      />
      <br />
      <button
        onClick={handleLogin}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Se Connecter
      </button>
    </div>
  );
};

function App() {
  const [authToken, setAuthToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("adminAuthToken");
      if (storedToken) {
        setAuthToken(storedToken);
      }
    } catch (e) {
      console.error("Impossible d'accéder au localStorage", e);
    }
    setIsAuthLoading(false);
  }, []);

  const handleLogin = (token) => {
    try {
      localStorage.setItem("adminAuthToken", token);
      setAuthToken(token);
    } catch (e) {
      console.error("Impossible d'accéder au localStorage", e);
      alert(
        "Impossible de sauvegarder la session. Votre navigateur est peut-être en mode privé."
      );
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("adminAuthToken");
    } catch (e) {
      console.error("Impossible d'accéder au localStorage", e);
    }
    setAuthToken(null);
  };

  if (isAuthLoading) {
    return <div>Chargement de la session...</div>;
  }

  return (
    <div>
      {authToken ? (
        <Dashboard token={authToken} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
