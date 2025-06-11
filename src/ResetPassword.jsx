import React from 'react';
import styles from './FrontPage.module.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from './api';

export default function ResetPasswordPage() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (formData) => {
        // const storedOtp = JSON.parse(localStorage.getItem("otp"));
        // if (formData.otp !== storedOtp) {
        //     alert("Invalid OTP");
        //     return;
        // }
        console.log(formData);

        if (formData.oldpassword != null && formData.newpassword != null && formData.oldpassword != formData.newpassword) {
            try {
                // let user = JSON.parse(localStorage.getItem('user'));
                const user = useSelector((state) => state.login?.value || null);

                const { data } = await api.patch("/user/UpdateUser", {
                    id: user._id,
                    newpassword: formData.newpassword,
                });
                console.log("Update Response:", data);

                if (data) {
                    alert("Password updated!");
                    dispatch(removeotp());
                    // localStorage.removeItem("otp");
                    // localStorage.removeItem("expirytime");
                    navigate('/logout');
                    // navigate('/login');
                }
            } catch (error) {
                console.error("Error updating password:", error);
                alert("Failed to update password");
            }
        }
        else {
            alert("Both Passwords are same or either is null");
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-4">Reset Password</h2>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <input
                    {...register("Email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                {errors.Email && <p className="text-red-500 text-sm">{errors.Email.message}</p>}

                <input
                    {...register("oldpassword", { required: "Old password is required" })}
                    type="password"
                    placeholder="Old Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                {errors.oldpassword && <p className="text-red-500 text-sm">{errors.oldpassword.message}</p>}

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
        </div>
    );
}
