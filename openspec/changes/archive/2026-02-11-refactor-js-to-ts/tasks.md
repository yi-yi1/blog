## 1. 环境准备与 TypeScript 配置

- [x] 1.1 安装 TypeScript 核心依赖（typescript、@vue/tsconfig、@types/node、@types/vite）
- [x] 1.2 更新 Vue 和相关库到最新版本（支持 TypeScript）
- [x] 1.3 创建 tsconfig.json 配置文件，启用严格模式（strict: true）
- [x] 1.4 验证 tsconfig.json 配置正确性
- [x] 1.5 将 vite.config.js 迁移为 vite.config.ts
- [x] 1.6 验证 Vite 构建配置能识别 TypeScript 文件
- [x] 1.7 安装 ESLint + @typescript-eslint/eslint-plugin 和 @typescript-eslint/parser
- [x] 1.8 创建 .eslintrc.cjs 配置文件，支持 TypeScript 检查
- [x] 1.9 配置 Prettier 格式化工具
- [x] 1.10 安装 husky 和 lint-staged 用于预提交 hook
- [x] 1.11 创建 .husky/pre-commit 钩子配置
- [x] 1.12 在 package.json 中添加脚本命令（type-check、lint、lint:fix）
- [x] 1.13 创建 .vscode 目录和 settings.json 配置
- [x] 1.14 在 .vscode/extensions.json 中推荐 Volar 和 ESLint 扩展
- [ ] 1.15 运行 npm run type-check 验证无编译错误
- [ ] 1.16 运行 npm run dev 验证开发服务器启动正常
- [ ] 1.17 运行 npm run build 验证生产构建成功

## 2. 核心文件迁移

- [x] 2.1 创建 src/types 目录
- [x] 2.2 在 src/types/index.ts 中定义全局类型和接口
- [x] 2.3 迁移 src/main.js → src/main.ts，完整定义应用初始化类型
- [x] 2.4 为 main.ts 中的所有消费者（插件、组件等）添加类型注解
- [ ] 2.5 运行 npm run type-check 验证 main.ts 无错误
- [ ] 2.6 运行 npm run lint 验证代码规范
- [ ] 2.7 测试 `npm run dev` 确保应用仍正常启动
- [ ] 2.8 手动测试应用基本功能

## 3. Vue 组件迁移与类型定义

- [x] 3.1 创建 src/types/components.ts 定义所有组件中使用的公共类型和接口
- [x] 3.2 定义 Vue 组件的 Props、Emits、Slots 类型规范文档
- [x] 3.3 迁移 src/components/TaskCard.vue（最独立的组件）
  - [x] 3.3.1 将 `<script>` 改为 `<script setup lang="ts">`
  - [x] 3.3.2 定义 Props 接口（如 title, description, priority 等）
  - [x] 3.3.3 定义 Emits 类型（如 delete、edit 等）
  - [x] 3.3.4 为所有响应式数据添加类型注解（ref<T>、reactive<T>）
  - [x] 3.3.5 为方法添加参数和返回值类型
  - [x] 3.3.6 修复 dataTransfer 类型处理
  - [ ] 3.3.7 运行 type-check 和 lint 验证
  - [ ] 3.3.8 手动测试 TaskCard 组件功能

- [x] 3.4 迁移 src/components/kanbanColumn.vue
  - [x] 3.4.1 将 `<script>` 改为 `<script setup lang="ts">`
  - [x] 3.4.2 定义 Props 接口（如 column 数据结构等）
  - [x] 3.4.3 定义 Emits 类型（如 taskMove、taskUpdate 等）
  - [x] 3.4.4 为响应式数据和方法添加完整类型注解
  - [x] 3.4.5 修复 DropPayload 类型一致性和 drop 事件处理
  - [ ] 3.4.6 运行 type-check 和 lint 验证
  - [ ] 3.4.7 手动测试 kanbanColumn 组件功能

- [x] 3.5 迁移 src/components/KanbanBoard.vue
  - [x] 3.5.1 将 `<script>` 改为 `<script setup lang="ts">`
  - [x] 3.5.2 定义 Props 和 Emits 接口
  - [x] 3.5.3 为响应式数据、计算属性、方法添加完整类型注解
  - [x] 3.5.4 修复 drag/drop 事件处理中的类型问题
  - [ ] 3.5.5 运行 type-check 和 lint 验证
  - [ ] 3.5.6 手动测试 KanbanBoard 组件功能

- [x] 3.6 迁移 src/App.vue
  - [x] 3.6.1 将 `<script>` 改为 `<script setup lang="ts">`
  - [x] 3.6.2 为所有状态和方法添加类型注解
  - [ ] 3.6.3 运行 type-check 和 lint 验证
  - [ ] 3.6.4 手动测试应用整体功能

## 4. 编译和类型检查集成

- [x] 4.1 修复 TaskCard.vue 中的 DragEvent 类型处理
- [x] 4.2 修复 kanbanColumn.vue 中的 Task 类型定义不一致
- [x] 4.3 修复 KanbanBoard.vue 中的类型转换问题
- [x] 4.4 创建统一的类型定义文件 (src/types/index.ts)
- [x] 4.5 更新所有组件使用统一的类型定义
- [x] 4.6 修复 tsconfig.json 的 types 配置
- [ ] 4.7 运行 npm run type-check 验证无编译错误
- [ ] 4.8 验证 IDE 中的类型提示正确显示
- [ ] 4.9 运行 npm run build 验证生产构建成功

## 5. ESLint 和代码规范

- [ ] 5.1 针对所有 .ts 和 .vue 文件运行 `npm run lint`
- [ ] 5.2 使用 `npm run lint:fix` 自动修复可修复的问题
- [ ] 5.3 手动解决无法自动修复的规范问题
- [ ] 5.4 配置 `.eslintignore` 排除必要的文件（如 node_modules、dist）
- [ ] 5.5 在本地验证 pre-commit hook 会拦截不符合规范的代码
- [ ] 5.6 测试 husky + lint-staged 的自动修复流程

## 6. 处理第三方库类型

- [ ] 6.1 检查项目依赖中哪些库缺少 TypeScript 类型定义
- [ ] 6.2 为有 @types 包的库安装对应的类型定义包
- [ ] 6.3 对于无类型定义的库，在 tsconfig.json 中配置 skipLibCheck 或创建 .d.ts 文件
- [ ] 6.4 为常用的无类型库在 src/types/ 中创建类型声明文件
- [ ] 6.5 验证所有第三方库的使用都具有基本的类型支持

## 7. 测试与验证

- [ ] 7.1 运行应用的所有手动测试场景（如拖拽、新增任务、删除任务等）
- [ ] 7.2 对比迁移前后的应用功能，确保无回归问题
- [ ] 7.3 检查浏览器控制台是否有错误或警告
- [ ] 7.4 验证开发模式下的 HMR（热更新）功能正常
- [ ] 7.5 验证生产构建的产物大小和加载性能
- [ ] 7.6 如存在单元测试，运行并确保全部通过

## 8. 性能优化和基准测试

- [ ] 8.1 测量迁移前的构建时间（npm run build）
- [ ] 8.2 测量迁移后的构建时间，对比是否有显著增加
- [ ] 8.3 如构建时间增加显著，分析瓶颈并优化（如启用增量编译）
- [ ] 8.4 测量开发模式下的启动时间和 HMR 响应时间
- [ ] 8.5 对比迁移前后的生产版本包大小
- [ ] 8.6 测量应用的运行时性能（如首屏加载时间）

## 9. 文档和最终验证

- [ ] 9.1 更新项目 README，添加 TypeScript 相关说明
- [ ] 9.2 在 README 中记录 TypeScript 配置和最佳实践
- [ ] 9.3 创建或更新 CONTRIBUTING.md，说明开发中的类型检查规范
- [ ] 9.4 记录迁移过程中遇到的特殊问题和解决方案
- [ ] 9.5 为团队添加 TypeScript 最佳实践文档
- [ ] 9.6 进行最终的全量类型检查和 lint 检查
- [ ] 9.7 在主分支上进行最后一次完整功能测试
- [ ] 9.8 全量测试通过后，合并到主分支
- [ ] 9.9 删除或存档 js-backup 分支（如不需要）
- [ ] 9.10 在团队中分享迁移成果和学习总结
