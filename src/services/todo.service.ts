import { Injectable, signal, computed, effect } from '@angular/core';
import { Todo, FilterType, TodoComment, Priority } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  readonly todos = signal<Todo[]>([]);
  readonly filter = signal<FilterType>('all');

  private getPriorityScore(p: Priority): number {
    switch (p) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  }

  readonly filteredTodos = computed(() => {
    const currentFilter = this.filter();
    const currentTodos = this.todos();

    // Sort function: Priority desc, then Created desc
    const sortFn = (a: Todo, b: Todo) => {
      const pA = this.getPriorityScore(a.priority);
      const pB = this.getPriorityScore(b.priority);
      if (pA !== pB) return pB - pA;
      return b.createdAt - a.createdAt;
    };

    switch (currentFilter) {
      case 'active':
        return currentTodos.filter(t => !t.completed).sort(sortFn);
      case 'completed':
        // Completed items often just sorted by date, but let's keep consistent
        return currentTodos.filter(t => t.completed).sort((a, b) => b.createdAt - a.createdAt);
      default:
        return [...currentTodos].sort(sortFn);
    }
  });

  readonly stats = computed(() => {
    const all = this.todos();
    const completed = all.filter(t => t.completed).length;
    return {
      total: all.length,
      active: all.length - completed,
      completed
    };
  });

  constructor() {
    this.loadFromStorage();
    
    // Auto-save effect
    effect(() => {
      this.saveToStorage(this.todos());
    });
  }

  addTodo(title: string, dueDate: string | null, initialComment: string | null, priority: Priority = 'medium') {
    const comments: TodoComment[] = [];
    
    if (initialComment) {
      comments.push({
        id: crypto.randomUUID(),
        text: initialComment,
        createdAt: Date.now()
      });
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      dueDate,
      priority,
      comments,
      createdAt: Date.now()
    };
    this.todos.update(items => [newTodo, ...items]);
  }

  updateTodo(id: string, updates: Partial<Pick<Todo, 'title' | 'dueDate' | 'priority'>>) {
    this.todos.update(items => 
      items.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  }

  addComment(id: string, text: string) {
    const newComment: TodoComment = {
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now()
    };
    
    this.todos.update(items => 
      items.map(t => t.id === id ? { ...t, comments: [...t.comments, newComment] } : t)
    );
  }

  toggleTodo(id: string) {
    this.todos.update(items => 
      items.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }

  deleteTodo(id: string) {
    this.todos.update(items => items.filter(t => t.id !== id));
  }

  setFilter(newFilter: FilterType) {
    this.filter.set(newFilter);
  }

  private saveToStorage(todos: Todo[]) {
    try {
      localStorage.setItem('taskflow_todos', JSON.stringify(todos));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('taskflow_todos');
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Data Migration
        const migrated: Todo[] = parsed.map((item: any) => {
          let comments: TodoComment[] = [];
          
          if (Array.isArray(item.comments)) {
            comments = item.comments;
          } else if (item.comment && typeof item.comment === 'string') {
            comments = [{
              id: crypto.randomUUID(),
              text: item.comment,
              createdAt: item.createdAt || Date.now()
            }];
          }

          return {
            ...item,
            comments,
            priority: item.priority || 'medium' // Default priority for existing items
          };
        });

        this.todos.set(migrated);
      }
    } catch (e) {
      console.warn('Failed to load from localStorage', e);
    }
  }
}