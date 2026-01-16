import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import Spinner from "./Spinner"; // Import Spinner component

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State for loading spinner
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Show spinner
    try {
      await login(email, password);
      // Navigation erfolgt automatisch durch useEffect
    } catch (err: any) {
      let message = "Login fehlgeschlagen. Bitte prüfen Sie Ihre Zugangsdaten.";
      if (err?.code === "auth/user-not-found") message = "Benutzer nicht gefunden.";
      if (err?.code === "auth/wrong-password") message = "Falsches Passwort.";
      if (err?.code === "auth/invalid-email") message = "Ungültige E-Mail-Adresse.";
      setError(message);
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">E-Mail</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="username"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-gray-700">Passwort</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="current-password"
          />
        </div>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        {loading ? (
          <Spinner /> // Show spinner while loading
        ) : (
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Login
          </button>
        )}
      </form>
    </div>
  );
}
