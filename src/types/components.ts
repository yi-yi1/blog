// Vue 组件类型定义文件

import type { Task, Column } from './index'

/**
 * TaskCard 组件的 Props 类型
 */
export interface TaskCardProps {
  task: Task
  columnId: string
}

/**
 * TaskCard 组件的 Emits 类型
 */
export interface TaskCardEmits {
  delete: [taskId: string | number]
  edit: [task: Task]
  dragStart: [event: DragEvent]
}

/**
 * kanbanColumn 组件的 Props 类型
 */
export interface KanbanColumnProps {
  column: Column
  index?: number
}

/**
 * kanbanColumn 组件的 Emits 类型
 */
export interface KanbanColumnEmits {
  taskDelete: [taskId: string | number]
  taskEdit: [task: Task]
  taskDragStart: [taskId: string | number, columnId: string]
  taskDrop: [taskId: string | number, targetColumnId: string]
}

/**
 * KanbanBoard 组件的 Props 类型
 */
export interface KanbanBoardProps {
  initialData?: Column[]
}

/**
 * KanbanBoard 组件的 Emits 类型
 */
export interface KanbanBoardEmits {
  taskAdded: [task: Task]
  taskRemoved: [taskId: string | number]
  taskMoved: [taskId: string | number, fromColumnId: string, toColumnId: string]
}
