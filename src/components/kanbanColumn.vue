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
<script setup>
import { computed } from 'vue'
import TaskCard from './TaskCard.vue'
// 接收父组件传来的 colunmId title 和该列的任务列表
const props = defineProps({
    columnId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    list: {
        type: Array,
        required: true
    }
})
// 定义可以向父组件发送的事件
const emit = defineEmits(['drop-task', 'delete-task', 'drag-start-task','update-task'])
// 优先级权重
const priorityMap = {
    high: 3,
    medium: 2,
    low: 1
}
// 排序后的列表
const sortedList = computed(() => {
    return [...props.list].sort((a,b) => {
        const p1 = priorityMap[a.priority || 'low']
        const p2 = priorityMap[b.priority || 'low']
        return p2 - p1 // 优先级高的排前面
    })
})
// 子组件TaskCard告诉要删除任务，继续向上汇报
const onDeleteTask = (taskId) => {
    emit('delete-task', taskId)
}
// 中转更新事件
const onUpdateTask = (payload) => {
    // payload 结构是 { taskId:  newContent:  } 原封不动上传
    emit('update-task', payload)
}
const onDragStartTask = (payload) => {
  emit('drag-start-task', payload)
}

const onDrop = (event) => {
    emit('drop-task', { event, columnId: props.columnId })
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