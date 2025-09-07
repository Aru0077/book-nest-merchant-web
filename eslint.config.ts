import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'

// 基于2025年最佳实践的 Vue3 + TypeScript ESLint 配置
export default [
  // 忽略文件配置
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**'],
  },

  // JavaScript 推荐配置
  eslint.configs.recommended,

  // Vue 推荐配置
  ...pluginVue.configs['flat/recommended'],

  // TypeScript 推荐配置
  ...tseslint.configs.recommended,

  // 全局配置
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
  },

  // Vue 文件特殊配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },

  // 自定义规则 (YAGNI原则 - 仅保留核心必需规则)
  {
    rules: {
      // Vue 核心规则
      'vue/multi-word-component-names': 'warn',
      'vue/no-unused-vars': 'warn',

      // JavaScript/TypeScript 核心规则
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'prefer-const': 'error',
      'no-var': 'error',

      // TypeScript 特定规则优化
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-explicit-any': 'off', // Element Plus callbacks需要any
      'no-unused-vars': 'off', // 使用TypeScript版本
    },
  },

  // Prettier 格式化配置 (必须放最后)
  skipFormatting,
]
