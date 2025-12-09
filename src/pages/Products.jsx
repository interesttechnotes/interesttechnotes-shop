import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleBuy = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const orderRes = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      }).then((res) => res.json());

      if (!orderRes.razorpayOrder || !orderRes.orderId) {
        throw new Error(orderRes.message || "Order creation failed");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.razorpayOrder.amount,
        currency: orderRes.razorpayOrder.currency,
        order_id: orderRes.razorpayOrder.id,
        name: "interest tech notes",
        handler: async function (response) {
          const token = localStorage.getItem("token");

          const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderRes.orderId,
            }),
          }).then((res) => res.json());

          alert(verifyRes.message || "Payment verified successfully!");
        },
        theme: { color: "var(--primary-color)" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      alert(err.message);
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
    <div style={{ padding: 25, color: "var(--text-color)" }}>
      <h2 style={{ color: "var(--text-color)" }}>Products</h2>

      <div style={styles.grid}>
        {products.map((file) => (
          <div key={file.id} style={styles.card}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/281/281760.png"
              style={styles.image}
              alt="file"
            />

            <h3 style={{ color: "var(--text-color)" }}>{file.name}</h3>
            <p style={styles.category}>{file.mimeType}</p>
            <strong style={{ color: "var(--text-color)" }}>₹{file.amount}</strong>

            <button style={styles.buyButton} onClick={() => handleBuy(file.id)}>
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
    marginTop: 20,
  },
  card: {
    width: 220,
    padding: 16,
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: 8,
    textAlign: "center",
    boxShadow: "0 2px 6px var(--nav-shadow)",
    transition: "0.3s",
  },
  image: {
    width: "100%",
    height: 150,
    objectFit: "cover",
    borderRadius: 6,
  },
  category: {
    color: "var(--text-color)",
    fontSize: 14,
  },
  buyButton: {
    marginTop: 10,
    padding: "8px 14px",
    background: "var(--primary-color)",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
};
