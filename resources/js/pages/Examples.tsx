import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';

interface Example {
    id: number;
    title: string;
    description: string;
}

export default function Examples() {
    const [examples, setExamples] = useState<Example[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchExamples();
    }, []);

    const fetchExamples = async () => {
        try {
            setLoading(true);
            const response = await api.get('/examples');
            setExamples(response.data.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar los ejemplos');
            console.error('Error fetching examples:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            setSubmitting(true);
            const response = await api.post('/examples', {
                title: newTitle,
                description: newDescription,
            });
            
            // Agregar el nuevo item a la lista
            setExamples([response.data.data, ...examples]);
            setNewTitle('');
            setNewDescription('');
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al crear el ejemplo');
            console.error('Error creating example:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/examples/${id}`);
            setExamples(examples.filter(ex => ex.id !== id));
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al eliminar el ejemplo');
            console.error('Error deleting example:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Ejemplos con API
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Esta página demuestra cómo hacer peticiones GET, POST y DELETE a la API de Laravel
                    </p>

                    {/* Formulario para crear nuevo ejemplo */}
                    <form onSubmit={handleSubmit} className="mb-8">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-blue-900 mb-4">
                                Crear nuevo ejemplo (POST)
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-800 mb-1">
                                        Título *
                                    </label>
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ingresa un título"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-800 mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ingresa una descripción (opcional)"
                                        rows={3}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting || !newTitle.trim()}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {submitting ? 'Creando...' : 'Crear Ejemplo'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Mensajes de error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-700 font-semibold">Error:</p>
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Lista de ejemplos */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Lista de ejemplos (GET)
                        </h2>
                        
                        {loading && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-blue-700">Cargando ejemplos...</p>
                            </div>
                        )}

                        {!loading && examples.length === 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-yellow-700">
                                    No hay ejemplos todavía. ¡Crea el primero!
                                </p>
                            </div>
                        )}

                        {!loading && examples.length > 0 && (
                            <div className="space-y-4">
                                {examples.map((example) => (
                                    <div
                                        key={example.id}
                                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-start"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                {example.title}
                                            </h3>
                                            <p className="text-gray-600 mt-1">
                                                {example.description || 'Sin descripción'}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                ID: {example.id}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(example.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <Link
                            to="/"
                            className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>

                {/* Información técnica */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        📚 Información técnica
                    </h2>
                    <div className="space-y-4 text-gray-700">
                        <div>
                            <h3 className="font-semibold text-gray-900">Endpoints utilizados:</h3>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/examples</code> - Obtener lista</li>
                                <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/examples</code> - Crear nuevo</li>
                                <li><code className="bg-gray-100 px-2 py-1 rounded">DELETE /api/examples/:id</code> - Eliminar</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Archivo del controlador:</h3>
                            <p className="mt-1"><code className="bg-gray-100 px-2 py-1 rounded">app/Http/Controllers/ExampleController.php</code></p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Archivo de rutas:</h3>
                            <p className="mt-1"><code className="bg-gray-100 px-2 py-1 rounded">routes/api.php</code></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
