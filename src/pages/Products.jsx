import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  const handleBuy = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Create order
      const orderRes = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      }).then((res) => res.json());

      if (import.meta.env.MODE === "development") {
        console.log("🧾 Create Order Response:", orderRes);
      }

      if (!orderRes.razorpayOrder || !orderRes.orderId) {
        if (orderRes.errorCode === "NO_ADDRESS_FOUND") {
          const confirmRedirect = window.confirm(
            "You don’t have a saved address. Would you like to add one now?"
          );
          if (confirmRedirect) navigate("/addresses");
          return;
        }
        throw new Error(orderRes.message || "Order creation failed");
      }

      // 2️⃣ Razorpay setup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.razorpayOrder.amount,
        currency: orderRes.razorpayOrder.currency,
        order_id: orderRes.razorpayOrder.id,
        name: "OscillAudio Shop",
        description: orderRes.productTitle || "Product Purchase",

        handler: async function (response) {
          // 3️⃣ Verify payment
          const verifyBody = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderRes.orderId,
          };

          const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(verifyBody),
          }).then((res) => res.json());

          if (import.meta.env.MODE === "development") {
            console.log("✅ Verify Payment Response:", verifyRes);
          }

          alert(verifyRes.message || "Payment verified successfully!");
        },

        theme: { color: "#0d6efd" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert(err.message || "Payment failed. Please try again.");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data.files || []);
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Products</h2>
        <button onClick={logout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

<div style={styles.grid}>
  {console.log("Products List:", products)}
  {products.map((file) => (
    <div key={file.id} style={styles.card}>
      {/* File Icon */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/281/281760.png"
        alt="file"
        style={styles.image}
      />

      <h3 style={styles.title}>{file.name}</h3>

      <p style={styles.category}>{file.mimeType}</p>

      <strong>₹{file.amount}</strong>

      {/* View File */}
      {/* <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        style={styles.viewButton}
      >
        View File
      </a> */}

      {/* Buy */}
      <button onClick={() => handleBuy(file.id)} style={styles.buyButton}>
        Buy Now
      </button>
    </div>
  ))}
</div>

    </div>
  );
}

const styles = {
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "center",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 15,
    width: 220,
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    transition: "transform 0.2s ease",
  },
  image: {
    width: "100%",
    height: 160,
    objectFit: "cover",
    borderRadius: 6,
  },
  title: { fontSize: 18, margin: "10px 0 4px" },
  category: { fontSize: 14, color: "#666", marginBottom: 6 },
  buyButton: {
    marginTop: 10,
    padding: "8px 16px",
    backgroundColor: "#0d6efd",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  logoutButton: {
    padding: "6px 12px",
    border: "1px solid #ccc",
    borderRadius: 5,
    backgroundColor: "#f8f9fa",
    cursor: "pointer",
  },
};
