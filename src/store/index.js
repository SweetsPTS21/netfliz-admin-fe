import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '@/store/reducers/login.js'
import loginMiddleware from '@/store/middlewares/login'

const store = configureStore({
    reducer: {
        login: loginReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(loginMiddleware),
})

export default store

