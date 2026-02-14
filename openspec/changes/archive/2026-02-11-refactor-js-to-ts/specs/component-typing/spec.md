## ADDED Requirements

### Requirement: Vue 组件类型定义标准

系统应为所有 Vue 组件提供完整的 TypeScript 类型支持，包括 Props、Emits、Slots 和 ref 的类型声明，确保在编译时捕获类型错误并增强 IDE 代码补全功能。

#### Scenario: 单文件组件 (SFC) 使用 TypeScript

- **WHEN** 编写 `.vue` 文件时
- **THEN** `<script>` 标签应声明 `lang="ts"`，组件应使用 TypeScript 语法编写，例如：`<script setup lang="ts">`

#### Scenario: Props 类型声明

- **WHEN** 组件接受来自父组件的数据时
- **THEN** 应使用 `defineProps` 配合类型指定 Props：
  ```typescript
  interface Props {
    title: string
    count?: number
    items: Array<{id: number, name: string}>
  }
  defineProps<Props>()
  ```

#### Scenario: Emits 类型声明

- **WHEN** 组件向父组件发送事件时
- **THEN** 应使用 `defineEmits` 配合类型指定事件签名：
  ```typescript
  defineEmits<{
    submit: [event: Event]
    change: [value: string]
  }>()
  ```

#### Scenario: Ref 和响应式数据类型

- **WHEN** 在组件中声明响应式数据时
- **THEN** 应显式指定类型，例如：
  ```typescript
  const count = ref<number>(0)
  const items = ref<Array<Item>>([])
  const formData = reactive<FormState>({...})
  ```

#### Scenario: Slots 类型定义

- **WHEN** 组件定义具名插槽时
- **THEN** 应为每个插槽提供完整的作用域类型定义，允许父组件获得类型提示

#### Scenario: 边界情况 - 处理复杂类型

- **WHEN** 组件使用复杂的对象或泛型类型时
- **THEN** 系统应支持：
  - 从 `types/` 目录导入类型定义
  - 使用 `interface` 或 `type` 定义组件的外部 Props 接口
  - 支持泛型组件定义，例如 `<script setup lang="ts" generic="T extends {id: number}">`

### Requirement: 组件属性访问类型安全

系统应确保在组件的 `<template>` 部分，通过 IDE 和编辑器的类型检查，使开发者能够访问安全的属性和方法。

#### Scenario: 模板中的类型推断

- **WHEN** 在 `<template>` 中引用脚本中定义的变量时
- **THEN** IDE 应提供正确的代码补全提示，错误的属性访问应在编辑器中显示红线警告

#### Scenario: 列表渲染类型安全

- **WHEN** 使用 `v-for` 遍历数组时
- **THEN** 循环变量应获得正确的类型推断，例如迭代 `ref<User[]>()` 时，循环变量应推断为 `User` 类型

#### Scenario: 事件处理器类型检查

- **WHEN** 在模板中使用 `@event` 绑定事件处理器时
- **THEN** 事件处理器应接收正确类型的事件对象，TypeScript 应验证参数类型的正确性
