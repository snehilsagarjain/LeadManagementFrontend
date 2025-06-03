import React, { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";

import "react-datepicker/dist/react-datepicker.css";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import Select from 'react-select';

const UserFormModal = ({ isOpen, onClose, onSubmit, userData, isEdit, users }) => {
    const { register, handleSubmit, reset, control, formState: { errors }, setValue } =
        useForm({ defaultValues: userData || {} });

    const [userOptions, setUserOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const RoleOptions = [
        { label: "User", value: "user" },
        { label: "Admin", value: "Admin" },
    ];
    const StatusOptions = [
        { label: "Active", value: "active" },
        { label: "InActive", value: "inactive" },
        { label: "Pending", value: "pending" }
    ];

    // Reset form with user data on open, or empty if new
    useEffect(() => {
        if (isOpen) { reset(userData || {}); }
    }, [isOpen, userData, reset]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // if (loggedInUser.role === "admin") {                     --------------  roles
                if (users.role === "Admin") {
                    const singleOption = {
                        value: users.password,
                        label: users.password,
                    };
                    setUserOptions([singleOption]);
                    setValue("password", singleOption); // Pre-set for react-hook-form
                }
            } catch (err) { console.error("Error loading users:", err); }
        };
        fetchUsers();
    }, [users, setValue]);

    const handleClose = () => {
        reset(); // Clear all fields
        onClose(); // Close modal
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-40 flex items-center justify-center z-50" style={{ zIndex: '99999' }}>
            <div className="bg-white p-6 rounded shadow-xl w-full max-w-xl">
                <h2 className="text-lg font-bold mb-4">{isEdit ? 'Edit User' : 'Create User'}</h2>

                <form onSubmit={handleSubmit((data) => { onSubmit(data); handleClose(); })}>
                    {/* Name */}
                    <div className="mb-4">
                        <input
                            {...register('name', { required: 'Name is required' })}
                            placeholder="Name"
                            className="w-full p-2 border rounded"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    {/* Email & Password */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {/* Email */}
                        <div className="mb-4 w-1/2">
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                                        message: 'Enter a valid email'
                                    }
                                })}
                                placeholder="Email"
                                className="w-full p-2 border rounded"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div className="mb-4 w-1/2">
                            <Controller
                                name="password"
                                control={control}
                                rules={{ required: 'Password is required' }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={userOptions}
                                        // isDisabled={loggedInUser.role !== "admin"} // disable select for non-admins
                                        // isDisabled={roles !== "admin"} // disable select for non-admins
                                        placeholder="Password"
                                    />
                                )}
                            />

                            {errors.assignedTo && <p className="text-red-500 text-sm">{errors.assignedTo.message}</p>}
                        </div>
                    </div>

                    {/* role & status */}
                    <div className="flex " style={{ gap: '10px' }}>
                        {/* role */}
                        <div className="mb-4 w-1/2">
                            <Controller
                                name="role"
                                control={control}
                                rules={{ required: 'Role is required' }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={RoleOptions}
                                        value={RoleOptions.find(option => option.value === field.value)}
                                        onChange={(selectedOption) => field.onChange(selectedOption.value)}
                                        className="w-full"
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderColor: 'black',
                                            }),
                                            singleValue: (base) => ({
                                                ...base,
                                                color: 'black',
                                            }),
                                        }}
                                        placeholder="Select Role"
                                    />
                                )}
                            />
                            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                        </div>
                        <div className="mb-4 w-1/2">
                            {/* status */}
                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: 'Status is required' }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={StatusOptions}
                                        value={StatusOptions.find(option => option.value === field.value)}
                                        onChange={(selectedOption) => field.onChange(selectedOption.value)}
                                        className="w-full"
                                        styles={{
                                            control: (base) => ({ ...base, borderColor: 'black', }),
                                            singleValue: (base) => ({ ...base, color: 'black', }),
                                        }}
                                        placeholder="Select Status"
                                    />
                                )}
                            />
                            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2 mt-4">
                        <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-300 rounded"> Cancel </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded"> {isEdit ? 'Update' : 'Create'} </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;
