// Variables globales
let tasks = [];
let currentFilter = 'all';

// Elementos del DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskCount = document.getElementById('taskCount');
const completedCount = document.getElementById('completedCount');
const filterBtns = document.querySelectorAll('.filter-btn');

// Cargar tareas del localStorage al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    updateStats();
});

// Agregar tarea con botón
addTaskBtn.addEventListener('click', addTask);

// Agregar tarea con Enter
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Filtros
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover active de todos
        filterBtns.forEach(b => b.classList.remove('active'));
        // Agregar active al clickeado
        btn.classList.add('active');
        // Cambiar filtro
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Función para agregar tarea
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        // Animación de error
        taskInput.style.borderColor = 'var(--danger-color)';
        setTimeout(() => {
            taskInput.style.borderColor = '';
        }, 500);
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(task); // Agregar al inicio
    taskInput.value = '';
    saveTasks();
    renderTasks();
    updateStats();
    
    // Mostrar notificación si está soportado
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Tarea agregada', {
            body: taskText,
            icon: 'icons/icon-192x192.png'
        });
    }
}

// Función para renderizar tareas
function renderTasks() {
    taskList.innerHTML = '';
    
    // Filtrar tareas
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    // Mostrar empty state si no hay tareas
    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }
    
    // Crear elementos de tareas
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
            >
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="task-delete">Eliminar</button>
        `;
        
        // Event listener para checkbox
        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => {
            toggleTask(task.id);
        });
        
        // Event listener para botón eliminar
        const deleteBtn = li.querySelector('.task-delete');
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });
        
        taskList.appendChild(li);
    });
}

// Función para alternar completado
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Función para eliminar tarea
function deleteTask(id) {
    // Animación antes de eliminar
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    if (taskElement) {
        taskElement.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
            updateStats();
        }, 300);
    }
}

// Función para actualizar estadísticas
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    taskCount.textContent = `${total} ${total === 1 ? 'tarea' : 'tareas'}`;
    completedCount.textContent = `${completed} ${completed === 1 ? 'completada' : 'completadas'}`;
}

// Función para guardar en localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Función para cargar del localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

// Función para escapar HTML (prevenir XSS)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Agregar animación de salida al CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Pedir permiso para notificaciones (opcional)
if ('Notification' in window && Notification.permission === 'default') {
    setTimeout(() => {
        Notification.requestPermission();
    }, 5000); // Pedir después de 5 segundos
}
