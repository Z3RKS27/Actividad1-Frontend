'use client';
import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [token, setToken] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  const BACKEND_URL = 'http://110.0.0.0:3001'; 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
      } else {
        setError(data.message || 'Error en las credenciales');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor backend');
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setDashboardData(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al consultar la ruta protegida');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center">Arquitectura AWS: JWT & Zero Trust</h1>
        
        {!token ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Usuario</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 mt-1 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mt-1 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                required 
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button 
              type="submit" 
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition"
            >
              Iniciar Sesión
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-900/50 border border-green-500 rounded text-green-200 text-xs break-all">
              <strong>Token JWT Generado:</strong> {token}
            </div>
            <button 
              onClick={fetchDashboard}
              className="w-full py-2 bg-green-600 hover:bg-green-700 rounded font-semibold transition"
            >
              Consultar Ruta Protegida
            </button>
            {dashboardData && (
              <div className="p-4 bg-gray-700 rounded space-y-2">
                <p className="font-bold text-blue-400">{dashboardData.message}</p>
                <p className="text-sm text-gray-300">{dashboardData.data}</p>
              </div>
            )}
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        )}
      </div>
    </main>
  );
}
