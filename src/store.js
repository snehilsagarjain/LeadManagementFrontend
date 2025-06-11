import { configureStore } from '@reduxjs/toolkit'
import loginData from './Logindata'

export const store = configureStore({
    reducer: {
        login: loginData,
    },
})