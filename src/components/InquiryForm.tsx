"use client"

import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Product } from '@/types/product'

interface Props {
  product?: Product
}

type FormData = {
  name: string
  email: string
  company: string
  message: string
}

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  company: yup.string().required(),
  message: yup.string().required(),
}).required()

export default function InquiryForm({ product }: Props) {
  const t = useTranslations('InquiryForm')
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      message: product ? t('defaultMessage', { product: product.name }) : '',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const formData = product
        ? {
            ...data,
            productId: product.id,
            productName: product.name,
          }
        : data
      
      console.log(formData)
      reset()
      alert(t('success'))
    } catch (error) {
      alert(t('error'))
    }
  }

  const inputStyles = "w-full border-2 border-gray-200 dark:border-gray-600 px-3 py-2 focus:border-primary focus:outline-none dark:bg-gray-800 dark:text-white transition-colors"
  const labelStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
  const errorStyles = "mt-1 text-sm text-red-500 text-center"

  return (
    <div className="bg-gray-100 dark:bg-gray-800/50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="g-gray-100 dark:bg-gray-800 p-6">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            {t('title')}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            {t('description')}
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className={labelStyles}>
                  {t('name.label')}
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className={inputStyles}
                />
                {errors.name && (
                  <p className={errorStyles}>{t('name.required')}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className={labelStyles}>
                  {t('email.label')}
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className={inputStyles}
                />
                {errors.email && (
                  <p className={errorStyles}>{t('email.required')}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="company" className={labelStyles}>
                {t('company.label')}
              </label>
              <input
                type="text"
                id="company"
                {...register('company')}
                className={inputStyles}
              />
              {errors.company && (
                <p className={errorStyles}>{t('company.required')}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className={labelStyles}>
                {t('message.label')}
              </label>
              <textarea
                id="message"
                rows={4}
                {...register('message')}
                className={inputStyles}
              />
              {errors.message && (
                <p className={errorStyles}>{t('message.required')}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="px-6 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors"
              >
                {t('submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
