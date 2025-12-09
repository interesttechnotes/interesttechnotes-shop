import React from "react";

export const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      include_granted_scopes: "true",
      prompt: "consent",
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: 8,
        border: "1px solid var(--border-color)",
        background: "var(--card-bg)",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        fontSize: 15,
        fontWeight: 500,
        color: "var(--text-color)",
        transition: "0.3s",
      }}
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        width={20}
      />
      Continue with Google
    </button>
  );
};
