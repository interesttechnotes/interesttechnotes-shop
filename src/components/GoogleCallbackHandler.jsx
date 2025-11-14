// GoogleCallbackHandler.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const GoogleCallbackHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // ✅ Get query parameters directly from the URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");
        console.log("cod e", code);

        if (error) {
            console.error("Google OAuth error:", error);
            navigate("/login?error=google_login_failed");
            return;
        }

        if (code) {
            fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ code }),
            })
                .then(async (res) => {
                    if (!res.ok) throw new Error("Failed to exchange code");
                    const data = await res.json();
                    console.log("✅ Google user data:", data);

                    // ✅ Save token and user separately
                    if (data.success && data.token && data.user) {
                        localStorage.setItem("token", data.token);
                        localStorage.setItem("user", JSON.stringify(data.user));

                        // Redirect to dashboard or home
                        navigate("/");
                    } else {
                        throw new Error("Invalid response from Google authentication");
                    }
                })
                .catch((err) => {
                    console.error("Google login failed:", err);
                    navigate("/login?error=google_exchange_failed");
                });
        }
    }, [navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <p>Processing Google login...</p>
        </div>
    );
};
