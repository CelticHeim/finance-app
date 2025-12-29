import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Bienvenido a tu App Laravel + React
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                    Esta aplicación ahora usa React Router DOM para el enrutamiento del lado del cliente
                    y Axios para las peticiones a la API de Laravel.
                </p>
                
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h2 className="text-xl font-semibold text-blue-900 mb-2">
                            🚀 Características
                        </h2>
                        <ul className="list-disc list-inside text-blue-800 space-y-1">
                            <li>React Router DOM para navegación del lado del cliente</li>
                            <li>Axios configurado con interceptors</li>
                            <li>API de Laravel para el backend</li>
                            <li>Tailwind CSS para estilos</li>
                        </ul>
                    </div>
                    
                    <div className="flex gap-4">
                        <Link
                            to="/about"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Ir a About
                        </Link>
                        <Link
                            to="/dashboard"
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Ir a Dashboard
                        </Link>
                        <Link
                            to="/examples"
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Ver Ejemplos API
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
