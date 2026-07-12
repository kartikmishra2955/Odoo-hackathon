// src/App.jsx
import { useEffect, useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { getToken, logout } from "./api/auth";
import { getCurrentUser } from "./api/auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // On load, if a JWT is already stored, try to rehydrate the session
  // instead of bouncing the user back to the login screen.
  useEffect(() => {
    async function restoreSession() {
      if (!getToken()) {
        setCheckingSession(false);
        return;
      }
      try {
        const me = await getCurrentUser();
        setUser(me.user ?? me);
      } catch {
        // Token invalid/expired — client.js already clears it on 401.
      } finally {
        setCheckingSession(false);
      }
    }
    restoreSession();
  }, []);

  function handleAuthenticated(authedUser) {
    setUser(authedUser);
  }

  function handleLogout() {
    logout();
    setUser(null);
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-[13px] text-ink-dim">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Login onAuthenticated={handleAuthenticated} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
