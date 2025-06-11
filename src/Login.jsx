import React, { useState } from 'react';
import styles from './FrontPage.module.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from './api';
<<<<<<< HEAD
import { useDispatch } from 'react-redux';
import { setlogindata, token } from './Logindata';
import { useSelector } from "react-redux";
import { setAuthToken } from "./api";
import axios from 'axios';
=======
>>>>>>> 7a435aeae27d7848252d531f1415a353c957fd34
export default function LoginPage() {
    // const [isLogin, setIsLogin] = useState(true);
    const { register, handleSubmit, formState: { errors } } = useForm();
    // const onSubmit = data => console.log(data);
<<<<<<< HEAD
    const dispatch = useDispatch();
    const onSubmit = async (content) => {
        try {
            console.log("Submitting:", content);
            const { data } = await axios.post(`http://localhost:6080/auth/login`, content);
            console.log("Response:", data);
            if (data) {
                console.log(data);
                // localStorage.setItem("user", JSON.stringify(data.userEmail));
                // localStorage.setItem("token", JSON.stringify(data.token));
                // dispatch(setlogindata(content));
                // console.log(data.userEmail);
                dispatch(setlogindata(data.userEmail));
                dispatch(token(data.token));
                // const user = useSelector((state) => state.login?.value || null);
                // const tokenn = useSelector((state) => state.login?.token || null);
                // setAuthToken(tokenn);
                setAuthToken(data.token);
                // console.log(data.role);
                // console.log(typeof (data.role));
=======
    const onSubmit = async (content) => {
        try {
            console.log("Submitting:", content);
            const { data } = await api.post(`/auth/login`, content);
            console.log("Response:", data);
            if (data) {
                console.log(data);
                localStorage.setItem("user", JSON.stringify(data.userEmail));
                localStorage.setItem("token", JSON.stringify(data.token));
                console.log(data.role);
                console.log(typeof (data.role));
>>>>>>> 7a435aeae27d7848252d531f1415a353c957fd34
                if (data.userEmail.role == "Admin") {
                    // navigate("/admin"); 
                    navigate("/user");
                }
                else { navigate("/lead"); }
            }
        } catch (error) {
            console.error("Error occurred:", error.message);
            // if (error.response) { console.error("Backend error:", error.response.data); }
        }
    };

<<<<<<< HEAD
    // console.log(errors);
=======
    console.log(errors);
>>>>>>> 7a435aeae27d7848252d531f1415a353c957fd34
    const navigate = useNavigate();
    return (
        <>
            {/* <div className={`min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4 ${styles.frontPageContainer}`}> */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-green-700 mb-4"> {'Login'} </h2>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    {/* {!isLogin && (
                        <input
                            {...register("Full Name", { required: true, maxLength: 80 })}
                            type="text"
                            placeholder="Full Name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                        />
                    )} */}
                    <input
                        {...register("Email", { required: true, pattern: /^\S+@\S+$/i })}
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                    <input
                        {...register("Password", { required: true })}
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                    {/* {!isLogin && (
                        <>
                            <input type='checkbox' /> Admin */}
                    {/* <input
                                type="text"
                                placeholder="Status"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                            /> */}
                    {/* </>
                    )} */}
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                        {'Login'}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-600 mt-6">
                    <p>
                        <button
                            onClick={() => navigate('/forgotpassword')}
                            className="text-green-700 font-medium hover:underline"
                        >
                            {"Forgot Password"}
                        </button>
                    </p>
<<<<<<< HEAD
                    {"Don't have an account?"}{' '}
=======
                    {/* {"Don't have an account?"}{' '}
>>>>>>> 7a435aeae27d7848252d531f1415a353c957fd34
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-green-700 font-medium hover:underline"
                    >
                        {'Sign up'}
<<<<<<< HEAD
                    </button>
=======
                    </button> */}
>>>>>>> 7a435aeae27d7848252d531f1415a353c957fd34
                </div>
            </div>
            {/* </div> */}
        </>
    );
}
