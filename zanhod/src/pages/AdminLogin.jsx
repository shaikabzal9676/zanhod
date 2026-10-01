import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight } from "lucide-react";

import { useAdminAuth } from "../context/AdminAuthContext";
import "../styles/admin-login.css";

function AdminLogin() {
  const navigate = useNavigate();

  const {
    login,
    isAuthenticated,
  } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/admin/orders" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);

      navigate("/admin/orders", {
        replace: true,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-wrapper">

        <div className="admin-login-brand">
          <div className="admin-login-logo">
            Z
          </div>

          <p>ZANHOD / ADMIN</p>
        </div>

        <div className="admin-login-card">

          <div className="admin-login-header">
            <span>SECURE ACCESS</span>

            <h1>
              ADMIN
              <br />
              LOGIN
            </h1>

            <p>
              Sign in to manage ZANHOD orders.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="admin-field">
              <label>EMAIL ADDRESS</label>

              <div className="admin-input">
                <Mail size={17} />

                <input
                  type="email"
                  placeholder="admin@zanhod.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="admin-field">
              <label>PASSWORD</label>

              <div className="admin-input">
                <Lock size={17} />

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />
              </div>
            </div>

            {error && (
              <div className="admin-login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >
              {loading ? (
                "AUTHENTICATING..."
              ) : (
                <>
                  SIGN IN
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          <div className="admin-login-footer">
            <span>AUTHORIZED PERSONNEL ONLY</span>
            <span>ZANHOD © 2026</span>
          </div>

        </div>
      </div>
    </main>
  );
}

export default AdminLogin;