// Objeto para armazenar as tarefas de cada dia
const tasksData = {
    segunda: [],
    terca: [],
    quarta: [],
    quinta: [],
    sexta: [],
    sabado: [],
    domingo: []
};

// Mapeamento dos dias para exibição
const dayNames = {
    segunda: 'Segunda-feira',
    terca: 'Terça-feira',
    quarta: 'Quarta-feira',
    quinta: 'Quinta-feira',
    sexta: 'Sexta-feira',
    sabado: 'Sábado',
    domingo: 'Domingo'
};

// Variável para controlar o dia atual selecionado
let currentDay = 'segunda';

// Referências aos elementos HTML
const dayButtons = document.querySelectorAll('.day-btn');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasksList');
const currentDayTitle = document.getElementById('currentDayTitle');
const taskCounter = document.getElementById('taskCounter');
const emptyState = document.getElementById('emptyState');

// Função para inicializar o aplicativo
function initApp() {
    loadTasksFromStorage();
    setupEventListeners();
    displayTasks(currentDay);
    updateDayTitle();
}

// Função para configurar os event listeners
function setupEventListeners() {
    // Event listeners para os botões dos dias
    dayButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectDay(this.dataset.day);
        });
    });

    // Event listener para o botão de adicionar tarefa
    addTaskBtn.addEventListener('click', addTask);

    // Event listener para pressionar Enter no campo de input
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
}

// Função para selecionar um dia
function selectDay(day) {
    // Remove a classe active de todos os botões
    dayButtons.forEach(btn => btn.classList.remove('active'));
    
    // Adiciona a classe active ao botão clicado
    const selectedButton = document.querySelector(`[data-day="${day}"]`);
    selectedButton.classList.add('active');
    
    // Atualiza o dia atual
    currentDay = day;
    
    // Atualiza a exibição
    updateDayTitle();
    displayTasks(day);
}

// Função para atualizar o título do dia
function updateDayTitle() {
    currentDayTitle.textContent = dayNames[currentDay];
}

// Função para adicionar uma nova tarefa
function addTask() {
    const taskText = taskInput.value.trim();
    
    // Verifica se o campo não está vazio
    if (taskText === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }
    
    // Cria o objeto da tarefa
    const task = {
        id: Date.now(), // ID único baseado no timestamp
        text: taskText,
        completed: false
    };
    
    // Adiciona a tarefa ao array do dia atual
    tasksData[currentDay].push(task);
    
    // Limpa o campo de input
    taskInput.value = '';
    
    // Atualiza a exibição
    displayTasks(currentDay);
    
    // Salva no localStorage
    saveTasksToStorage();
}

// Função para exibir as tarefas do dia selecionado
function displayTasks(day) {
    const tasks = tasksData[day];
    
    // Limpa a lista atual
    tasksList.innerHTML = '';
    
    // Verifica se há tarefas
    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        updateTaskCounter(0);
        return;
    }
    
    // Esconde o estado vazio
    emptyState.style.display = 'none';
    
    // Cria os elementos HTML para cada tarefa
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksList.appendChild(taskElement);
    });
    
    // Atualiza o contador
    updateTaskCounter(tasks.length);
}

// Função para criar o elemento HTML de uma tarefa
function createTaskElement(task) {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    taskItem.innerHTML = `
        <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})"></div>
        <span class="task-text">${task.text}</span>
        <button class="task-delete" onclick="deleteTask(${task.id})">🗑️ Remover</button>
    `;
    
    return taskItem;
}

// Função para marcar/desmarcar uma tarefa como concluída
function toggleTask(taskId) {
    const tasks = tasksData[currentDay];
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        task.completed = !task.completed;
        displayTasks(currentDay);
        saveTasksToStorage();
    }
}

// Função para remover uma tarefa
function deleteTask(taskId) {
    const tasks = tasksData[currentDay];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        // Confirma a remoção
        if (confirm('Tem certeza que deseja remover esta tarefa?')) {
            tasks.splice(taskIndex, 1);
            displayTasks(currentDay);
            saveTasksToStorage();
        }
    }
}

// Função para atualizar o contador de tarefas
function updateTaskCounter(count) {
    const completedTasks = tasksData[currentDay].filter(task => task.completed).length;
    
    if (count === 0) {
        taskCounter.textContent = '0 tarefas';
    } else if (count === 1) {
        taskCounter.textContent = `1 tarefa (${completedTasks} concluída${completedTasks !== 1 ? 's' : ''})`;
    } else {
        taskCounter.textContent = `${count} tarefas (${completedTasks} concluída${completedTasks !== 1 ? 's' : ''})`;
    }
}

// Função para salvar as tarefas no localStorage
function saveTasksToStorage() {
    try {
        localStorage.setItem('plannerTasks', JSON.stringify(tasksData));
    } catch (error) {
        console.log('Erro ao salvar no localStorage:', error);
    }
}

// Função para carregar as tarefas do localStorage
function loadTasksFromStorage() {
    try {
        const savedTasks = localStorage.getItem('plannerTasks');
        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks);
            // Mescla os dados salvos com a estrutura padrão
            Object.keys(tasksData).forEach(day => {
                if (parsedTasks[day]) {
                    tasksData[day] = parsedTasks[day];
                }
            });
        }
    } catch (error) {
        console.log('Erro ao carregar do localStorage:', error);
    }
}

// Inicializa o aplicativo quando a página carrega
document.addEventListener('DOMContentLoaded', initApp);
