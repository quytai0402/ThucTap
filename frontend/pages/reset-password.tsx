import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../src/components/Layout'
import { useAuth } from '../src/context/AuthContext'
import { LockClosedIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const ResetPassword: React.FC = () => {
  const router = useRouter()
  const { token } = router.query
  const { user, isLoading: authLoading } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [tokenExpired, setTokenExpired] = useState(false)

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

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: token as string,
          newPassword: password 
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Có lỗi xảy ra')
      }

      setIsSubmitted(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      const errorMessage = error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.'
      
      // Check if it's a token expired error
      if (errorMessage.includes('Token đã hết hạn') || errorMessage.includes('expired')) {
        setTokenExpired(true)
        setError('Link đặt lại mật khẩu đã hết hạn')
      } else if (errorMessage.includes('Token không hợp lệ') || errorMessage.includes('invalid')) {
        setError('Link không hợp lệ. Vui lòng kiểm tra lại email của bạn.')
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!token && router.isReady) {
      setError('Link không hợp lệ hoặc đã hết hạn')
      setTokenExpired(true)
    }
  }, [token, router.isReady])

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
                      Bạn không thể đặt lại mật khẩu khi đã đăng nhập. 
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
        <title>Đặt lại mật khẩu - LaptopStore</title>
        <meta name="description" content="Đặt lại mật khẩu tài khoản LaptopStore" />
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
              Đặt lại mật khẩu
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              {isSubmitted ? (
                <div className="text-center">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Đặt lại mật khẩu thành công!
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Mật khẩu của bạn đã được cập nhật. Bạn sẽ được chuyển hướng đến trang đăng nhập trong 3 giây...
                  </p>
                  <Link href="/login" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Đăng nhập ngay
                  </Link>
                </div>
              ) : tokenExpired ? (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                      <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Link đã hết hạn
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Link đặt lại mật khẩu chỉ có hiệu lực trong 15 phút. 
                      Vui lòng yêu cầu gửi lại email để nhận link mới.
                    </p>
                  </div>

                  <div className="rounded-md bg-amber-50 p-4">
                    <div className="text-sm text-amber-700">
                      💡 <strong>Mẹo:</strong> Để tránh link hết hạn, hãy đặt lại mật khẩu ngay sau khi nhận được email.
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href="/forgot-password"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Yêu cầu link mới
                    </Link>
                    
                    <Link
                      href="/login"
                      className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Quay lại đăng nhập
                    </Link>
                  </div>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="text-sm text-red-700">{error}</div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Mật khẩu mới
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Nhập mật khẩu mới"
                      />
                      <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Xác nhận mật khẩu
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading || !token}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang xử lý...
                        </div>
                      ) : (
                        'Đặt lại mật khẩu'
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500">
                      Quay lại đăng nhập
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default ResetPassword
