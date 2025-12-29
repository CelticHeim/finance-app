import RegistroForm from '../components/RegistroForm';
import Calendar from '../components/calendar/Calendar';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    Mi Finanzas
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left side - Registro Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <RegistroForm />
                        </div>
                    </div>

                    {/* Right side - Calendar */}
                    <div className="lg:col-span-2">
                        <Calendar />
                    </div>
                </div>
            </div>
        </div>
    );
}
