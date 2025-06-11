import React, { useEffect, useState } from 'react';
import UserFormModal from './UserFormModal';
import styles from './FrontPage.module.css';
import api from './api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserTable = () => {
    const navigate = useNavigate();
    // const user = JSON.parse(localStorage.getItem("user"));
    const user = useSelector((state) => state.login?.value || null);


    const [refresh, setRefresh] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 3;

    const [statusFilter, setStatusFilter] = useState('');
    // const [createdAtFilter, setCreatedAtFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const roleOptions = [
        { label: "User", value: "user" },
        { label: "Admin", value: "Admin" }
    ];
    const statusOptions = [
        { label: "Active", value: "active" },
        { label: "InActive", value: "inactive" },
        { label: "Pending", value: "pending" }
    ];

    useEffect(() => {
        const fetchUsers = async () => {
            try {

                const endpoint = "/user/getAllUsers"




                const res = await api.get(endpoint);
                console.log("res.data=" + res.data);
                setUsers(res.data);
            } catch (err) { console.error("Failed to fetch users:", err); }
        };
        fetchUsers();
    }, [user._id, refresh]);







    const handleCreateClick = () => {
        setSelectedUser(null);
        // setIsModalOpen(true);
        navigate('/signup');
    };
    const handleEditClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleSubmit = (formData) => {
        console.log(formData);
        if (selectedUser) { // Edit logic
            //put api
            api.patch(`/user/updateUsers/${formData._id}`, formData)
                .then(res => {
                    console.log(res.data);
                    // setLeads(res.data)
                    setRefresh(!refresh);
                })
                .catch(err => console.error(err));
        } else { // Create logic
            //post api
            api.post("/lead/createUser", formData)
                .then(res => {
                    console.log("res.data=" + res.data);
                    // setLeads(res.data) 
                    setRefresh(!refresh);
                })
                .catch(err => console.error(err));
        }
    };

    const handleSort = (field) => {
        if (field === sortField) {
            if (sortOrder === 'asc') { setSortOrder('desc'); }
            else if (sortOrder === 'desc') {
                setSortField('');
                setSortOrder('asc'); // default reset
            }
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    // console.log(typeof (users));
    // console.log(users);
    const filteredUsers = users
        .filter((user) =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((user) => (statusFilter ? user.status === statusFilter : true))
        // .filter((user) => (createdAtFilter ? user.createdAt === createdAtFilter : true))
        .filter((user) => (roleFilter ? user.role === roleFilter : true));

    if (sortField) {
        filteredUsers.sort((a, b) => {
            const aVal = a[sortField]?.toString().toLowerCase() || '';
            const bVal = b[sortField]?.toString().toLowerCase() || '';
            return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });
    }

    const indexOfLast = currentPage * usersPerPage;
    const indexOfFirst = indexOfLast - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast); console.log(currentUsers);

    function formatTime(timeStr) {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const handleSoftDelete = async (id) => {
        try {
            const response = await api.patch(`/user/softdelete/${id}`, { status: "Closed" });
            if (response.data) { setRefresh(!refresh); }
        } catch (error) { console.error('Error deleting lead:', error); }
    }

    return (
        <div className={`${styles.table}`} >
            <div className="p-6 bg-white shadow-lg rounded-md mt-10">
                <h2 className="text-xl font-bold mb-4 text-gray-700">Users Dashboard</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={handleCreateClick} className="mb-4 px-4 py-2 bg-green-600 text-white rounded">+ Create User</button>

                    <div className="flex justify-between mb-4 items-center">
                        <input type="text" placeholder="Search users..." value={searchTerm}
                            className="border px-3 py-2 rounded-md w-full max-w-xs"
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        <div className="flex space-x-1">
                            {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, i) => (
                                <button key={i} onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} > {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border rounded-md text-sm"
                        >
                            <option value="">All Statuses</option>
                            {statusOptions.map((status) => <option key={status.label} value={status.value}>{status.label}</option>)}
                        </select>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-3 py-2 border rounded-md text-sm"
                        >
                            <option value="">All Sources</option>
                            {roleOptions.map((role) => <option key={role.label} value={role.value}>{role.label}</option>)}
                        </select>
                    </div>
                    <button onClick={() => { navigate('/lead', { state: { user: user } }) }} className="mb-4 px-4 py-2 bg-green-600 text-white rounded">Go To Lead Dashboard</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-white uppercase bg-blue-600">
                            <tr>
                                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('name')}> Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')} </th>
                                <th className="px-6 py-3">Email </th>
                                <th className="px-6 py-3"> Password</th>
                                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('role')}> Role {sortField === 'role' && (sortOrder === 'asc' ? '↑' : '↓')} </th>
                                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('status')}>Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')} </th>
                                <th className="px-6 py-3" style={{ textAlign: 'center' }} colSpan={"3"}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user, idx) => (
                                <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.password}</td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">{user.status}</td>
                                    {/* <td className="px-6 py-4">{new Date(lead.conversionDate).toLocaleDateString()}</td> */}
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleEditClick(user)} className="text-blue-600 hover:underline">Edit</button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleSoftDelete(user._id)} className="text-red-600 hover:underline">Delete</button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => navigate("/lead", { state: { user: user } })} className="text-blue-600 hover:underline">View Leads</button>
                                    </td>
                                    {/* <td className="px-6 py-4">{lead.medicalNeeds}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleEditClick(lead)} className="text-blue-600 hover:underline">Edit</button>
                                    {/* <button className="text-blue-600 hover:underline mr-2">Edit</button> */}
                                    {/*<button className="text-red-600 hover:underline"
                                        onClick={() => handleSoftDelete(lead._id)}
                                    >Delete</button>
                                </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && <p className="text-gray-500 p-4">No users found.</p>}
                </div>
                {/* {console.log("selectedUser=" + selectedUser)} */}
                <UserFormModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false) }}
                    onSubmit={handleSubmit}
                    userData={selectedUser}
                    isEdit={!!selectedUser}
                    users={user}
                // roles={role}
                />
            </div >
        </div>
    );
};

export default UserTable;
