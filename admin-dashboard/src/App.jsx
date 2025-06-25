import React, { useState, useEffect } from "react";

// Composant pour le Dashboard principal
const Dashboard = ({ token, onLogout }) => {
  const [metrics, setMetrics] = useState(null);
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
          setMetrics(result.data);
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
    return <div style={styles.container}>Chargement des données...</div>;
  }

  if (error) {
    return (
      <div style={{ ...styles.container, color: "red" }}>Erreur: {error}</div>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={onLogout} style={styles.logoutButton}>
        Déconnexion
      </button>
      <h1 style={styles.header}>Tableau de Bord Yessi-Yessi</h1>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Taux d'Activation</h2>
          <p style={styles.metricValue}>{metrics?.activationRate}%</p>
          <p style={styles.cardDescription}>
            des utilisateurs ont configuré leur épargne.
          </p>
        </div>

        {/* Placeholders pour les futures métriques */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Rétention J30</h2>
          <p style={styles.metricValue}>N/A</p>
          <p style={styles.cardDescription}>Prochainement disponible.</p>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Total Utilisateurs</h2>
          <p style={styles.metricValue}>N/A</p>
          <p style={styles.cardDescription}>Prochainement disponible.</p>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Total Épargné</h2>
          <p style={styles.metricValue}>N/A</p>
          <p style={styles.cardDescription}>Prochainement disponible.</p>
        </div>
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

const styles = {
  container: {
    fontFamily: "sans-serif",
    padding: "20px",
    maxWidth: "1200px",
    margin: "auto",
  },
  header: { textAlign: "center", marginBottom: "30px", color: "#212121" },
  logoutButton: {
    float: "right",
    padding: "8px 12px",
    background: "#f1f1f1",
    border: "1px solid #ccc",
    borderRadius: "8px",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #e0e0e0",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    backgroundColor: "white",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#757575",
    margin: "0 0 10px 0",
  },
  metricValue: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#2e7d32",
    margin: "0 0 5px 0",
  },
  cardDescription: { fontSize: "14px", color: "#757575", margin: 0 },
};

export default App;
