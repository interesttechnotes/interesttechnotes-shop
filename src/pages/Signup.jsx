import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLoginButton } from "../components/GoogleLoginButton";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const signupUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Signing up user:", { name, email, password });
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      console.log("Response status:", res.status);

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/products");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page.container}>
      <div style={page.card}>
        <h2 style={page.title}>Create Account</h2>
        <p style={page.subtitle}>Signup to get started</p>

        <form onSubmit={signupUser} style={{ width: "100%", marginTop: 20 }}>
          <input
            type="text"
            placeholder="Full Name"
            style={page.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type={import.meta.env.MODE === "development" ? "text" : "email"}
            placeholder="Email"
            style={page.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            style={page.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" style={page.button} disabled={loading}>
            {loading ? "Creating account..." : "Signup"}
          </button>
        </form>

        <div style={page.dividerWrapper}>
          <div style={page.line}></div>
          <span style={page.dividerText}>or</span>
          <div style={page.line}></div>
        </div>

        <GoogleLoginButton />
      </div>
    </div>
  );
}

const page = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
    background: "var(--bg-color)",
    transition: "0.3s",
  },
  card: {
    width: "380px",
    background: "var(--card-bg)",
    borderRadius: 12,
    padding: "40px 32px",
    boxShadow: "0 8px 25px var(--nav-shadow)",
    textAlign: "center",
    transition: "0.3s",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 5,
    color: "var(--text-color)",
  },
  subtitle: {
    fontSize: 15,
    color: "var(--text-color)",
    opacity: 0.7,
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: 14,
    borderRadius: 8,
    border: "1px solid var(--border-color)",
    fontSize: 15,
    outline: "none",
    background: "var(--bg-color)",
    color: "var(--text-color)",
    transition: "0.3s",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: 16,
    background: "var(--primary-color)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "0.3s",
  },
  dividerWrapper: {
    display: "flex",
    alignItems: "center",
    margin: "22px 0",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "var(--border-color)",
  },
  dividerText: {
    margin: "0 10px",
    color: "var(--text-color)",
    opacity: 0.7,
    fontSize: 14,
  },
};
