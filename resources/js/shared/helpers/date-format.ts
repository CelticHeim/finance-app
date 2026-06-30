/**
 * Parsea una fecha string del formato YYYY-MM-DD a un objeto Date
 * tratándola como fecha local (sin conversión de zona horaria)
 */
export function parseLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Formatea una fecha a string legible en español
 */
export function formatDate(dateString: string, options: Intl.DateTimeFormatOptions = {}): string {
    const date = parseLocalDate(dateString);
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options,
    };
    
    return date.toLocaleDateString('es-ES', defaultOptions);
}

/**
 * Formatea una fecha a string corto (DD/MM/YYYY)
 */
export function formatDateShort(dateString: string): string {
    const date = parseLocalDate(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

/**
 * Formatea una fecha a string largo
 */
export function formatDateLong(dateString: string): string {
    const date = parseLocalDate(dateString);
    
    return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Obtiene solo el día del mes
 */
export function getDayOfMonth(dateString: string): number {
    const date = parseLocalDate(dateString);
    return date.getDate();
}

/**
 * Obtiene el mes (0-11)
 */
export function getMonth(dateString: string): number {
    const date = parseLocalDate(dateString);
    return date.getMonth();
}

/**
 * Obtiene el año
 */
export function getYear(dateString: string): number {
    const date = parseLocalDate(dateString);
    return date.getFullYear();
}

/**
 * Convierte una fecha a formato ISO (YYYY-MM-DD) para enviar al servidor
 */
export function toISODate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

/**
 * Compara si dos fechas son el mismo día
 */
export function isSameDay(date1String: string, date2String: string): boolean {
    const date1 = parseLocalDate(date1String);
    const date2 = parseLocalDate(date2String);
    
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

/**
 * Verifica si una fecha es hoy
 */
export function isToday(dateString: string): boolean {
    const date = parseLocalDate(dateString);
    const today = new Date();
    
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}

/**
 * Verifica si una fecha está en el pasado
 */
export function isPast(dateString: string): boolean {
    const date = parseLocalDate(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date < today;
}

/**
 * Verifica si una fecha está en el futuro
 */
export function isFuture(dateString: string): boolean {
    const date = parseLocalDate(dateString);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    return date > today;
}
