import { useNavigate, useLocation } from 'react-router-dom'

export function useAppNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const navigateTo = (page: string) => {
    const path = page === 'home' ? '/' : `/${page}`
    navigate(path)
  }

  const getCurrentPage = () => {
    const path = location.pathname.slice(1)
    return path || 'home'
  }

  return {
    navigateTo,
    getCurrentPage,
    currentPath: location.pathname,
  }
}
