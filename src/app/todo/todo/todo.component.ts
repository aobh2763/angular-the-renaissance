import { Component, Signal } from '@angular/core';
import { Todo } from '../model/todo';
import { TodoService } from '../service/todo.service';
import { TodoState } from '../model/type';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  providers: [TodoService],
})
export class TodoComponent {
  todos: Signal<Todo[]> = this.todoService.getTodos();
  todo = new Todo();
  toodosWaiting: Signal<Todo[]> = this.todoService.getTodosWaiting();
  todosInProgress: Signal<Todo[]> = this.todoService.getTodosInProgress();
  tosdosDone: Signal<Todo[]> = this.todoService.getTodosDone();
  constructor(private todoService: TodoService) {
  }
  addTodo() {
    this.todoService.addTodo(this.todo);
    this.todo = new Todo(); 
  }

  deleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo);
  }

  updateState(todo: Todo, event: Event): void {
    const state = (event.target as HTMLSelectElement).value as TodoState;
    this.todoService.updateTodoState(todo, state);
  }
}