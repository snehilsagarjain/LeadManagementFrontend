import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import styles from './FrontPage.module.css';
import './Dropdown.css'; // Make sure to create this CSS file
import { useSelector, useDispatch } from 'react-redux';
import { logout, setlogindata } from './Logindata';

const StyledButton = styled.button`
  display: flex; align-items: center; justify-content: center;
  padding: 10px 20px; text-align: center;
  color: green; font-size: 20px; text-decoration: underline;

  @media (max-width: 600px) { font-size: 14px; }
`;

const DropdownItem = styled.li`
  color: green; white-space: nowrap;
  padding: 5px 10px; cursor: pointer;

  &:hover { background-color: #222; color: lime; }
`;

const avatarStyle = {
    width: '36px', height: '36px', borderRadius: '50%',
    backgroundColor: '#fff', color: 'green',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 'bold', cursor: 'pointer',
};

const TopBar = () => {
    // const user = JSON.parse(localStorage.getItem('user'));
    console.log("layout33");
    // const user = useSelector((state) => { state.login.value });
    const user = useSelector((state) => state.login?.value || null); console.log(user);
    console.log("layout35");
    const navigate = useNavigate();
    console.log("38");
    const [dropdown, setDropdown] = useState(false);
    console.log("40");
    const dispatch = useDispatch();
    console.log("42");
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', border: '2px solid orange', overflow: 'hidden' }}>
            {/* Top Navigation */}
            <div
                style={{
                    width: '100vw',
                    // border: '2px solid red',
                    position: 'fixed', top: '0px', left: '0px',
                    display: 'flex', justifyContent: 'space-around',
                    backgroundColor: 'rgb(12 46 211)', color: 'white',
                    zIndex: '999', padding: '10px',
                }}
            >
                <StyledButton onClick={() => { user ? (user.role == "Admin" ? navigate("/user") : navigate("/lead")) : navigate("/") }}> <b>{"Lead Management Tool".toUpperCase()}</b> </StyledButton>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button
                        style={{ margin: '5px', color: 'green' }}
                        onClick={() => {
                            if (user) {
                                dispatch(logout());
                                // localStorage.removeItem("user");
                                // localStorage.removeItem("token");
                                navigate("/logout");
                            } else { navigate("/login"); }
                        }}
                    >
                        {user ? "Logout" : "Login"}
                    </button>

                    {user?.name[0] && (
                        <div
                            className="dropdown-wrapper"
                            onMouseEnter={() => setDropdown(true)}
                            onMouseLeave={() => setDropdown(false)}
                        >
                            <span style={avatarStyle}> <b>{user?.name[0].toUpperCase()}</b> </span>
                            <ul className={`dropdown-menu ${dropdown ? 'show' : ''}`}>
                                <DropdownItem onClick={() => { navigate("") }}> {"Profile"} </DropdownItem>
                                <DropdownItem onClick={() => { navigate("/resetpassword") }}> {"Reset Password"} </DropdownItem>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            {/* min-h-screen */}
            {/* h-[calc(100vh-4rem)] */}
            <div
                className={` flex-1 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-6 ${styles.frontPageContainer}`}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default TopBar;


// {["Profile", "Reset Password"].map((item, index) => (
//     <DropdownItem key={index} onClick={() => { navigate("/resetpassword") }}> {item} </DropdownItem>))}