import React, { useEffect, useState } from 'react';
import LeadFormModal from './LeadFormModal';
import styles from './FrontPage.module.css';
import api from './api';
import { useLocation } from 'react-router-dom';

const LeadTable = () => {

    // const user = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();
    const user = location.state?.user;

    const [refresh, setRefresh] = useState(true);
    const [leads, setLeads] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const leadsPerPage = 3;

    const [statusFilter, setStatusFilter] = useState('');
    const [assignedToFilter, setAssignedToFilter] = useState('');
    const [leadSourceFilter, setLeadSourceFilter] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);

    const [loading, setLoading] = useState(true);

    const leadSourceOptions = [
        { label: "Referral", value: "referral" },
        { label: "Website", value: "website" },
        { label: "Social Media", value: "social_media" },
        { label: "Advertisement", value: "advertisement" },
    ];



    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);
                const endpoint =
                    user.role === "Admin"
                        ? "/lead/getAllLeads"
                        : `/lead/getLeadsByUserId/${user._id}`;

                const res = await api.get(endpoint);
                console.log("res.data=" + res.data);
                setLeads(res.data);
            } catch (err) {
                console.error("Failed to fetch leads:", err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, [user.role, user._id, refresh]);

    const handleCreateClick = () => {
        setSelectedLead(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (lead) => {
        setSelectedLead(lead);
        setIsModalOpen(true);
    };

    const handleSubmit = (formData) => {
        console.log(formData);
        if (selectedLead) { // Edit logic
            //put api
            api.patch(`/lead/updateLeads/${formData._id}`, formData)
                .then(res => {
                    console.log(res.data);
                    // setLeads(res.data)
                    setRefresh(!refresh);
                })
                .catch(err => console.error(err));
            // setLeads(prev => prev.map(l => l._id === formData._id ? formData : l));
            // setRefresh(!refresh);
        } else { // Create logic
            //post api
            api.post("/lead/createLead", formData)
                .then(res => {
                    console.log("res.data=" + res.data);
                    // setLeads(res.data) 
                    setRefresh(!refresh);
                })
                .catch(err => console.error(err));
            // setLeads(prev => [...prev, { ...formData, _id: Date.now() }]);
            // setRefresh(!refresh);
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

    console.log(typeof (leads));
    console.log(leads);
    const filteredLeads = leads
        .filter((lead) =>
            lead.leadname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.contactNumber?.toString().includes(searchTerm)
        )
        .filter((lead) => (statusFilter ? lead.status === statusFilter : true))
        .filter((lead) => (assignedToFilter ? lead.assignedTo === assignedToFilter : true))
        .filter((lead) => (leadSourceFilter ? lead.leadSource === leadSourceFilter : true));

    if (sortField) {
        filteredLeads.sort((a, b) => {
            const aVal = a[sortField]?.toString().toLowerCase() || '';
            const bVal = b[sortField]?.toString().toLowerCase() || '';
            return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });
    }

    const indexOfLast = currentPage * leadsPerPage;
    const indexOfFirst = indexOfLast - leadsPerPage;
    const currentLeads = filteredLeads.slice(indexOfFirst, indexOfLast); console.log(currentLeads);

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
            const response = await api.patch(`/lead/softdelete/${id}`, { status: "Closed" });
            if (response.data) { setRefresh(!refresh); }
        } catch (error) { console.error('Error deleting lead:', error); }
    }

    return (
        <div className={`${styles.table}`} >
            <div className="p-6 bg-white shadow-lg rounded-md mt-10">
                <h2 className="text-xl font-bold mb-4 text-gray-700">Leads Dashboard</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={handleCreateClick} className="mb-4 px-4 py-2 bg-green-600 text-white rounded">+ Create Lead</button>

                    <div className="flex justify-between mb-4 items-center">
                        <input type="text" placeholder="Search leads..." value={searchTerm}
                            className="border px-3 py-2 rounded-md w-full max-w-xs"
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        <div className="flex space-x-1">
                            {Array.from({ length: Math.ceil(filteredLeads.length / leadsPerPage) }).map((_, i) => (
                                <button key={i} onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}> {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border rounded-md text-sm"
                        >
                            <option value="">All Statuses</option>
                            <option value="New">New</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Converted">Converted</option>
                            <option value="Closed">Closed</option>
                        </select>

                        <select
                            value={assignedToFilter}
                            onChange={(e) => setAssignedToFilter(e.target.value)}
                            className="px-3 py-2 border rounded-md text-sm"
                        >
                            <option value="">All Assignees</option>
                            {[...new Set(leads.map(l => l.assignedTo))].map(person =>
                                <option key={person} value={person}>{person}</option>
                            )}
                        </select>

                        <select
                            value={leadSourceFilter}
                            onChange={(e) => setLeadSourceFilter(e.target.value)}
                            className="px-3 py-2 border rounded-md text-sm"
                        >
                            <option value="">All Sources</option>
                            {leadSourceOptions.map((source) => <option key={source.label} value={source.value}>{source.label}</option>)}
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-white uppercase bg-blue-600">
                            <tr>
                                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('leadname')}> Lead Name {sortField === 'leadname' && (sortOrder === 'asc' ? '↑' : '↓')} </th>
                                <th className="px-6 py-3"> Contact Number</th>
                                <th className="px-6 py-3">Email </th>
                                <th className="px-6 py-3"> Address </th>
                                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('status')}>Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')} </th>
                                <th className="px-6 py-3">AssignedTo</th>
                                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('nextfollowupdate')}> Next Follow Up Date {sortField === 'nextfollowupdate' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                                <th className="px-6 py-3">Next Follow Up Time</th>
                                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('leadsource')}> Lead Source {sortField === 'leadsource' && (sortOrder === 'asc' ? '↑' : '↓')} </th>
                                <th className="px-6 py-3"> Conversion Date</th>
                                <th className="px-6 py-3"> Lead Notes</th>
                                <th className="px-6 py-3"> Customer Type</th>
                                <th className="px-6 py-3"> Purchase History</th>
                                <th className="px-6 py-3"> Medical Needs</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentLeads.map((lead, idx) => (
                                <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{lead.leadName}</td>
                                    <td className="px-6 py-4">{lead.contactNumber}</td>
                                    <td className="px-6 py-4">{lead.email}</td>
                                    <td className="px-6 py-4">{lead.address}</td>
                                    <td className="px-6 py-4">{lead.status}</td>
                                    <td className="px-6 py-4">{lead.assignedTo}</td>
                                    <td className="px-6 py-4">{new Date(lead.nextfollowupdate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{formatTime(lead.nextfollowuptime)}</td>

                                    {/* <td className="px-6 py-4">{new Date(lead.nextfollowuptime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td> */}
                                    <td className="px-6 py-4">{lead.leadSource}</td>
                                    <td className="px-6 py-4">{new Date(lead.conversionDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{lead.leadNotes}</td>
                                    <td className="px-6 py-4">{lead.customerType}</td>
                                    <td className="px-6 py-4">{lead.purchaseHistory}</td>
                                    <td className="px-6 py-4">{lead.medicalNeeds}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleEditClick(lead)} className="text-blue-600 hover:underline">Edit</button>
                                        {/* <button className="text-blue-600 hover:underline mr-2">Edit</button> */}
                                        <button className="text-red-600 hover:underline"
                                            onClick={() => handleSoftDelete(lead._id)}
                                        >Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredLeads.length === 0 && <p className="text-gray-500 p-4">No leads found.</p>}
                </div>
                {console.log("selectedLead=" + selectedLead)}
                <LeadFormModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false) }}
                    onSubmit={handleSubmit}
                    leadData={selectedLead}
                    isEdit={!!selectedLead}
                    users={user}
                />
            </div>
        </div >
    );
};

export default LeadTable;
