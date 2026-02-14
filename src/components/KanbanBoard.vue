<template>
    <div class="kanban-board">

        <div class="create-task-bar">
            <input 
                type="text" 
                v-model="newTaskContent" 
                placeholder="请输入新任务内容" 
                @keyup.enter="addTask" 
            />
            <select v-model="newTaskPriority">
                <option value="low">低优先级</option>
                <option value="medium">中优先级</option>
                <option value="high">高优先级</option>
            </select>
            <button @click="addTask">添加任务</button>
        </div>

        <div class="board-columns">
            <KanbanColumn
                v-for="col in columns"
                :key="col.id"
                :column-id="col.id"
                :title="col.title"
                :list="getTasksByStatus(col.id)"
                @delete-task="handleDeleteTask"
                @drag-start-task="handleDragStart"
                @drop-task="handleDrop"
                @update-task="handleUpdateTask"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Ref } from 'vue'
import KanbanColumn from './kanbanColumn.vue'
import type { Task, UpdateTaskPayload, DragStartPayload, DropPayload } from '../types'

// ===== 列定义 =====
interface Column {
  id: 'todo' | 'doing' | 'done'
  title: string
}

const columns: Column[] = [
  { id: 'todo', title: '待处理 (To Do)' },
  { id: 'doing', title: '进行中 (Doing)' },
  { id: 'done', title: '已完成 (Done)' },
]

// ===== 任务数据 =====
// 定义任务列表的数据 (使用 ref 包裹，使其具有响应式)
// 每个任务有一个唯一的 id，内容 content，以及它当前所处的状态 status
const tasks: Ref<Task[]> = ref([])

// ===== 新建任务相关状态 =====
const newTaskContent: Ref<string> = ref('')
const newTaskPriority: Ref<'low' | 'medium' | 'high'> = ref('low')

// ===== 生命周期 =====
/**
 * 组件挂载时，从 localStorage 加载任务数据
 */
onMounted((): void => {
  const saved = localStorage.getItem('kanban-tasks')
  if (saved) {
    try {
      tasks.value = JSON.parse(saved) as Task[]
    } catch (error) {
      console.error('Failed to parse saved tasks:', error)
      initializeDefaultTasks()
    }
  } else {
    initializeDefaultTasks()
  }
})

/**
 * 初始化默认任务
 */
const initializeDefaultTasks = (): void => {
  tasks.value = [
    { id: 1, content: '学习 npm 安装', status: 'done' },
    { id: 2, content: '初始化vue项目', status: 'doing', priority: 'medium' },
    { id: 3, content: '实现看板拖拽功能', status: 'todo', priority: 'high' },
  ]
}

// ===== 监听器 =====
/**
 * 监听 tasks 的变化，并将最新的任务列表保存到 localStorage
 */
watch(
  tasks,
  (newVal): void => {
    localStorage.setItem('kanban-tasks', JSON.stringify(newVal))
  },
  { deep: true } // 深度监听，因为 tasks 是一个数组
)

// ===== 方法 =====
/**
 * 根据传入列 ID (status) 过滤出该列的任务列表
 */
const getTasksByStatus = (status: 'todo' | 'doing' | 'done'): Task[] => {
  return tasks.value.filter(task => task.status === status)
}

/**
 * 添加新任务
 */
const addTask = (): void => {
  // 如果输入为空，直接返回
  if (!newTaskContent.value.trim()) return

  tasks.value.push({
    id: Date.now(), // 使用当前时间戳作为唯一 id
    content: newTaskContent.value, // 任务内容来自输入框
    status: 'todo', // 新任务默认状态为待处理
    priority: newTaskPriority.value, // 新任务的优先级来自下拉框
  })

  newTaskContent.value = '' // 添加任务后清空输入框
}

/**
 * 删除任务
 */
const handleDeleteTask = (taskId: string | number): void => {
  const isConfirmed = confirm('确定要删除该任务吗？')
  if (isConfirmed) {
    tasks.value = tasks.value.filter(t => t.id !== taskId)
  }
}

/**
 * 处理拖动开始事件
 */
const handleDragStart = ({ event, task }: DragStartPayload): void => {
  // 将拖拽任务的 id 记录在浏览器的 dataTransfer 对象中
  // 以便在拖放结束时能够识别出被拖动的任务
  const dt = event.dataTransfer
  if (dt) {
    dt.setData('taskId', String(task.id))
    dt.effectAllowed = 'move' // 设置拖动效果为移动
  }
}

/**
 * 处理放下事件
 */
const handleDrop = ({ event, columnId }: DropPayload): void => {
  event.preventDefault()
  const dt = event.dataTransfer
  if (!dt) return

  const taskIdStr = dt.getData('taskId')
  if (!taskIdStr) return

  // 获取被拖动任务的 id
  const taskId = Number.isNaN(Number(taskIdStr)) ? taskIdStr : Number(taskIdStr)

  // 根据任务 id 找到对应的任务对象
  const taskToMove = tasks.value.find(task => task.id === taskId)

  // 如果找到任务，就将状态改为目标列的 id
  if (taskToMove) {
    taskToMove.status = columnId
  }
}

/**
 * 处理任务内容/优先级更新
 */
const handleUpdateTask = ({ taskId, key, value }: UpdateTaskPayload): void => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    ;(task as unknown as Record<string, unknown>)[key] = value
  }
}
</script>
<style scoped>
/* 使用 Flexbox 布局让三个列水平排列 */
.kanban-board {
  padding: 20px;
  background-color: #f5f7f9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.create-task-bar {
  display: flex;
  gap: 10px;
}
.create-task-bar input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}
.create-task-bar select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
  cursor: pointer;
}
.create-task-bar button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.board-columns {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
</style>