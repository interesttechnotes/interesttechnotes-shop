import React, { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (import.meta.env.MODE === "development") {
          console.log("📦 Orders:", data);
        }

        if (res.ok) setOrders(data.orders || []);
        else setError(data.message || "Failed to fetch orders");
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading orders...</p>;

  if (error)
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "50px" }}>
        {error}
      </p>
    );

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Orders</h2>

      {orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>No orders found.</p>
      ) : (
        <div style={styles.list}>
          {orders.map((order) => (
            <div key={order._id} style={styles.card}>
              <div style={styles.productInfo}>
                <img
                  src={order.product?.image}
                  alt={order.product?.title}
                  style={styles.image}
                />
                <div>
                  <h3 style={styles.title}>{order.product?.title}</h3>
                  <p style={styles.text}>Price: ₹{order.price}</p>
                  <p style={styles.text}>Quantity: {order.quantity}</p>
                  <p style={styles.text}>
                    Total: <b>₹{order.totalAmount}</b>
                  </p>
                </div>
              </div>

              <div style={styles.details}>
                <p style={styles.text}>Status: {order.orderStatus}</p>
                <p style={styles.text}>
                  Payment: {order.isPaid ? "✅ Paid" : "❌ Unpaid"}
                </p>
                <p style={styles.text}>
                  Address: {order.shippingAddress?.street},{" "}
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.state} -{" "}
                  {order.shippingAddress?.postalCode}
                </p>
                <p style={styles.text}>
                  Ordered on:{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ Inline CSS styles
const styles = {
  container: {
    // maxWidth: "900px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    fontSize: "28px",
    marginBottom: "30px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #e0e0e0",
    backgroundColor: "#fafafa",
  },
  productInfo: {
    display: "flex",
    gap: "20px",
  },
  image: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  title: {
    fontSize: "18px",
    marginBottom: "6px",
  },
  text: {
    fontSize: "14px",
    margin: "3px 0",
  },
  details: {
    textAlign: "right",
  },
};

export default OrdersPage;
