import React from 'react';
import styles from './FrontPage.module.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from './api';

export default function ForgotPasswordPage() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onGetOtp = async () => {
        const email = watch("Email");
        try {
            const { data } = await api.patch("/user/forgotpassword", { email });
            console.log("OTP Sent Response:", data);

            if (data) {
                dispatch(otp(data.randomOtp));
                dispatch(expirytime(data.expirytime));
                // localStorage.setItem("otp", JSON.stringify(data.randomOtp));
                // localStorage.setItem("expirytime", JSON.stringify(data.expirytime));
                setTimeout(() => {
                    console.log('163');
                    dispatch(removeexpirytime());
                    // localStorage.removeItem("expirytime");
                }, 300000);
                alert("OTP Sent to Email!");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert("Failed to send OTP");
        }
    };

    const onSubmit = async (formData) => {
        const storedOtp = useSelector((state) => state.login?.otp || null);
        // const storedOtp = JSON.parse(localStorage.getItem("otp"));
        if (formData.otp !== storedOtp) {
            alert("Invalid OTP");
            return;
        }

        try {
            const { data } = await api.patch("/user/UpdateUser", {
                email: formData.Email,
                newPassword: formData.newpassword,
            });
            console.log("Update Response:", data);

            if (data) {
                alert("Password updated!");
                dispatch(removeotp());
                dispatch(removeexpirytime());
                // localStorage.removeItem("otp");
                // localStorage.removeItem("expirytime");
                navigate('/login');
            }
        } catch (error) {
            console.error("Error updating password:", error);
            alert("Failed to update password");
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-4">Forgot Password</h2>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <input
                    {...register("Email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                {errors.Email && <p className="text-red-500 text-sm">{errors.Email.message}</p>}

                <button
                    type="button"
                    onClick={onGetOtp}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
                >
                    Get OTP
                </button>

                <input
                    {...register("otp", { required: "OTP is required" })}
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}

                <input
                    {...register("newpassword", { required: "New password is required", minLength: 6 })}
                    type="password"
                    placeholder="New Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                {errors.newpassword && <p className="text-red-500 text-sm">{errors.newpassword.message}</p>}

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
                >
                    Update Password
                </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
                <span className="block mb-1">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-green-700 font-medium hover:underline whitespace-nowrap"
                    >
                        Login
                    </button>
                </span>
            </p>
        </div>
    );
}
