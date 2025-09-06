import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// Vue3 + TypeScript 2025 最佳实践 ESLint 配置
export default defineConfigWithVueTs(
  // 文件匹配规则
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  // 全局忽略文件
  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '**/node_modules/**',
    '**/.git/**',
    '**/public/**',
  ]),

  // Vue 插件配置
  pluginVue.configs['flat/recommended'], // 使用 recommended 替代 essential

  // TypeScript 配置
  vueTsConfigs.recommended,

  // 自定义规则配置
  {
    name: 'app/custom-rules',
    rules: {
      // ============ Vue 3 最佳实践规则 ============
      'vue/multi-word-component-names': 'warn',
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/define-emits-declaration': 'error',
      'vue/define-props-declaration': 'error',
      'vue/no-unused-vars': 'error',
      'vue/no-v-html': 'warn',
      'vue/prefer-true-attribute-shorthand': 'error',
      'vue/v-on-event-hyphenation': ['error', 'always'],
      'vue/attribute-hyphenation': ['error', 'always'],
      
      // Composition API 规则
      'vue/prefer-import-from-vue': 'off', // 在某些版本中此规则可能不存在
      
      // ============ TypeScript 规则 ============ 
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      
      // ============ 通用代码质量规则 ============
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      
      // 代码风格
      'comma-dangle': ['error', 'always-multiline'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'never'],
    },
  },

  // Prettier 格式化跳过
  skipFormatting,
)
