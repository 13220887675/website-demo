"use client"

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Moon, Sun } from 'lucide-react'

export default function ThemeSwitcher() {
  const t = useTranslations('ThemeSwitcher')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // 在组件加载时获取当前主题
  useEffect(() => {
    // 检查系统主题偏好
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
    // 检查localStorage中保存的主题
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }
  }, [])

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={t('toggleTheme')}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
      ) : (
        <Sun className="w-5 h-5 text-gray-700 dark:text-gray-200" />
      )}
    </button>
  )
}
