import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTokenStart } from '../store/actions/login'

const AuthedContext = createContext({})

export const useAuthedContext = () => {
    return useContext(AuthedContext)
}

const AuthedContextProvider = ({ children }) => {
    const dispatch = useDispatch()
    const [authedUser, setAuthedUser] = useState(null)
    const { user } = useSelector((state) => state.login)
    const jwtToken = window.localStorage.getItem('accessToken')

    useEffect(() => {
        if (user && user?.email) {
            if (!jwtToken) {
                dispatch(getTokenStart(user?.email))
            } else {
                setAuthedUser(user)
            }
        }
    }, [user])

    const contextValue = useMemo(() => {
        return {
            authedUser
        }
    }, [authedUser])

    return (
        <AuthedContext.Provider value={contextValue}>
            {children}
        </AuthedContext.Provider>
    )
}

export default AuthedContextProvider
