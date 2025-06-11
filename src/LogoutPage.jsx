// LogoutPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function LogoutPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/login"); // Redirect to login page
        }, 1000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div >
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Successfully Logged Out</h2>
                <p className="text-gray-600">Redirecting you to login page...</p>
                <div className="mt-6">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 animate-[progress_3s_linear_forwards]" />
                    </div>
                </div>
            </div>

            <style>
                {`
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}
            </style>
        </div>
    );
}
