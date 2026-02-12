import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/client/react'
import { ConfigProvider, theme } from 'antd'
import store from '@/store'
import apolloClient from '@/graphql/client'
import router from '@/router'
import './index.css'
import AppContextProvider from './contexts/appContext'
import AuthedContextProvider from './contexts/authedContext'
import ThemeContextProvider, { useTheme } from './contexts/ThemeContext'

const sharedTokens = {
  colorPrimary: '#e50914',
  borderRadius: 10,
  fontFamily: "'Inter', sans-serif",
  controlHeight: 48,
  fontSize: 15,
}

const darkThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    ...sharedTokens,
    colorBgContainer: 'rgba(30, 30, 46, 0.7)',
    colorBorder: 'rgba(255, 255, 255, 0.08)',
    colorText: '#e4e4e7',
    colorTextPlaceholder: 'rgba(228, 228, 231, 0.4)',
  },
  components: {
    Input: {
      activeBorderColor: '#e50914',
      hoverBorderColor: 'rgba(229, 9, 20, 0.5)',
      activeShadow: '0 0 0 3px rgba(229, 9, 20, 0.15)',
      paddingInline: 16,
    },
    Button: {
      primaryShadow: '0 4px 20px rgba(229, 9, 20, 0.4)',
    },
    Checkbox: {
      colorPrimary: '#e50914',
    },
  },
}

const lightThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    ...sharedTokens,
    colorBgContainer: '#ffffff',
    colorBorder: '#e5e7eb',
    colorText: '#1f2937',
    colorTextPlaceholder: 'rgba(107, 114, 128, 0.6)',
  },
  components: {
    Input: {
      activeBorderColor: '#e50914',
      hoverBorderColor: 'rgba(229, 9, 20, 0.5)',
      activeShadow: '0 0 0 3px rgba(229, 9, 20, 0.1)',
      paddingInline: 16,
    },
    Button: {
      primaryShadow: '0 4px 20px rgba(229, 9, 20, 0.3)',
    },
    Checkbox: {
      colorPrimary: '#e50914',
    },
  },
}

const ThemedApp = () => {
  const { isDark } = useTheme()

  return (
    <ConfigProvider theme={isDark ? darkThemeConfig : lightThemeConfig}>
      <ApolloProvider client={apolloClient}>
        <Provider store={store}>
          <AppContextProvider>
            <AuthedContextProvider>
              <RouterProvider router={router} />
            </AuthedContextProvider>
          </AppContextProvider>
        </Provider>
      </ApolloProvider>
    </ConfigProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeContextProvider>
      <ThemedApp />
    </ThemeContextProvider>
  </StrictMode>,
)
