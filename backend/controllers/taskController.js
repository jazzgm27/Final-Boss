const taskService = require('../services/taskService');

class TaskController {
    // GET /api/tasks
    getAllTasks(req, res) {
        try {
            let tasks = taskService.getAllTasks();
            
            // Aplicar filtro si existe
            const { status, sort } = req.query;
            if (status) {
                tasks = taskService.filterByStatus(tasks, status);
            }
            if (sort === 'priority') {
                tasks = taskService.sortByPriority(tasks);
            }
            
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // POST /api/tasks
    createTask(req, res) {
        try {
            const { name, priority } = req.body;
            
            if (!name) {
                return res.status(400).json({ error: 'El nombre es requerido' });
            }
            if (!priority) {
                return res.status(400).json({ error: 'La prioridad es requerida' });
            }
            
            const newTask = taskService.createTask({ name, priority });
            res.status(201).json({ message: 'Tarea creada exitosamente', task: newTask });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // PUT /api/tasks/:id
    updateTask(req, res) {
        try {
            const { id } = req.params;
            const { name, priority, status } = req.body;
            
            const updatedTask = taskService.updateTask(id, { name, priority, status });
            res.json({ message: 'Tarea actualizada exitosamente', task: updatedTask });
        } catch (error) {
            if (error.message === 'Tarea no encontrada') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    // DELETE /api/tasks/:id
    deleteTask(req, res) {
        try {
            const { id } = req.params;
            taskService.deleteTask(id);
            res.json({ message: 'Tarea eliminada exitosamente' });
        } catch (error) {
            if (error.message === 'Tarea no encontrada') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }
}

module.exports = new TaskController();