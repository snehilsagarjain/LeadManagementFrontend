import React, { useState } from 'react';
import styles from './FrontPage.module.css';
// import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from './api';
export default function AddLeadPage() {
    // const [isLogin, setIsLogin] = useState(true);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (content) => {
        try {
            console.log("Submitting:", content);
            const { data } = await api.post(`/lead/createLead`, content);
            console.log("Response:", data);
        } catch (error) {
            console.error("Error occurred:", error.message);
            if (error.response) {
                console.error("Backend error:", error.response.data);
            }
        }
    };

    console.log(errors);
    const navigate = useNavigate();
    return (
        <>
            {/* <div className={`min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4 ${styles.frontPageContainer}`}> */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-green-700 mb-4">
                    {'Add Lead'}
                </h2>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    {/* {!isLogin && ( */}
                    <input
                        {...register("FullName", { required: true, maxLength: 80 })}
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                    {/* )} */}

                    <input
                        {...register("ContactNumber", { required: true, maxLength: 80 })}
                        type="text"
                        placeholder="Contact Number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                    />

                    <input
                        {...register("Email", { required: true, pattern: /^\S+@\S+$/i })}
                        type="email"
                        placeholder="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                    <input
                        {...register("Address", { required: true })}
                        type="text"
                        placeholder="Address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                    />

                    <input
                        {...register("Nextfollowupdate")}
                        type="date"
                        placeholder="Next Follow Up Date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                    <input
                        {...register("Nextfollowuptime")}
                        type="time"
                        placeholder="Next Follow Up Time"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                    <input
                        {...register("Conversiondate")}
                        type="date"
                        placeholder="Conversion Date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                    {/* {!isLogin && (
                        <> */}
                    {/* <input type='checkbox' {...register("Role")} /> Admin */}
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
                        {'Create Lead'}
                    </button>
                </form>

                {/* <p className="text-center text-sm text-gray-600 mt-6">
                    {"Already have an account?"}{' '}
                    <button
                        onClick={() => navigate("/login")}
                        className="text-green-700 font-medium hover:underline"
                    >
                        {'Login'}
                    </button>
                </p> */}
            </div>
            {/* </div> */}
        </>
    );
}
