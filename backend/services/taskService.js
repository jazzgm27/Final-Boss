const repository = require('../repositories/taskRepository');

class TaskService {
    // Obtener todas las tareas
    getAllTasks() {
        return repository.getAll();
    }

    // Crear nueva tarea
    createTask(taskData) {
        // Validaciones
        if (!taskData.name || taskData.name.trim().length < 3) {
            throw new Error('El nombre debe tener al menos 3 caracteres');
        }
        
        if (!taskData.priority || !['high', 'medium', 'low'].includes(taskData.priority)) {
            throw new Error('Prioridad inválida');
        }

        const newTask = {
            id: Date.now().toString(),
            name: taskData.name.trim(),
            priority: taskData.priority,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        return repository.save(newTask);
    }

    // Actualizar tarea
    updateTask(id, updateData) {
        const existingTask = repository.findById(id);
        
        // Validar que no se pueda modificar una tarea completada (opcional)
        // if (existingTask.status === 'completed' && updateData.priority) {
        //     throw new Error('No se puede cambiar prioridad de una tarea completada');
        // }
        
        const updatedTask = {
            ...existingTask,
            name: updateData.name !== undefined ? updateData.name.trim() : existingTask.name,
            priority: updateData.priority !== undefined ? updateData.priority : existingTask.priority,
            status: updateData.status !== undefined ? updateData.status : existingTask.status
        };

        return repository.save(updatedTask);
    }

    // Eliminar tarea
    deleteTask(id) {
        return repository.delete(id);
    }

    // Filtrar por estado
    filterByStatus(tasks, status) {
        if (status === 'all') return tasks;
        return tasks.filter(task => task.status === status);
    }

    // Ordenar por prioridad
    sortByPriority(tasks) {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }
}

module.exports = new TaskService();