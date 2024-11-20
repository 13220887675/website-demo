'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQItem {
  id: number
  question: string
  answer: string
}

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null)
  const t = useTranslations('FAQ')

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: t('q1'),
      answer: t('a1')
    },
    {
      id: 2,
      question: t('q2'),
      answer: t('a2')
    },
    {
      id: 3,
      question: t('q3'),
      answer: t('a3')
    },
    {
      id: 4,
      question: t('q4'),
      answer: t('a4')
    },
    {
      id: 5,
      question: t('q5'),
      answer: t('a5')
    }
  ]

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        {t('title')}
      </h2>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 py-4 text-left flex justify-between items-center gap-4"
          >
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              {faq.question}
            </span>
            <motion.div
              animate={{ rotate: openId === index ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {openId === index ? (
                <ChevronUp className="h-5 w-5 text-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {openId === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: "auto", 
                  opacity: 1,
                  transition: {
                    height: { duration: 0.3, ease: "easeOut" },
                    opacity: { duration: 0.3, delay: 0.1 }
                  }
                }}
                exit={{ 
                  height: 0, 
                  opacity: 0,
                  transition: {
                    height: { duration: 0.3, ease: "easeIn" },
                    opacity: { duration: 0.2 }
                  }
                }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
