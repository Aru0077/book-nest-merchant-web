import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import parser from '@typescript-eslint/parser'

// 精简的 Vue3 + TypeScript ESLint 配置
export default [
  {
    files: ['**/*.{js,ts,vue}'],
    ignores: ['**/dist/**', '**/node_modules/**'],
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },

  // Vue 基础配置
  ...pluginVue.configs['flat/essential'],

  // 核心规则配置
  {
    rules: {
      // Vue 核心规则
      'vue/multi-word-component-names': 'warn',
      
      // JavaScript 核心规则
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'warn',
    },
  },

  skipFormatting,
]
