import { TimerView, TimerModel } from "./TimerView.js";
import { TodoView, TodoModel } from "./TodoList/TodoView.js";

// 뽀모도로타이머 : 25, 5
const TimerApp = new TimerView(new TimerModel(), new TodoView(new TodoModel()));
