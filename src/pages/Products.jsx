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
  const parseDescription = (desc) => {
    try {
      return desc ? JSON.parse(desc) : {};
    } catch {
      return {};
    }
  };
  const getCategoryColor = (category) => {
    switch ((category || "").toLowerCase()) {
      case "common":
        return "#6ec1ff"; // blue
      case "rare":
        return "#f1c40f"; // yellow
      case "epic":
        return "#9b59b6"; // purple
      case "legendary":
        return "#e67e22"; // orange / gold
      default:
        return "#6ec1ff"; // fallback dark card
    }
  };

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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
        {products.map((file) => {
          const meta = parseDescription(file?.wholeFileObject?.description);
          const price = meta.price ?? file.amount;
          const category = meta.category ?? "common";
          const subtitle = meta.subTitle ?? "No description available";

          const bgColor = getCategoryColor(category);

          return (
            <div
              key={file.id}
              style={{
                ...styles.card,
                background: bgColor,
                color: "#fff",
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/281/281760.png"
                style={styles.image}
                alt="file"
              />

              <h3>{file.name}</h3>
              {/* <p style={{ fontSize: 14 }}>{category.toUpperCase()}</p> */}
              {/* ✅ SUBTITLE instead of category */}
              <p style={styles.subtitle}>
                {subtitle}
              </p>
              <div style={styles.dateRow}>
  <span>Created: {formatDate(file?.wholeFileObject?.createdTime)}</span>
  <span>Updated: {formatDate(file?.wholeFileObject?.modifiedTime)}</span>
</div>

              <strong>₹{price}</strong>

              <button
                style={styles.buyButton}
                onClick={() => handleBuy(file.id)}
              >
                Buy Now
              </button>
            </div>
          );
        })}

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
  subtitle: {
    fontSize: 13,
    opacity: 0.9,
    lineHeight: "1.4em",
    height: "2.8em",               // 2 lines × line-height
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,            // 👈 number of lines
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
  },
dateRow: {
  fontSize: 11,
  opacity: 0.85,
  display: "flex",
  justifyContent: "space-between",
  marginTop: 6,
  marginBottom: 6,
},

  buyButton: {
    marginTop: 10,
    marginLeft: "10px",
    padding: "8px 14px",
    background: "var(--primary-color)",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
};
