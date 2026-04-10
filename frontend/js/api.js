// Configuración de la API
const API_URL = 'http://localhost:3000/api';

class TaskAPI {
    // Obtener todas las tareas
    async getAllTasks(filters = {}) {
        let url = `${API_URL}/tasks`;
        const params = new URLSearchParams();
        
        if (filters.status && filters.status !== 'all') {
            params.append('status', filters.status);
        }
        if (filters.sort === 'priority') {
            params.append('sort', 'priority');
        }
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener tareas');
        return await response.json();
    }

    // Crear nueva tarea
    async createTask(task) {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al crear tarea');
        }
        return await response.json();
    }

    // Actualizar tarea
    async updateTask(id, task) {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al actualizar tarea');
        }
        return await response.json();
    }

    // Eliminar tarea
    async deleteTask(id) {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al eliminar tarea');
        }
        return await response.json();
    }
}

const taskAPI = new TaskAPI();