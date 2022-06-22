import { TodoModel } from "./TodoModel.js";

class TodoView {
  constructor(TodoModel) {
    this.model = TodoModel;
    this.focusValue = "";
    this.addEvent();
    this.showTodos(this.model.todos);
  }

  eventHandler(event) {
    const action = event.target.dataset.action;
    if (action) this[action](event);
  }

  addEvent() {
    this.$("#todoPage").addEventListener("click", this.eventHandler.bind(this));
    this.$("#middleTodo").addEventListener(
      "click",
      this.scrollUpAndDown.bind(this)
    );
    window.addEventListener("scroll", this.addScrollEvent.bind(this));
  }

  addScrollEvent() {
    const scrolled = window.scrollY;

    if (scrolled >= 600) {
      this.$("#middleTodo").classList.add("up");
      this.$("#middleTodo").innerHTML = "👆 Timer";
    } else if (scrolled < 600) {
      this.$("#middleTodo").classList.remove("up");
      this.$("#middleTodo").innerHTML = "👇 Todo List";
    }
  }

  $(selector) {
    return document.querySelector(selector);
  }

  addTodo(e) {
    let addValue = this.$(".inputTodo").value;
    e.preventDefault();
    if (!addValue.trim()) {
      return;
    }
    this.model.addTodoModel(addValue);
    this.showTodos(this.model.todos);
    this.$(".inputTodo").value = "";
  }

  finishTodo(e) {
    const todoId = parseInt(e.target.parentElement.id);
    this.model.finishTodoModel(todoId);
    const isFocus = this.model.findTodoElementModel(todoId, "focus");
    isFocus ? this.model.focusTodoModel(todoId) : null;
    this.checkSameFocusValue(e);
    this.showTodos(this.model.todos);
  }

  deleteTodo(e) {
    const todoId = parseInt(e.target.parentElement.id);
    this.model.deleteTodoModel(todoId);
    this.checkSameFocusValue(e);
    this.showTodos(this.model.todos);
  }

  focusTodo(e) {
    if (e.target.closest("#todoListFinished")) return;
    let todoText = e.target.parentNode.querySelector(".todoText").innerHTML;
    this.focusValue = todoText;
    const todoId = parseInt(e.target.parentNode.id);
    this.model.focusTodoModel(todoId);
    this.showTodos(this.model.todos);
  }

  showTodos(todos) {
    this.model.setLocalStorage(todos);
    todos = this.model.getLocalStorage();
    this.$("#todoList").textContent = "";
    this.$("#todoListFinished").textContent = "";
    this.findJustOneFinish(todos);
    this.$(".rod").text;
    this.$("#focus").innerHTML = this.focusValue;

    todos.forEach((todo) => {
      this.renderingTodo(todo);
    });
  }

  renderingTodo(todo) {
    let listHtml = `<li id="${todo.id}">`;
    listHtml += todo.focus ? `<div class="isFocusing"></div>` : `<div ></div>`;
    listHtml += `<div data-action="finishTodo"></div>
                  <div data-action="focusTodo" class="todoText">${todo.text}</div>
                  <div data-action="deleteTodo"></div>
                  </li>`;

    if (todo.finish) {
      this.$("#todoListFinished").insertAdjacentHTML("beforeend", listHtml);
      return;
    }
    this.$("#todoList").insertAdjacentHTML("afterbegin", listHtml);
  }

  // todolist와 finishlist 사이의 막대 하나 만들기
  findJustOneFinish(todos) {
    const isFinishJustOne = todos.find((todo) => todo.finish === true);
    let listHtml = `<div class="rod"></div>`;
    this.$("#todoListFinished").insertAdjacentHTML("afterbegin", listHtml);
    if (isFinishJustOne) {
      this.$(".rod").classList.add("hidden");
    }
  }

  checkSameFocusValue(e) {
    if (e.target.parentElement.children[2].innerHTML === this.focusValue) {
      this.focusValue = "";
    }
  }

  scrollUpAndDown(e) {
    if (e.target.classList.contains("up")) {
      this.$("#timerPage").scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
      setTimeout(() => {
        e.target.classList.remove("up");
        e.target.innerHTML = "👇 Todo List";
      }, 10);

      return;
    }

    this.$(".inputTodo").scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
    setTimeout(() => {
      e.target.classList.add("up");
      e.target.innerHTML = "👆 Timer";
    }, 10);
  }
}

export { TodoView, TodoModel };
