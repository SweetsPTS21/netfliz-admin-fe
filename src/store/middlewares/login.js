import { loginTypes } from '@/store/types/types'
import { loginSuccess, loginError, clearLogin } from '@/store/actions/login'
import { signIn, logoutApi } from '@/api/auth'
import { ROUTES } from '@/config/urls'

/**
 * Redux thunk middleware for login flow.
 * Handles LOGIN_REQUEST, LOGOUT, and GET_ME actions.
 */
const loginMiddleware = (store) => (next) => async (action) => {
    next(action)

    switch (action.type) {
        case loginTypes.REQUEST: {
            try {
                store.dispatch({ type: loginTypes.LOADING_LOGIN, payload: true })

                const { email, password } = action
                const response = await signIn(email, password)
                const data = response?.data

                if (data?.accessToken) {
                    localStorage.setItem('accessToken', data.accessToken)
                    if (data.refreshToken) {
                        localStorage.setItem('refreshToken', data.refreshToken)
                    }

                    store.dispatch(loginSuccess(data))

                    // Redirect to dashboard & disable back to login
                    window.location.replace(ROUTES.HOME)
                }
            } catch (error) {
                store.dispatch(
                    loginError(
                        error?.response?.data?.message ||
                        error?.message ||
                        'Đã có lỗi xảy ra. Vui lòng thử lại sau!',
                    ),
                )
            } finally {
                store.dispatch({ type: loginTypes.LOADING_LOGIN, payload: false })
            }
            break
        }

        case loginTypes.LOGOUT: {
            try {
                await logoutApi()
            } catch {
                // Logout API failure is non-blocking
            } finally {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                store.dispatch(clearLogin())
                window.location.href = ROUTES.LOGIN
            }
            break
        }

        case loginTypes.GET_ME: {
            try {
                store.dispatch({ type: loginTypes.LOADING_LOGIN, payload: true })
                const me = await getMe()
                if (me) {
                    store.dispatch(loginSuccess(me))
                }
            } catch (error) {
                store.dispatch(
                    loginError(
                        error?.response?.data?.message || 'Không thể lấy thông tin người dùng.',
                    ),
                )
            } finally {
                store.dispatch({ type: loginTypes.LOADING_LOGIN, payload: false })
            }
            break
        }

        default:
            break
    }
}

export default loginMiddleware
