<template>
    <!-- 当有任务被拖放到该列时触发 onDrop 方法 -->
    <div
        class="column"
        @dragover.prevent
        @drop="onDrop" 
    >
        <h3>{{ title }}</h3>
        <TransitionGroup 
            name="task-list"
            tag="div"
            class="task-list"
        >
        <!-- name="task-list" 动画类名前缀，Vue 会根据元素的状态自动添加对应的类名来触发动画
        tag="div" TransitionGroup本身不是真实的HTML标签，将其渲染为一个div元素
        class="task-list" 给这个div添加的CSS样式 -->
            <!-- :task="task"将任务对象作为 prop 传递给 TaskCard 组件 -->
            <TaskCard
                v-for="task in sortedList"
                :key="task.id"
                :task="task" 
                @delete="onDeleteTask"
                @drag-start="onDragStartTask"
                @update-task="onUpdateTask"
            />
            <!-- @delete="onDeleteTask" 监听自组件发出对应的事件，并触发对应的函数 -->
        </TransitionGroup>
    </div>

</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, UpdateTaskPayload, DragStartPayload, DropPayload } from '../types'

// ===== Props 定义 =====
// 接收父组件传来的 columnId title 和该列的任务列表
const props = defineProps<{
  columnId: string
  title: string
  list: Task[]
}>()

// ===== Emits 定义 =====
// 定义可以向父组件发送的事件
const emit = defineEmits<{
  'drop-task': [payload: DropPayload]
  'delete-task': [taskId: string | number]
  'drag-start-task': [payload: DragStartPayload]
  'update-task': [payload: UpdateTaskPayload]
}>()

// ===== 优先级权重映射 =====
const priorityMap: Record<'high' | 'medium' | 'low', number> = {
  high: 3,
  medium: 2,
  low: 1,
}

// ===== 计算属性 =====
/**
 * 按优先级排序的任务列表
 */
const sortedList: ComputedRef<Task[]> = computed(() => {
  return [...props.list].sort((a, b) => {
    const p1 = priorityMap[a.priority || 'low']
    const p2 = priorityMap[b.priority || 'low']
    return p2 - p1 // 优先级高的排前面
  })
})

// ===== 事件处理器 =====
/**
 * 子组件 TaskCard 告诉要删除任务，继续向上汇报
 */
const onDeleteTask = (taskId: string | number): void => {
  emit('delete-task', taskId)
}

/**
 * 中转更新事件
 */
const onUpdateTask = (payload: UpdateTaskPayload): void => {
  // payload 结构是 { taskId, key, value } 原封不动上传
  emit('update-task', payload)
}

/**
 * 中转拖动开始事件
 */
const onDragStartTask = (payload: DragStartPayload): void => {
  emit('drag-start-task', payload)
}

/**
 * 处理任务放下事件
 */
const onDrop = (event: DragEvent): void => {
  event.preventDefault()
  emit('drop-task', { event, columnId: props.columnId as 'todo' | 'doing' | 'done' })
}
</script>
<style scoped>
/* 每个列的样式 */
.column {
  flex: 1;
  width: 0;
  background-color: #ebecf0;
  border-radius: 8px;
  padding: 15px;
  min-width: 250px;
}
.task-list {
  min-height: 200px;
  position: relative;
}
/* 当列表顺序改变，元素需要移动到新位置时，Vue 会自动添加这个类名 */
.task-list-move {
  transition: transform 0.5s ease;
}
/* 当有新任务加入(enter) 或被删除(leave)时触发 */
.task-list-enter-active, 
.task-list-leave-active {
  transition: all 0.5s ease;
}
/* 刚要进来时，和完全离开时：透明度为0，且稍微向右偏移一点 */
.task-list-enter-from,
.task-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
/* 当一个元素正在“离开”时，让它脱离文档流(absolute)。
   这样，它原来占用的空间会瞬间腾出来，后面的元素就能立刻触发 "move" 动画往上挤。
   如果不加这句，后面的元素会等前面的元素动画彻底播完才动，看起来很卡。
*/
.task-list-leave-active {
  position: absolute;
  width: calc(100% - 30px); /* 因为父容器有 15px 的 padding-left/right */
}

</style>