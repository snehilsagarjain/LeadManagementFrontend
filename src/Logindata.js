import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: null, token: null, otp: null, expirytime: null }

export const logindata = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setlogindata: (state, action) => { state.value = action.payload },
        token: (state, action) => { state.token = action.payload },
        otp: (state, action) => { state.otp = action.payload },
        expirytime: (state, action) => { state.token = action.payload },
        removeotp: (state, action) => { state.otp = null },
        removeexpirytime: (state, action) => { state.expirytime = null },
        logout: (state) => {
            state.value = null;
            state.token = null;
        },
    },
})

// Action creators are generated for each case reducer function
export const { setlogindata, token, logout, removeexpirytime, removeotp } = logindata.actions

export default logindata.reducer