const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
const messageContainer = document.getElementById('message-container');
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
let filter = '';

showTodos();

function getTodoHtml(todo, index) {
  if (filter && filter != todo.status) {
    return '';
  }
  let checked = todo.status == "completed" ? "checked" : "";
  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <input type="text" class="edit-input" data-index="${index}" style="display:none;" value="${todo.name}">
      <button class="edit-btn" data-index="${index}" onclick="edit(this)"><i class='bx bxs-edit'></i></button>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class='bx bxs-folder-minus'></i></button>
    </li>`;
}

function showTodos() {
  if (todosJson.length == 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
    messageContainer.style.display = 'block';
    messageContainer.textContent = 'No Tasks';
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
    messageContainer.style.display = 'none';
  }
  applyFilter();
}

addButton.addEventListener("click", () => {
  let userTodo = input.value.trim();
  if (userTodo.length == 0) {
    input.value = '';
    return;
  }

  let todo = {
    name: userTodo,
    status: "pending"
  };

  todosJson.push(todo);
  input.value = "";
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});

function applyFilter() {
  let filteredTodos = todosJson.filter(todo => filter === '' || todo.status === filter);
  
  if (filteredTodos.length === 0) {
    messageContainer.style.display = 'block';
    if (filter === 'completed') {
      messageContainer.textContent = 'No complete tasks';
    } else if (filter === 'pending') {
      messageContainer.textContent = 'No incomplete tasks';
      completeButton.textContent = `Complete Tasks (${completeTasks.length})`;
      incompleteButton.textContent = `InComplete Tasks (${completeTasks.length})`;
    } else {
      messageContainer.textContent = 'No Tasks';
    }
  } else {
    messageContainer.style.display = 'none';
  }
}

deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});

filters.forEach(f => {
  f.addEventListener('click', () => {
    filters.forEach(f => f.classList.remove('active'));
    f.classList.add('active');
    filter = f.dataset.filter;
    showTodos();
  });
});

function updateStatus(selectedTodo) {
  let todo = todosJson[selectedTodo.id];
  todo.status = selectedTodo.checked ? "completed" : "pending";
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

function remove(element) {
  let index = element.dataset.index;
  todosJson.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

function edit(element) {
  let index = element.dataset.index;
  let todoItem = document.querySelector(`li.todo:nth-child(${parseInt(index) + 1})`);
  let span = todoItem.querySelector("span");
  let input = todoItem.querySelector(".edit-input");
  let editButton = todoItem.querySelector(".edit-btn");

  if (input.style.display === 'none') {
    span.style.display = 'none';
    input.style.display = 'inline-block'; input.style.padding = '10px 10px'; input.style.fontSize = '15px';
    input.focus();
    editButton.innerHTML = "<i class='bx bxs-save'></i>";
  } else {
    let updatedName = input.value.trim();
    if (updatedName.length > 0) {
      todosJson[index].name = updatedName;
      localStorage.setItem("todos", JSON.stringify(todosJson));
      showTodos();
    } else {
      input.value = todosJson[index].name;
    }
  }
}
