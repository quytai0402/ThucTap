import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface WithAuthProps {
  allowedRoles?: string[]
  redirectTo?: string
}

export function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  options: WithAuthProps = {}
) {
  const { allowedRoles = [], redirectTo = '/login' } = options

  return function AuthComponent(props: T) {
    const { user, isAuthenticated, isLoading } = useAuth()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
      setIsClient(true)
    }, [])

    useEffect(() => {
      if (!isLoading && isClient) {
        if (!isAuthenticated) {
          router.push(`${redirectTo}?redirect=${router.asPath}`)
          return
        }

        if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
          // Redirect based on user role
          if (user.role === 'admin') {
            router.push('/admin')
          } else {
            router.push('/')
          }
          return
        }
      }
    }, [isAuthenticated, isLoading, user, router, isClient])

    if (!isClient || isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null
    }

    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}
