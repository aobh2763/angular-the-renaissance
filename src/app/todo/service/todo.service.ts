import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Todo } from '../model/todo';
import { LoggerService } from '../../services/logger.service';


let n = 1;

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos = signal<Todo[]>([]);
  constructor(private loggerService: LoggerService) {}

  /**
   * elle retourne la liste des todos
   *
   * @returns Todo[]
   */
  getTodos(): Signal<Todo[]> {
    return this.todos;
  }

  /**
   *Elle permet d'ajouter un todo
   *
   * @param todo: Todo
   *
   */
  addTodo(todo: Todo): void {
    this.todos.update((currentTodos) => [...currentTodos, todo]);
  }

  /**
   * Delete le todo s'il existe
   *
   * @param todo: Todo
   * @returns boolean
   */
  deleteTodo(todo: Todo): boolean {
    const index = this.todos().indexOf(todo);
    if (index > -1) {
      this.todos.update((currentTodos) =>
        currentTodos.filter((t) => t !== todo),
      );
      return true;
    }
    return false;
  }

  /**
   * Logger la liste des todos
   */
  logTodos() {
    this.loggerService.logger(this.todos);
  }

  getTodosWaiting(): Signal<Todo[]> {
    return computed(() =>
      this.todos().filter((todo) => todo.state === 'waiting'),
    );
  }

  getTodosInProgress(): Signal<Todo[]> {
    return computed(() =>
      this.todos().filter((todo) => todo.state === 'in progress'),
    );
  }

  getTodosDone(): Signal<Todo[]> {
    return computed(() => this.todos().filter((todo) => todo.state === 'done'));
  }

  updateTodoState(todo: Todo, state: Todo['state']): void {
    this.todos.update((todos) =>
      todos.map((t) => (t === todo ? { ...t, state } : t)),
    );
  }
}
