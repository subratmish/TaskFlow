import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Todo, Priority } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  templateUrl: './todo-item.component.html'
})
export class TodoItemComponent {
  readonly todo = input.required<Todo>();
  readonly toggle = output<string>();
  readonly delete = output<string>();
  readonly update = output<{id: string, changes: {title: string, dueDate: string | null, priority: Priority}}>();
  readonly addComment = output<{id: string, text: string}>();

  isEditing = signal(false);
  isExpanded = signal(false);
  
  // Edit Form
  editTitle = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  editDate = new FormControl<string | null>(null);
  editPriority = new FormControl<Priority>('medium', { nonNullable: true });

  // New Comment Form
  newCommentControl = new FormControl('', { nonNullable: true });

  constructor() {
    // Reset edit form when entering edit mode
    effect(() => {
      if (this.isEditing()) {
        const t = this.todo();
        this.editTitle.setValue(t.title);
        this.editDate.setValue(t.dueDate);
        this.editPriority.setValue(t.priority);
      }
    });
  }

  toggleExpand() {
    if (!this.isEditing()) {
      this.isExpanded.update(v => !v);
    }
  }

  startEditing(event: Event) {
    event.stopPropagation();
    this.isEditing.set(true);
    // Expand when editing so we can see what's happening
    this.isExpanded.set(true); 
  }

  cancelEditing() {
    this.isEditing.set(false);
  }

  saveEdit() {
    if (this.editTitle.valid) {
      this.update.emit({
        id: this.todo().id,
        changes: {
          title: this.editTitle.value,
          dueDate: this.editDate.value || null,
          priority: this.editPriority.value
        }
      });
      this.isEditing.set(false);
    }
  }

  submitComment() {
    const text = this.newCommentControl.value.trim();
    if (text) {
      this.addComment.emit({
        id: this.todo().id,
        text
      });
      this.newCommentControl.reset();
    }
  }

  onDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.todo().id);
  }

  onToggle(event: Event) {
    event.stopPropagation();
    this.toggle.emit(this.todo().id);
  }

  isOverdue(dateStr: string | null): boolean {
    if (!dateStr) return false;
    const due = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  }
}