import React, { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import Select from 'react-select';
import api from './api';

const LeadFormModal = ({ isOpen, onClose, onSubmit, leadData, isEdit, users }) => {
    const { register, handleSubmit, reset, control, formState: { errors }, setValue } =
        useForm({ defaultValues: leadData || {} });
    console.log("leadData=" + leadData);

    const [userOptions, setUserOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const leadSourceOptions = [
        { label: "Referral", value: "referral" },
        { label: "Website", value: "website" },
        { label: "Social Media", value: "social_media" },
        { label: "Advertisement", value: "advertisement" },
    ];
    const customerTypeOptions = [
        { label: "Individual", value: "individual" },
        { label: "Retailer", value: "retailer" },
        { label: "Clinic", value: "clinic" },
        { label: "Hospital", value: "hospital" }
    ];
    const medicalOptions = [
        { label: "Diabetes", value: "Diabetes" },
        { label: "Hypertension", value: "Hypertension" },
        { label: "Asthma", value: "Asthma" }
    ];
    const productOptions = [
        { label: "Product A", value: "Product A" },
        { label: "Product B", value: "Product B" },
        { label: "Product C", value: "Product C" }
    ];
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: 'black',
            Color: 'black',
            boxShadow: 'none',
            '&:hover': {
                borderColor: 'black',
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#6b7280', // Tailwind's gray-500
        }),
    };

    // Reset form with lead data on open, or empty if new
    useEffect(() => {
        if (isOpen) { reset(leadData || {}); }
    }, [isOpen, leadData, reset]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (users.role === "Admin") {
                    // if (users.roles === "Admin") {

                    const res = await api.get('/user/getAllUsers');
                    const user = res.data;
                    const options = user.map(user => ({
                        value: user._id,
                        label: user._id, // Or use user.name
                    }));
                    setUserOptions(options);
                } else {
                    const singleOption = {
                        value: users._id,
                        label: users._id,
                    };
                    setUserOptions([singleOption]);
                    setValue("assignedTo", singleOption); // Pre-set for react-hook-form
                }
            } catch (err) { console.error("Error loading users:", err); }
            finally { setLoading(false); }
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
                <h2 className="text-lg font-bold mb-4">{isEdit ? 'Edit Lead' : 'Create Lead'}</h2>

                <form onSubmit={handleSubmit((data) => { onSubmit(data); handleClose(); })}>

                    {/*Lead Name and Contact Number */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {/* Lead Name */}
                        <div className="mb-4 w-1/2">
                            <input
                                {...register('leadName', { required: 'Lead Name is required' })}
                                placeholder="Lead Name"
                                className="w-full p-2 border rounded"
                            />
                            {errors.leadname && <p className="text-red-500 text-sm">{errors.leadname.message}</p>}
                        </div>

                        {/* Contact Number */}
                        <div className="mb-4 w-1/2">
                            <input
                                {...register('contactNumber', {
                                    required: 'Contact Number is required',
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'Enter a valid 10-digit number'
                                    }
                                })}
                                placeholder="Contact Number"
                                className="w-full p-2 border rounded"
                            />
                            {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}
                        </div>
                    </div>

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
                                name="assignedTo"
                                control={control}
                                rules={{ required: 'Assigned To is required' }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={userOptions}
                                        // isDisabled={loggedInUser.role !== "admin"} // disable select for non-admins
                                        // isDisabled={roles !== "admin"} // disable select for non-admins
                                        placeholder="AssignedTo"
                                        styles={customStyles}
                                    />
                                )}
                            />

                            {errors.assignedTo && <p className="text-red-500 text-sm">{errors.assignedTo.message}</p>}
                        </div>
                    </div>
                    {/*Address and Lead Notes */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {/* Address */}
                        <div className="mb-4 w-1/2">
                            <textarea
                                {...register("address", { required: 'Address is required' })}
                                placeholder="Address"
                                className="w-full p-2 border rounded resize-none"
                                rows={3}
                            />
                            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                        </div>
                        {/*Lead Notes*/}
                        <div className="mb-4 w-1/2">
                            {/* { required: "Lead notes are required" } */}
                            <textarea
                                {...register("leadNotes",)}
                                placeholder="Enter lead notes"
                                className="w-full p-2 border rounded resize-none"
                                rows={3}
                            />
                            {errors.leadnotes && (<p className="text-red-500 text-sm">{errors.leadnotes.message}</p>)}
                        </div>
                    </div>

                    {/* Lead Source and Customer Type */}
                    <div className="flex " style={{ gap: '10px' }}>
                        {/* Lead Source */}
                        <div className="mb-4 w-1/2">
                            <Controller
                                name="leadSource"
                                control={control}
                                rules={{ required: 'Lead Source is required' }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={leadSourceOptions}
                                        value={leadSourceOptions.find(option => option.value === field.value)}
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
                                        placeholder="Select Lead Source"
                                    />
                                )}
                            />
                            {errors.leadSource && <p className="text-red-500 text-sm">{errors.leadSource.message}</p>}
                        </div>
                        <div className="mb-4 w-1/2">
                            {/* Customer Type */}
                            <Controller
                                name="customerType"
                                control={control}
                                rules={{ required: 'Customer Type is required' }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={customerTypeOptions}
                                        value={customerTypeOptions.find(option => option.value === field.value)}
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
                                        placeholder="Select Customer Type"
                                    />
                                )}
                            />
                            {errors.customerType && <p className="text-red-500 text-sm">{errors.customerType.message}</p>}
                        </div>
                    </div>

                    {/*Purchase History and Medical Needs */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {/*Purchase History */}
                        <div className="mb-4 w-1/2">
                            <Controller
                                name="purchaseHistory"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        isMulti
                                        options={productOptions}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        onChange={(selected) => field.onChange(selected.map(opt => opt.value))}
                                        value={productOptions.filter(opt => field.value?.includes(opt.value))}
                                        placeholder="Select Purchase History"
                                        styles={customStyles}
                                    />
                                )}
                            />
                            {errors.purchaseHistory && <p className="text-red-500 text-sm">{errors.purchaseHistory.message}</p>}
                        </div>
                        {/*Medical Needs */}
                        <div className="mb-4 w-1/2">
                            <Controller
                                name="medicalNeeds"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        isMulti
                                        options={medicalOptions}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        onChange={(selected) => field.onChange(selected.map(opt => opt.value))}
                                        value={medicalOptions.filter(opt => field.value?.includes(opt.value))}
                                        placeholder="Select Medical Needs"
                                        styles={customStyles}
                                    />
                                )}
                            />
                            {errors.medicalNeeds && <p className="text-red-500 text-sm">{errors.medicalNeeds.message}</p>}
                        </div>
                    </div>

                    {/* Follow-up Date & Time , conversion date*/}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {/* Date */}
                        <div className="mb-4 w-1/3">
                            <Controller
                                control={control}
                                name="nextfollowupdate"
                                render={({ field }) => (
                                    <DatePicker
                                        placeholderText="Follow-up Date"
                                        className="w-full p-2 border rounded"
                                        selected={field.value}
                                        onChange={field.onChange}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                )}
                            />
                            {errors.nextfollowupdate && <p className="text-red-500 text-sm">{errors.nextfollowupdate.message}</p>}
                        </div>

                        {/* Time */}
                        <div className="mb-4 w-1/3">
                            <Controller
                                name="nextfollowuptime"
                                control={control}
                                render={({ field }) => (
                                    <TimePicker
                                        {...field}
                                        onChange={(val) => field.onChange(val)}
                                        value={field.value}
                                        placeholderText="Select time"
                                        className="w-full border rounded p-2"
                                    />
                                )}
                            />
                            {errors.nextfollowuptime && <p className="text-red-500 text-sm">{errors.nextfollowuptime.message}</p>}
                        </div>

                        {/* Conversion Date */}
                        <div className="mb-4 w-1/3">
                            <Controller
                                control={control}
                                name="conversionDate"
                                render={({ field }) => (
                                    <DatePicker
                                        placeholderText="Conversion Date"
                                        className="w-full p-2 border rounded"
                                        selected={field.value}
                                        onChange={field.onChange}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                )}
                            />
                            {errors.conversionDate && <p className="text-red-500 text-sm">{errors.conversionDate.message}</p>}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2 mt-4">
                        <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-300 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                            {isEdit ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeadFormModal;
