import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';

interface User {
    id: number;
    name: string;
    email: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            setLoading(true);
            // Ejemplo de petición a la API
            const response = await api.get('/user');
            setUser(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar los datos');
            console.error('Error fetching user:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Dashboard
                </h1>
                
                <div className="mb-6">
                    {loading && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-700">Cargando información del usuario...</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700 font-semibold">Error:</p>
                            <p className="text-red-600">{error}</p>
                            <p className="text-sm text-red-500 mt-2">
                                Nota: Necesitas estar autenticado para acceder a esta información.
                            </p>
                        </div>
                    )}
                    
                    {user && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <h2 className="text-2xl font-semibold text-green-900 mb-3">
                                Información del Usuario
                            </h2>
                            <div className="space-y-2">
                                <p className="text-green-800">
                                    <span className="font-semibold">ID:</span> {user.id}
                                </p>
                                <p className="text-green-800">
                                    <span className="font-semibold">Nombre:</span> {user.name}
                                </p>
                                <p className="text-green-800">
                                    <span className="font-semibold">Email:</span> {user.email}
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {!loading && !error && !user && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-700">
                                No hay información disponible. Inicia sesión para ver tus datos.
                            </p>
                        </div>
                    )}
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                        📝 Ejemplo de uso de Axios
                    </h3>
                    <p className="text-gray-700 text-sm">
                        Esta página hace una petición GET a <code className="bg-gray-200 px-2 py-1 rounded">/api/user</code> usando Axios.
                        El interceptor de Axios maneja automáticamente los errores 401 y añade el token de autenticación.
                    </p>
                </div>
                
                <Link
                    to="/"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    ← Volver al inicio
                </Link>
            </div>
        </div>
    );
}
