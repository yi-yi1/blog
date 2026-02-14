<template>
   <div 
        class="task-card" 
        draggable="true"
        @dragstart="onDragStart"
    >
        <div v-if="isEditing" class="edit-area">
            <input
                ref="inputRef"
                v-model="editingContent"
                @blur="saveEdit"
                @keyup.enter="saveEdit"
                @keyup.esc="cancelEdit"
                type="text"
            />
        </div>
        <div v-else class="view-area">
            <div
                class="priority-tag"
                :class="priorityClass"
                @click.stop="togglePriority"
                title="切换优先级"
            >
                {{ priorityLabel }}
             </div>
             <!-- 优先级标签，显示当前优先级，并根据优先级应用不同的样式 -->
             <!-- @click.stop="togglePriority" 点击标签时切换优先级，.stop修饰符阻止事件冒泡，避免触发父元素的事件 -->
            <span class="task-content" @dblclick="startEdit">
                {{ task.content }}</span>
            <button class="delete-btn" @click.stop="onDelete">×</button>
        </div>
        
    </div>

</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { Task, DragStartPayload, UpdateTaskPayload } from '../types'

// ===== Props 定义 =====
// defineProps:接收父组件传来的数据，task 是由父组件传来的一个对象，只负责展示
const props = defineProps<{
  task: Task
}>()

// ===== Emits 定义 =====
// defineEmits:定义可以向父组件发送那些信号
const emit = defineEmits<{
  delete: [taskId: string | number]
  'drag-start': [payload: DragStartPayload]
  'update-task': [payload: UpdateTaskPayload]
}>()

// ===== 计算属性 =====
const priorityLabel: ComputedRef<string> = computed(() => {
  const map: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
  }
  return map[props.task.priority || 'low']
})

const priorityClass: ComputedRef<string> = computed(() => {
  return `priority-${props.task.priority || 'low'}`
})

// ===== 状态管理 =====
const isEditing: Ref<boolean> = ref(false) // 是否处于编辑状态
const editingContent: Ref<string> = ref('') // 编辑框临时内容
const inputRef: Ref<HTMLInputElement | null> = ref(null) // 输入框的引用,对应<input>DOM元素

// ===== 方法 =====
/**
 * 切换任务优先级
 */
const togglePriority = (): void => {
  const current = props.task.priority || 'low'
  let next: 'low' | 'medium' | 'high' = 'low'
  // 循环逻辑: low -> medium -> high -> low
  if (current === 'low') next = 'medium'
  else if (current === 'medium') next = 'high'
  else if (current === 'high') next = 'low'
  emit('update-task', {
    taskId: props.task.id,
    key: 'priority',
    value: next,
  })
}

/**
 * 开始编辑任务
 */
const startEdit = (): void => {
  isEditing.value = true
  editingContent.value = props.task.content // 把现有内容填进输入框
  // 等待输入框挂载到DOM树上，确保输入框已经完成渲染
  nextTick(() => {
    inputRef.value?.focus() // 进入编辑状态后自动聚焦输入框
  })
}

/**
 * 保存编辑结果
 */
const saveEdit = (): void => {
  if (
    !editingContent.value.trim() ||
    editingContent.value === props.task.content
  ) {
    // 如果输入为空或者内容没有变化，直接退出编辑状态
    isEditing.value = false
    return
  }
  emit('update-task', {
    taskId: props.task.id,
    key: 'content',
    value: editingContent.value,
  }) // 向父组件发送更新事件，携带任务id和新内容
  isEditing.value = false // 退出编辑状态
}

/**
 * 取消编辑
 */
const cancelEdit = (): void => {
  isEditing.value = false
  editingContent.value = props.task.content // 重置输入框内容为原内容
}

/**
 * 点击删除任务
 */
const onDelete = (): void => {
  // 向父组件发送delete事件，并携带任务id作为参数
  emit('delete', props.task.id)
}

/**
 * 开始拖动任务时
 */
const onDragStart = (event: DragEvent): void => {
  // 向外发送drag-start 事件，把原生的 event 和我的 task 传出去
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
  emit('drag-start', { event, task: props.task })
}
</script>

<style scoped>
/* 任务卡片 */
.task-card {
  background-color: white;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  cursor: grab;
}
.task-card:active {
  cursor: grabbing;
}

/* 查看模式的布局 */
.view-area {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px; /* 让标签、文字、按钮之间有点间距 */
}

/* 编辑模式的布局 */
.edit-area {
  width: 100%;
}

/* 编辑框样式优化 */
.edit-area input {
  width: 100%;
  padding: 5px;
  border: 1px solid #42b983; /* 激活时显示绿色边框 */
  border-radius: 4px;
  box-sizing: border-box; /* 防止 padding 把框撑破 */
  outline: none;
}

.task-content {
  flex: 1; /* 让文字占据中间剩余空间 */
  word-break: break-all;
  cursor: text; /* 提示可编辑 */
}
.delete-btn {
  background: transparent;
  border: none;
  color: #999;
  font-size: 20px;
  cursor: pointer;
}
.delete-btn:hover { color: #ff4d4f; }
.priority-tag {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer; /* 提示可点击 */
  user-select: none; /* 防止双击时不小心选中文字 */
  min-width: 14px;
  text-align: center;
}
/* 针对不同优先级的配色 */
.priority-low {
  background-color: #8c8c8c; /* 灰色 */
}
.priority-medium {
  background-color: #faad14; /* 橙黄色 */
}
.priority-high {
  background-color: #ff4d4f; /* 红色 */
}
</style>