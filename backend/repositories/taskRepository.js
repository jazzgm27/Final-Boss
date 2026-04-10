const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/tasks.json');

class TaskRepository {
    // Leer todas las tareas
    read() {
        try {
            const data = fs.readFileSync(dataPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            // Si el archivo no existe, crear uno vacío
            const emptyData = { tasks: [] };
            this.write(emptyData);
            return emptyData;
        }
    }

    // Escribir todas las tareas
    write(data) {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    }

    // Buscar tarea por ID
    findById(id) {
        const data = this.read();
        const task = data.tasks.find(t => t.id === id);
        if (!task) throw new Error('Tarea no encontrada');
        return task;
    }

    // Guardar o actualizar tarea
    save(task) {
        const data = this.read();
        const index = data.tasks.findIndex(t => t.id === task.id);
        
        if (index === -1) {
            data.tasks.push(task);
        } else {
            data.tasks[index] = task;
        }
        
        this.write(data);
        return task;
    }

    // Eliminar tarea
    delete(id) {
        const data = this.read();
        const filteredTasks = data.tasks.filter(t => t.id !== id);
        
        if (filteredTasks.length === data.tasks.length) {
            throw new Error('Tarea no encontrada');
        }
        
        this.write({ tasks: filteredTasks });
        return true;
    }

    // Obtener todas las tareas
    getAll() {
        const data = this.read();
        return data.tasks;
    }
}

module.exports = new TaskRepository();