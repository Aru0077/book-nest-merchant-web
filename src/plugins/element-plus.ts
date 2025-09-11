/**
 * Element Plus组件注册
 * 集中管理Element Plus组件的导入和注册
 */

import type { App } from 'vue'
import { 
  // 基础组件
  ElButton, 
  ElInput, 
  ElForm, 
  ElFormItem, 
  ElCard, 
  ElLink,
  ElRow,
  ElCol,
  ElEmpty,
  
  // 布局组件
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  
  // 导航组件
  ElMenu,
  ElMenuItem,
  ElSubMenu,
  ElTabs,
  ElTabPane,
  
  // 数据展示组件
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElDrawer,
  
  // 图标
  ElIcon,
  
  // 服务
  ElMessage, 
  ElLoading
} from 'element-plus'

// 导入图标
import { 
  House, 
  OfficeBuilding, 
  List, 
  Plus, 
  HomeFilled,
  User,
  Setting,
  SwitchButton,
  Document,
  Expand,
  Fold,
  Menu,
  ArrowDown
} from '@element-plus/icons-vue'

// 导入必需的样式 - 使用完整CSS以确保样式正确
import 'element-plus/dist/index.css'

/**
 * 设置Element Plus组件
 * @param app Vue应用实例
 */
export function setupElementPlus(app: App): void {
  // 注册基础组件
  app.component('ElButton', ElButton)
  app.component('ElInput', ElInput)
  app.component('ElForm', ElForm)
  app.component('ElFormItem', ElFormItem)
  app.component('ElCard', ElCard)
  app.component('ElLink', ElLink)
  app.component('ElRow', ElRow)
  app.component('ElCol', ElCol)
  app.component('ElEmpty', ElEmpty)
  
  // 注册布局组件
  app.component('ElContainer', ElContainer)
  app.component('ElHeader', ElHeader)
  app.component('ElAside', ElAside)
  app.component('ElMain', ElMain)
  
  // 注册导航组件
  app.component('ElMenu', ElMenu)
  app.component('ElMenuItem', ElMenuItem)
  app.component('ElSubMenu', ElSubMenu)
  app.component('ElTabs', ElTabs)
  app.component('ElTabPane', ElTabPane)
  
  // 注册数据展示组件
  app.component('ElDropdown', ElDropdown)
  app.component('ElDropdownMenu', ElDropdownMenu)
  app.component('ElDropdownItem', ElDropdownItem)
  app.component('ElDrawer', ElDrawer)
  
  // 注册图标组件
  app.component('ElIcon', ElIcon)
  
  // 注册图标 (使用Icon前缀避免命名冲突)
  app.component('IconHouse', House)
  app.component('IconOfficeBuilding', OfficeBuilding)
  app.component('IconList', List)
  app.component('IconPlus', Plus)
  app.component('IconHomeFilled', HomeFilled)
  app.component('IconUser', User)
  app.component('IconSetting', Setting)
  app.component('IconSwitchButton', SwitchButton)
  app.component('IconDocument', Document)
  app.component('IconExpand', Expand)
  app.component('IconFold', Fold)
  app.component('IconMenu', Menu)
  app.component('IconArrowDown', ArrowDown)

  // 全局配置服务
  app.config.globalProperties.$message = ElMessage
  app.config.globalProperties.$loading = ElLoading
}