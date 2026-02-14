// 全局类型定义文件

/**
 * 任务类型定义 - 完整的任务对象
 */
export interface Task {
  id: string | number
  content: string
  status: 'todo' | 'doing' | 'done'
  priority?: 'low' | 'medium' | 'high'
  createdAt?: Date
  updatedAt?: Date
}

export interface Column {
  id: string
  title: string
  tasks: Task[]
  color?: string
}

export interface Board {
  id: string
  title: string
  columns: Column[]
  createdAt?: Date
  updatedAt?: Date
}

// 组件 Props 通用类型
export type Writeable<T> = { -readonly [P in keyof T]: T[P] }

// 事件类型
export interface DragStartEvent {
  taskId: string | number
  sourceColumnId: string
}

export interface DragEndEvent {
  taskId: string | number
  sourceColumnId: string
  targetColumnId: string
}

/**
 * 拖拽相关的 Payload 类型
 */
export interface DragStartPayload {
  event: DragEvent
  task: Task
}

export interface DropPayload {
  event: DragEvent
  columnId: 'todo' | 'doing' | 'done'
}

/**
 * 更新任务的 Payload 类型
 */
export interface UpdateTaskPayload {
  taskId: string | number
  key: string
  value: unknown
}
