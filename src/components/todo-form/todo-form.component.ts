import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Priority } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html'
})
export class TodoFormComponent {
  private fb = inject(FormBuilder);
  private todoService = inject(TodoService);

  isExpanded = signal(false);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    dueDate: [''],
    priority: ['medium' as Priority],
    comment: ['']
  });

  toggleExpand() {
    this.isExpanded.update(v => !v);
  }

  onSubmit() {
    if (this.form.valid) {
      const { title, dueDate, comment, priority } = this.form.value;
      if (title) {
        this.todoService.addTodo(
          title, 
          dueDate || null, 
          comment || null, 
          (priority as Priority) || 'medium'
        );
        this.form.reset({ priority: 'medium' });
        this.isExpanded.set(false);
      }
    }
  }

  cancel() {
    this.form.reset({ priority: 'medium' });
    this.isExpanded.set(false);
  }
}