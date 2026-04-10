const express = require('express');
const cors = require('cors');
const taskController = require('./controllers/taskController');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/api/tasks', (req, res) => taskController.getAllTasks(req, res));
app.post('/api/tasks', (req, res) => taskController.createTask(req, res));
app.put('/api/tasks/:id', (req, res) => taskController.updateTask(req, res));
app.delete('/api/tasks/:id', (req, res) => taskController.deleteTask(req, res));

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});