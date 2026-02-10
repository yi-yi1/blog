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

<script setup>
import { ref,watch,onMounted } from 'vue';
import KanbanColumn from './kanbanColumn.vue';

// 三列基础数据
const columns = [
    { id: 'todo', title: '待处理 (To Do)' },
    { id: 'doing', title: '进行中 (Doing)' },
    { id: 'done', title: '已完成 (Done)' }
];
// 定义任务列表的数据 (使用 ref 包裹，使其具有响应式)
// 每个任务有一个唯一的 id，内容 content，以及它当前所处的状态 status
/**
 const tasks = ref([
    { id: 1, content: '学习 npm 安装', status: 'done' },
    { id: 2, content: '初始化vue项目', status: 'doing' },
    { id: 3, content: '实现看板拖拽功能', status: 'todo' }
])
 */
//tasks初始为空，等待从localStorage加载数据
const tasks = ref([])
// 新建任务
const newTaskContent = ref('');
const newTaskPriority = ref('low');
// 组件挂载时，从 localStorage 加载任务数据
onMounted(()=>{
    const saved = localStorage.getItem('kanban-tasks')
    if (saved) {
        tasks.value = JSON.parse(saved)
    }else{
        // 如果没有保存的数据，可以初始化一些默认任务
        tasks.value = [
            { id: 1, content: '学习 npm 安装', status: 'done' },
            { id: 2, content: '初始化vue项目', status: 'doing' },
            { id: 3, content: '实现看板拖拽功能', status: 'todo' }
        ]
    }
})

// 监听 tasks 的变化，并将最新的任务列表保存到 localStorage
watch(tasks, (newVal) =>{
    localStorage.setItem('kanban-tasks',JSON.stringify(newVal))
},{ deep: true } // 深度监听，因为tasks是一个数组
)

// 根据传入列ID(status)过滤出该列的任务列表
const getTasksByStatus = (status) => {
    return tasks.value.filter(tasks => tasks.status === status);
}

const addTask = () => {
    // 如果输入为空，直接返回
    if (!newTaskContent.value.trim()) return;
    tasks.value.push({
        id: Date.now(), // 使用当前时间戳作为唯一id
        content: newTaskContent.value, // 任务内容来自输入框
        status: 'todo', // 新任务默认状态为待处理
        priority: newTaskPriority.value // 新任务的优先级来自下拉框
    })
    newTaskContent.value = ''; // 添加任务后清空输入框
}

//删除任务
const handleDeleteTask = (taskId) => {
    const isConfirmed = confirm('确定要删除该任务吗？');
    if (isConfirmed) {
        tasks.value = tasks.value.filter(t => t.id !== taskId);
    }
}

// === 拖拽逻辑===
// 开始拖动任务时触发的事件处理函数
const handleDragStart = ({event, task}) => {
    // 将拖拽任务的id记录在浏览器的dataTransfer对象中，以便在拖放结束时能够识别出被拖动的任务
    event.dataTransfer.setData('taskId', task.id);
    event.dataTransfer.effectAllowed = 'move'; // 设置拖动效果为移动
}
// 放下时触发的事件处理函数
const handleDrop = ({event, columnId}) => {
    // 获取被拖动任务的id
    const taskId = event.dataTransfer.getData('taskId');
    // 根据任务id找到对应的任务对象
    const taskToMove = tasks.value.find(task => task.id === Number(taskId));

    // 如果找到任务，就将状态改为目标列的id
    if (taskToMove) {
        taskToMove.status = columnId;
    }
}

// 处理 内容/优先级 更新
const handleUpdateTask = ({taskId, key, value}) => {
    const task = tasks.value.find(t => t.id === taskId);
    if (task) {
        task[key] = value;
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