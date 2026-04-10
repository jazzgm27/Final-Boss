// Estado de la aplicación
let currentFilter = 'all';
let currentSort = false;

// Elementos del DOM
const tasksList = document.getElementById('tasksList');
const taskNameInput = document.getElementById('taskName');
const taskPrioritySelect = document.getElementById('taskPriority');
const addTaskBtn = document.getElementById('addTaskBtn');
const sortBtn = document.getElementById('sortBtn');

// Funciones auxiliares
function getPriorityText(priority) {
    const priorities = { high: 'Alta', medium: 'Media', low: 'Baja' };
    return priorities[priority] || priority;
}

function getPriorityClass(priority) {
    const classes = { high: 'priority-high', medium: 'priority-medium', low: 'priority-low' };
    return classes[priority] || '';
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showError(message) {
    alert(message);
}

function showSuccess(message) {
    console.log(message);
}

// Actualizar contador
async function updatePendingCount() {
    try {
        const allTasks = await taskAPI.getAllTasks({});
        const pendingTasks = allTasks.filter(task => task.status === 'pending');
        const pendingCount = document.getElementById('pendingCount');
        if (pendingCount) {
            pendingCount.textContent = pendingTasks.length;
        }
    } catch (error) {
        console.error(error);
    }
}

// Renderizar tareas
async function renderTasks() {
    try {
        // Obtener tareas
        let tasks = await taskAPI.getAllTasks({});
        
        console.log('Tareas antes de ordenar:', tasks);
        
        // ORDENAR si está activado
        if (currentSort) {
            const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
            tasks.sort((a, b) => {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            console.log('Tareas después de ordenar:', tasks);
        }
        
        // Filtrar
        if (currentFilter !== 'all') {
            tasks = tasks.filter(task => task.status === currentFilter);
        }
        
        // Actualizar contador
        await updatePendingCount();
        
        // Mostrar tareas
        if (tasks.length === 0) {
            tasksList.innerHTML = `<div class="text-center text-muted py-5"><p>No hay tareas. ¡Agrega una!</p></div>`;
            return;
        }
        
        tasksList.innerHTML = tasks.map(task => `
            <div class="task-card ${task.status === 'completed' ? 'completed' : ''}" data-id="${task.id}">
                <div class="row align-items-center">
                    <div class="col-md-1 text-center">
                        <i class="fas fa-grip-vertical text-muted" style="cursor: grab;"></i>
                    </div>
                    <div class="col-md-5">
                        <span class="task-name fw-bold">${escapeHtml(task.name)}</span>
                        <br>
                        <span class="priority-badge ${getPriorityClass(task.priority)}">
                            ${getPriorityText(task.priority)} Prioridad
                        </span>
                    </div>
                    <div class="col-md-6 text-end">
                        ${task.status === 'pending' ? 
                            `<button class="btn-complete" onclick="toggleStatus('${task.id}', 'completed')"> Completar</button>` :
                            `<button class="btn-pending" onclick="toggleStatus('${task.id}', 'pending')"> Reabrir</button>`
                        }
                        <button class="btn-edit" onclick="editTask('${task.id}', '${escapeHtml(task.name)}', '${task.priority}')">Editar</button>
                        <button class="btn-delete" onclick="deleteTask('${task.id}')">Eliminar</button>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        showError(error.message);
        console.error(error);
    }
}

// CRUD
async function addTask() {
    const name = taskNameInput.value.trim();
    const priority = taskPrioritySelect.value;
    
    if (!name) {
        showError('El nombre es requerido');
        return;
    }
    
    try {
        await taskAPI.createTask({ name, priority });
        taskNameInput.value = '';
        await renderTasks();
    } catch (error) {
        showError(error.message);
    }
}

async function toggleStatus(id, newStatus) {
    try {
        await taskAPI.updateTask(id, { status: newStatus });
        await renderTasks();
    } catch (error) {
        showError(error.message);
    }
}

async function editTask(id, currentName, currentPriority) {
    const newName = prompt('Editar nombre:', currentName);
    if (newName && newName.trim()) {
        await taskAPI.updateTask(id, { name: newName.trim() });
        await renderTasks();
    }
}

async function deleteTask(id) {
    if (confirm('¿Eliminar esta tarea?')) {
        await taskAPI.deleteTask(id);
        await renderTasks();
    }
}

// Eventos
addTaskBtn.onclick = addTask;
taskNameInput.onkeypress = (e) => { if (e.key === 'Enter') addTask(); };

// Botón de ordenar - VERSIÓN SIMPLE
sortBtn.onclick = function() {
    console.log('Botón clickeado - currentSort antes:', currentSort);
    currentSort = !currentSort;
    console.log('currentSort después:', currentSort);
    
    if (currentSort) {
        sortBtn.style.background = '#ffc107';
        sortBtn.style.color = 'black';
        sortBtn.innerHTML = 'Ordenado por Prioridad';
        alert('Orden activado: Las tareas se ordenarán por prioridad (Alta → Baja)');
    } else {
        sortBtn.style.background = '';
        sortBtn.style.color = '';
        sortBtn.innerHTML = 'Ordenar por Prioridad';
        alert('Orden desactivado');
    }
    
    renderTasks();
};

// Filtros
document.getElementById('filterAll').onclick = () => {
    currentFilter = 'all';
    renderTasks();
};
document.getElementById('filterPending').onclick = () => {
    currentFilter = 'pending';
    renderTasks();
};
document.getElementById('filterCompleted').onclick = () => {
    currentFilter = 'completed';
    renderTasks();
};

// Inicializar
renderTasks();

// Hacer funciones globales
window.toggleStatus = toggleStatus;
window.editTask = editTask;
window.deleteTask = deleteTask;