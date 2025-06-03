// App.jsx
import React from "react";
import styles from './FrontPage.module.css';
import { useNavigate } from "react-router-dom";
import LeadTable from "./LeadTable";
// import { DataTable } from "./file";

// export default 
export default function DefaultFrontPage() {
    const navigate = useNavigate();
    return (
        <>
            {/* // <div className="min-h-screen h-screen overflow-hidden bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-6" style={{ width: '100vw', height: '9vh', border: '2px solid black' }}>
        // <div className={`min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-6 ${styles.frontPageContainer}`}> */}
            {/* width: '100%', */}

            <div className="max-w-3xl text-center p-10 bg-white rounded-3xl shadow-xl" style={{ border: '2px solid red' }}>
                {/* text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-700  */}
                <h1 className={`text-4xl md:text-5xl font-bold text-green-700 mb-6 ${styles.responsiveText}`}>
                    Manage Leads And Customer Details For Pharmacy Business.
                </h1>
                <p className={`text-gray-600 text-lg md:text-xl mb-8 ${styles.responsiveText}`}>
                    Streamline your pharmacy's communication and customer tracking effortlessly.
                </p>
                <button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300"
                    onClick={() => { navigate("/login") }}
                >
                    Login
                </button>
            </div>

            {/* </div> */}
        </>
    );
}



// export default function FrontPage() {
//     const token = JSON.parse(localStorage.getItem('token'));
//     return (
//         <>
//             {/* <TopBar /> */}
//             {!token ? <DefaultFrontPage /> : <SignedPage />}
//         </>
//     );
// }