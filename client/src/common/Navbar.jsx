import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";
import Swal from 'sweetalert2';

const Navbar = () => {
  const [image, setImage] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchImage = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found in localStorage");
        return;
      };

      try {
        const response = await axios.get('http://localhost:8000/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && response.data.body && response.data.body.image) {
          setImage(`http://localhost:8000/${response.data.body.image}`);
        }
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };

    fetchImage();
  }, []);

  const logout = async () => {
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!',
    });

    if (result.isConfirmed) {
      try {
        await axios.post('http://localhost:8000/logout');
        localStorage.removeItem('token');
        navigate('/');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
  };
  
  return (
    <div id="app">
      <div className="main-wrapper">
        <div className="navbar-bg" />
        <nav className="navbar navbar-expand-lg main-navbar">
          <form className="form-inline mr-auto">
            <ul className="navbar-nav mr-3">
              <li>
                <Link to="#" data-toggle="sidebar" className="nav-link nav-link-lg">
                  <i className="fas fa-bars" />
                </Link>
              </li>
            </ul>
          </form>

        </nav>
      </div>
    </div>
  );
};

export default Navbar;
