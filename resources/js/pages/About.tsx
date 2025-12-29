import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Acerca de la Aplicación
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                    Esta es una página de ejemplo usando React Router DOM.
                </p>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-purple-900 mb-3">
                        Tecnologías utilizadas
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-purple-800 mb-2">Frontend</h3>
                            <ul className="text-purple-700 space-y-1">
                                <li>• React 19</li>
                                <li>• TypeScript</li>
                                <li>• React Router DOM</li>
                                <li>• Axios</li>
                                <li>• Tailwind CSS</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-purple-800 mb-2">Backend</h3>
                            <ul className="text-purple-700 space-y-1">
                                <li>• Laravel 11</li>
                                <li>• PHP</li>
                                <li>• Sanctum (Auth)</li>
                                <li>• API REST</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <Link
                    to="/"
                    className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    ← Volver al inicio
                </Link>
            </div>
        </div>
    );
}
