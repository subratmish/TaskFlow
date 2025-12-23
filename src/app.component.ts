import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { LoginComponent } from './components/login/login.component';
import { TodoService } from './services/todo.service';
import { AuthService } from './services/auth.service';
import { FilterType, Priority } from './models/todo.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TodoFormComponent, TodoItemComponent, LoginComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  todoService = inject(TodoService);
  authService = inject(AuthService);

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  get todos() {
    return this.todoService.filteredTodos;
  }

  get filter() {
    return this.todoService.filter;
  }

  get stats() {
    return this.todoService.stats;
  }

  setFilter(filter: FilterType) {
    this.todoService.setFilter(filter);
  }

  toggleTodo(id: string) {
    this.todoService.toggleTodo(id);
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id);
  }

  updateTodo(event: {id: string, changes: {title: string, dueDate: string | null, priority: Priority}}) {
    this.todoService.updateTodo(event.id, event.changes);
  }

  addComment(event: {id: string, text: string}) {
    this.todoService.addComment(event.id, event.text);
  }

  logout() {
    this.authService.logout();
  }
}