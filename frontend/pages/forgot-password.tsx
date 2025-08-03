import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../src/components/Layout'
import { useAuth } from '../src/context/AuthContext'
import { EnvelopeIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const ForgotPassword: React.FC = () => {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/profile')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Có lỗi xảy ra')
      }

      setIsSubmitted(true)
    } catch (error: any) {
      setError(error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </Layout>
    )
  }

  // Show message if user is already logged in
  if (user) {
    return (
      <>
        <Head>
          <title>Đã đăng nhập - LaptopStore</title>
          <meta name="description" content="Bạn đã đăng nhập vào hệ thống" />
        </Head>

        <Layout>
          <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-8 h-8 text-amber-600" />
                </div>
              </div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Bạn đã đăng nhập
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Bạn hiện đang đăng nhập với tài khoản: <strong>{user.email}</strong>
              </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div className="text-center space-y-4">
                  <div className="rounded-md bg-amber-50 p-4">
                    <div className="text-sm text-amber-700">
                      Bạn không thể sử dụng tính năng quên mật khẩu khi đã đăng nhập. 
                      Nếu muốn đổi mật khẩu, vui lòng vào trang hồ sơ cá nhân.
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href="/profile"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Đi đến hồ sơ cá nhân
                    </Link>
                    
                    <Link
                      href="/"
                      className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Về trang chủ
                    </Link>

                    <button
                      onClick={() => {
                        // Logout functionality would go here
                        localStorage.removeItem('token')
                        window.location.href = '/login'
                      }}
                      className="w-full flex justify-center py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Đăng xuất và quên mật khẩu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Quên mật khẩu - LaptopStore</title>
        <meta name="description" content="Khôi phục mật khẩu tài khoản LaptopStore" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">L</span>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Quên mật khẩu?
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              {!isSubmitted ? (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập email của bạn"
                      />
                      <EnvelopeIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Đang gửi...
                        </div>
                      ) : (
                        'Gửi hướng dẫn đặt lại mật khẩu'
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <Link
                      href="/login"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Quay lại đăng nhập
                    </Link>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Email đã được gửi!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email <strong>{email}</strong>. 
                    Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setIsSubmitted(false)
                        setEmail('')
                      }}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Gửi lại email
                    </button>
                    <Link
                      href="/login"
                      className="block w-full text-center text-blue-600 hover:text-blue-800"
                    >
                      Quay lại đăng nhập
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default ForgotPassword
