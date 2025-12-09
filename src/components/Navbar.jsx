import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleTheme = () => {
    const current = document.documentElement.dataset.theme;
    console.log("Current theme:", current);
    document.documentElement.dataset.theme = current === "dark" ? "light" : "dark";

    // Optional: store in localStorage
    localStorage.setItem("theme", current === "dark" ? "light" : "dark");
  };

  // Load theme on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    document.documentElement.dataset.theme = saved;
  }, []);

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/products" style={styles.logo}>
          interest tech notes
        </Link>
      </div>

      <div style={styles.right}>
        {isLoggedIn && (
          <Link to="/products" style={styles.link}>
            Products
          </Link>
        )}

        <button onClick={toggleTheme} style={styles.themeButton}>
          Toggle Theme
        </button>

        {isLoggedIn && (
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    padding: "15px 30px",
    background: "var(--bg-color)",
    boxShadow: "0 2px 10px var(--nav-shadow)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 99,
  },
  left: {
    fontSize: 22,
    fontWeight: 700,
  },
  logo: {
    textDecoration: "none",
    color: "var(--primary-color)",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  link: {
    textDecoration: "none",
    color: "var(--text-color)",
    fontSize: 16,
  },
  themeButton: {
    padding: "6px 12px",
    borderRadius: 6,
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    cursor: "pointer",
    color: "var(--text-color)",
  },
  logoutButton: {
    padding: "6px 12px",
    borderRadius: 6,
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    cursor: "pointer",
    color: "var(--text-color)",
  },
};
