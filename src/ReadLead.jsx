import React from "react";
import styles from './FrontPage.module.css';
import LeadTable from "./LeadTable";
<<<<<<< HEAD
import { useSelector } from 'react-redux';

export default function ReadLead() {
    // const user = JSON.parse(localStorage.getItem("user"));
    const user = useSelector((state) => state.login?.value || null);
=======

export default function ReadLead() {
    const user = JSON.parse(localStorage.getItem("user"));
>>>>>>> 7a435aeae27d7848252d531f1415a353c957fd34
    return (
        // <>
        //     <div>
        //         <div></div>
        //         <div>
        //             <form>
        //                 <select>
        //                     <option value="Filter">Filter</option>
        //                     <option value="Search">Search</option>
        //                 </select>
        //             </form>
        //         </div>
        //     </div>
        //     <div></div>
        // </>
        // <DataTable />
        // {/* h-[calc(100vh-4rem)] */ }
        // w-[calc(100vw - 3rem)]
        // px-4 

        // < div className={`mx-auto w-[calc(100vw - 3rem)] ${styles.table}`
        // } style={{ border: '2px solid blue' }}>
        //     <LeadTable />
        // </div >
        // max-w-3xl mx-auto  px-4
        //  w-[calc(100vw - 3rem)]
        <div className={`${styles.table}`} >
            <LeadTable user={user} role={user.role} />
        </div>
    );
}