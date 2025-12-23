export interface TodoComment {
  id: string;
  text: string;
  createdAt: number;
}

export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null; // ISO Date string YYYY-MM-DD
  priority: Priority;
  comments: TodoComment[];
  createdAt: number;
}

export type FilterType = 'all' | 'active' | 'completed';