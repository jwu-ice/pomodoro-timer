const TODO_KEY = "todokey";

export class TodoModel {
  constructor() {
    this.todos = this.getLocalStorage();
  }

  addTodoModel(todoText) {
    const todo = {
      id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
      text: todoText.trim(),
      finish: false,
      focus: false,
    };

    this.todos.push(todo);
    console.log(this.todos);
  }

  finishTodoModel(id) {
    this.todos = this.todos.map((todo) =>
      todo.id === id
        ? {
            id: todo.id,
            text: todo.text,
            finish: !todo.finish,
            focus: false,
          }
        : todo
    );
  }

  deleteTodoModel(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  focusTodoModel(id) {
    this.todos = this.todos.map((todo) =>
      todo.id === id
        ? {
            id: todo.id,
            text: todo.text,
            finish: todo.finish,
            focus: true,
          }
        : {
            id: todo.id,
            text: todo.text,
            finish: todo.finish,
            focus: false,
          }
    );
  }

  findTodoElementModel(id, element) {
    if (!this.todos.length) return;
    const findTodo = this.todos.find((todo) => todo.id === id);
    return findTodo[`${element}`];
  }

  setLocalStorage(todos) {
    localStorage.setItem(TODO_KEY, todos.length ? JSON.stringify(todos) : `[]`);
  }

  getLocalStorage() {
    return localStorage.length
      ? JSON.parse(localStorage.getItem(TODO_KEY))
      : [];
  }
}
