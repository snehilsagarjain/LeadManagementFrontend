import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import FrontPage from './FrontPage';
import './tailwind.css';
import TopBar from './Layout';
import LoginPage from './Login';
import SignUpPage from './Signup';
import LogoutPage from './LogoutPage';
import ForgotPasswordPage from './ForgotPassword';
import ResetPasswordPage from './ResetPassword';
// import AddLeadPage from './AddLead';
import DefaultFrontPage from './FrontPage';
import ReadLead from './ReadLead';
import api from './api';
import LeadTable from './LeadTable';
import UserTable from './UserTable';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './Logindata';
function App() {
  // const [count, setCount] = useState(0)
  // const dispatch = useDispatch();
  // const token = useSelector((state) => { state.login.token });
  // const token = useSelector((state) => { state.login?.token || null });
  // const user = useSelector((state) => { state.login?.value || null });
  // const user = useSelector((state) => { state.login.value });
  const abc = async () => {
    try {
      const token = useSelector((state) => state.login?.token || null);
      const user = useSelector((state) => state.login?.value || null);
      // const user = JSON.parse(localStorage.getItem("user"));
      // const token = JSON.parse(localStorage.getItem("token"));
      console.log(user);

      if (!user || !token) { console.log("No token found"); return false; }
      console.log(`>>>>>>94>>>>>`);

      const response = await api.get("/auth/verifyToken");

      return response.status === 200; // Token is valid
    } catch (error) {
      console.error("Token expired or invalid", error);
      dispatch(logout());
      // localStorage.removeItem("user"); // Clear invalid token
      return false;
    }
  };
  // const ProtectedRoute = ({ element }) => {
  //   console.log(abc());
  //   return abc() ? element : <Navigate to="/login" />;
  // };
  const ProtectedRoute = ({ element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const token = useSelector((state) => state.login?.token || null); console.log(token);
    const user = useSelector((state) => state.login?.value || null); console.log(user);
    const dispatch = useDispatch();
    useEffect(() => {
      const checkAuth = async () => {
        try {
          // const user = JSON.parse(localStorage.getItem("user"));
          // const token = JSON.parse(localStorage.getItem("token"));
          console.log(user);
          if (!user || !token) { console.log("No token found"); return setIsAuthenticated(false); }
          console.log(`>>>>>>94>>>>>`);

          const response = await api.get("/auth/verifyToken");
          // return response.status === 200; // Token is valid

          // const valid = await abc();
          setIsAuthenticated(response.status === 200); //valid
        } catch (error) {
          console.error("Token expired or invalid", error);
          dispatch(logout());
          // localStorage.removeItem("user"); // Clear invalid token
          setIsAuthenticated(false);
          // return false;
        }
      };
      checkAuth();
    }, [token, user, dispatch]);

    if (isAuthenticated === null) return <div>Loading...</div>; // Prevents flickering
    return isAuthenticated ? element : <Navigate to="/login" />;
  };


  // const abc = async () => {
  //   try {
  //     // const token = useSelector((state) => { state.login.token });
  //     // const user = useSelector((state) => { state.login.value });
  //     // const user = JSON.parse(localStorage.getItem("user"));
  //     // const token = JSON.parse(localStorage.getItem("token"));
  //     console.log(user);

  //     if (!user || !token) { console.log("No token found"); return false; }
  //     console.log(`>>>>>>94>>>>>`);

  //     const response = await api.get("/auth/verifyToken");

  //     return response.status === 200; // Token is valid
  //   } catch (error) {
  //     console.error("Token expired or invalid", error);
  //     dispatch(logout());
  //     // localStorage.removeItem("user"); // Clear invalid token
  //     return false;
  //   }
  // };
  // // const ProtectedRoute = ({ element }) => {
  // //   console.log(abc());
  // //   return abc() ? element : <Navigate to="/login" />;
  // // };
  // const ProtectedRoute = ({ element }) => {
  //   const [isAuthenticated, setIsAuthenticated] = useState(null);
  //   useEffect(() => {
  //     const checkAuth = async () => {
  //       // try {
  //       // const user = JSON.parse(localStorage.getItem("user"));
  //       // const token = JSON.parse(localStorage.getItem("token"));
  //       // console.log(user);
  //       // if (!user || !token) { console.log("No token found"); return setIsAuthenticated(false); }
  //       // console.log(`>>>>>>94>>>>>`);

  //       // const response = await api.get("/auth/verifyToken");
  //       // // return response.status === 200; // Token is valid

  //       const valid = await abc();
  //       setIsAuthenticated(valid);
  //       // } catch (error) {
  //       //   console.error("Token expired or invalid", error);
  //       //   dispatch(logout());
  //       //   // localStorage.removeItem("user"); // Clear invalid token
  //       //   // setIsAuthenticated(false);
  //       //   return false;
  //       // }
  //     };
  //     checkAuth();
  //   }, [token, user, dispatch]);

  //   if (isAuthenticated === null) return <div>Loading...</div>; // Prevents flickering
  //   return isAuthenticated ? element : <Navigate to="/login" />;
  // };

  const Admin = ({ element }) => {
    const user = useSelector((state) => state.login?.value || null);
    // const user = JSON.parse(localStorage.getItem("user"));
    if (user.role === "Admin") { return element; }
  }

  return (
    <BrowserRouter>
      {/* <TopBar /> */}
      <Routes>
        <Route path='/' element={<TopBar />} >
          <Route index element={<DefaultFrontPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path='logout' element={<LogoutPage />} />
          <Route path='forgotpassword' element={<ForgotPasswordPage />} />
          <Route path='resetpassword' element={<ResetPasswordPage />} />

          <Route path='lead' element={<ProtectedRoute element={<LeadTable />} />} />

          {/* ProtectedRoute: admin */}
          {/* <Route path='admin' element={<ProtectedRoute element={<Admin element={<DefaultAdminPage />} />} />} /> */}
          <Route path='user' element={<ProtectedRoute element={<Admin element={<UserTable />} />} />} />
          {/*<Route path="signup" element={<ProtectedRoute element={<Admin element={<SignUpPage />} />} />} />*/}
          <Route path="signup" element={<SignUpPage />} />
          {/* ProtectedRoute: user, admin */}
          {/* <Route path='createLead' element={<AddLeadPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
