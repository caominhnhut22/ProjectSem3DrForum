// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import { jwtDecode } from 'jwt-decode';
// import 'react-toastify/dist/ReactToastify.css';
// import './App.css';

// import Navbar from './Components/Navbar/Navbar';
// import Footer from './Components/Footer/Footer';
// import Login from './Pages/Auth/Login/Login';
// import AdminLogin from './Pages/Auth/AdminLogin/AdminLogin';
// import Homepage from './Pages/Home/Homepage/Homepage';
// import CreatePost from './Pages/Post/CreatePost/CreatePost';
// import EditPost from './Pages/Post/EditPost/EditPost';
// import EditProfile from './Pages/Post/EditProfile/EditProfile';
// import PersonalPage from './Pages/Profile/PersonalPage/PersonalPage';
// import Personal from './Pages/Profile/Personal/Personal';
// import Setting from './Pages/Profile/Setting/Setting';
// import Save from './Pages/Post/Save/Save';
// import ForgotPassword from './Pages/Auth/ForgotPassword/ForgotPassword';
// import CreateAccount from './Pages/Auth/CreateAccount/CreateAccount';
// import ChangePassword from './Pages/Auth/ChangePassword/ChangePassword';
// import VerifyEmail from './Pages/Auth/VerifyEmail/VerifyEmail';
// import VerificationSuccess from './Pages/Auth/VerifyEmail/VerificationSuccess';
// import DetailsPage from './Pages/Post/DetailsPage/DetailsPage';
// import SpecDetails from './Pages/Post/SpecDetails/SpecDetails';
// import Post from './Pages/Post/Post/Post';
// import Specializations from './Pages/Post/Specializations/Specializations';

// import Unauthorized from './Pages/Error/Unauthorized/Unauthorized'; 
// import NotFound from './Pages/Error/NotFound/NotFound'; 

// import AdminDashboard from './Pages/Admin/AdminDashboard/AdminDashboard';
// import PostManagement from './Pages/Admin/PostManagement/PostManagement';
// import UserManagement from './Pages/Admin/UserManagement/UserManagement';
// import SpecManagement from './Pages/Admin/SpecManagement/SpecManagement';
// import SpecCreate from './Pages/Admin/SpecManagement/SpecCreate';
// import SpecEdit from './Pages/Admin/SpecManagement/SpecEdit';

// import AdminRoute from './Components/Route/AdminRoute';
// import ProtectedRoute from './Components/Route/ProtectedRoute';
// import LoginRoute from './Components/Route/LoginRoute';

// function App() {
//   const [isNavbarVisible, setIsNavbarVisible] = useState(true);
//   const [isFooterVisible, setIsFooterVisible] = useState(true);

//   const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('accessToken');
//     console.log('Token value:', token); // Log token value
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         const role = decodedToken['Role'];
//         setIsAdminLoggedIn(role === 'Admin');
//       } catch (error) {
//         console.error('Error decoding token:', error);
//       }
//     }
//   }, []);

//   const AdminOnlyRoute = ({ element }) => {
//     console.log('Checking isAdminLoggedIn:', isAdminLoggedIn);
//     if (!isAdminLoggedIn) {
//       console.log('Redirecting to /unauthorized');
//       return <Navigate to="/unauthorized" />;
//     }
//     return element;
//   };

//   return (
//     <Router>
//       {isNavbarVisible && <Navbar setIsNavbarVisible={setIsNavbarVisible} />}
//       <Routes>
//         <Route path="/" element={<AdminOnlyRoute element={<Homepage setIsNavbarVisible={setIsNavbarVisible} />} />} />
//         <Route path="/specializations" element={<AdminOnlyRoute element={<Specializations setIsNavbarVisible={setIsNavbarVisible} />} />} />
//         <Route path="/post" element={<AdminOnlyRoute element={<Post setIsNavbarVisible={setIsNavbarVisible} />} />} />

//         <Route path="/login" element={<LoginRoute element={<Login setIsNavbarVisible={setIsNavbarVisible}/>} />} />
//         <Route path="/adminlogin" element={<LoginRoute element={<AdminLogin setIsNavbarVisible={setIsNavbarVisible}/>} />} />

//         <Route path="/forgotpassword" element={<AdminOnlyRoute element={<ForgotPassword />} />} />
//         <Route path="/createaccount" element={<AdminOnlyRoute element={<CreateAccount />} />} />
//         <Route path="/verify-email" element={<AdminOnlyRoute element={<VerifyEmail setIsNavbarVisible={setIsNavbarVisible} />} />} />
//         <Route path="/verification-success" element={<AdminOnlyRoute element={<VerificationSuccess />} />} />

//         <Route path="/tien" element={<AdminOnlyRoute element={<Personal />} />} />
//         <Route path="/details/:id" element={<AdminOnlyRoute element={<DetailsPage />} />} />
//         <Route path="/specdetails/:id" element={<AdminOnlyRoute element={<SpecDetails />} />} />
//         <Route path="/setting" element={<AdminOnlyRoute element={<Setting />} />} />
//         <Route path="/save" element={<AdminOnlyRoute element={<Save />} />} />

//         <Route path="/unauthorized" element={<Unauthorized setIsNavbarVisible={setIsNavbarVisible} setIsFooterVisible={setIsFooterVisible}/>} />
        
//         <Route path="/createpost" element={<ProtectedRoute element={<CreatePost />} />} />
//         <Route path="/editpost/:id" element={<ProtectedRoute element={<EditPost />} />} />
//         <Route path="/changepassword/:id" element={<ProtectedRoute element={<ChangePassword />} />} />
//         <Route path="/editprofile/:id" element={<ProtectedRoute element={<EditProfile />} />} />
//         <Route path="/personal" element={<ProtectedRoute element={<PersonalPage />} />} />

//         <Route
//           path="/admin/*"
//           element={
//             <AdminRoute
//               setIsNavbarVisible={setIsNavbarVisible} setIsFooterVisible={setIsFooterVisible}
//               element={
//                 <Routes>
//                   <Route path="/" element={<AdminDashboard setIsNavbarVisible={setIsNavbarVisible} setIsFooterVisible={setIsFooterVisible} />} />
//                   <Route path="/postmanage" element={<PostManagement  setIsNavbarVisible={setIsNavbarVisible} setIsFooterVisible={setIsFooterVisible} />} />
//                   <Route path="/usermanage" element={<UserManagement  setIsNavbarVisible={setIsNavbarVisible} setIsFooterVisible={setIsFooterVisible} />} />
//                   <Route path="/specmanage" element={<SpecManagement  setIsNavbarVisible={setIsNavbarVisible} setIsFooterVisible={setIsFooterVisible} />} />
//                   <Route path="/speccreate" element={<SpecCreate  setIsNavbarVisible={setIsNavbarVisible} setIsFooterVisible={setIsFooterVisible} />} />
//                   <Route path="/specedit/:id" element={<SpecEdit  setIsNavbarVisible={setIsNavbarVisible} setIsFooterVisible={setIsFooterVisible} />} />
//                 </Routes>
//               }
//             />
//           }
//         />

//         <Route path="*" element={<NotFound />} />
//       </Routes>
      
//       {isFooterVisible && <Footer setIsFooterVisible={setIsFooterVisible} />}
//       <ToastContainer />
//     </Router>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Login from './Pages/Auth/Login/Login';
import AdminLogin from './Pages/Auth/AdminLogin/AdminLogin';
import Homepage from './Pages/Home/Homepage/Homepage';
import CreatePost from './Pages/Post/CreatePost/CreatePost';
import EditPost from './Pages/Post/EditPost/EditPost';
import EditProfile from './Pages/Post/EditProfile/EditProfile';
import PersonalPage from './Pages/Profile/PersonalPage/PersonalPage';
import Personal from './Pages/Profile/Personal/Personal';
import Setting from './Pages/Profile/Setting/Setting';
import Save from './Pages/Post/Save/Save';
import ForgotPassword from './Pages/Auth/ForgotPassword/ForgotPassword';
import CreateAccount from './Pages/Auth/CreateAccount/CreateAccount';
import ChangePassword from './Pages/Auth/ChangePassword/ChangePassword';
import VerifyEmail from './Pages/Auth/VerifyEmail/VerifyEmail';
import VerificationSuccess from './Pages/Auth/VerifyEmail/VerificationSuccess';
import DetailsPage from './Pages/Post/DetailsPage/DetailsPage';
import SpecDetails from './Pages/Post/SpecDetails/SpecDetails';
import Post from './Pages/Post/Post/Post';
import Specializations from './Pages/Post/Specializations/Specializations';

import Unauthorized from './Pages/Error/Unauthorized/Unauthorized'; 
import NotFound from './Pages/Error/NotFound/NotFound';

import AdminDashboard from './Pages/Admin/AdminDashboard/AdminDashboard';
import PostManagement from './Pages/Admin/PostManagement/PostManagement';
import UserManagement from './Pages/Admin/UserManagement/UserManagement';
import SpecManagement from './Pages/Admin/SpecManagement/SpecManagement';
import SpecCreate from './Pages/Admin/SpecManagement/SpecCreate';
import SpecEdit from './Pages/Admin/SpecManagement/SpecEdit';

import AdminRoute from './Components/Route/AdminRoute';
import ProtectedRoute from './Components/Route/ProtectedRoute';
import LoginRoute from './Components/Route/LoginRoute';

function App() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(true);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('Token value:', token); // Log token value
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const role = decodedToken['Role'];
        setIsAdminLoggedIn(role === 'Admin');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  return (
    <Router>
      {isNavbarVisible && <Navbar setIsNavbarVisible={setIsNavbarVisible} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage setIsNavbarVisible={setIsNavbarVisible} />} />
        <Route path="/specializations" element={<Specializations setIsNavbarVisible={setIsNavbarVisible} />} />
        <Route path="/post" element={<Post setIsNavbarVisible={setIsNavbarVisible} />} />
        <Route path="/login" element={<LoginRoute element={<Login setIsNavbarVisible={setIsNavbarVisible}/>} />} />
        <Route path="/adminlogin" element={<LoginRoute element={<AdminLogin setIsNavbarVisible={setIsNavbarVisible}/>} />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/verify-email" element={<VerifyEmail setIsNavbarVisible={setIsNavbarVisible} />} />
        <Route path="/verification-success" element={<VerificationSuccess />} />
        <Route path="/tien" element={<Personal />} />
        <Route path="/details/:id" element={<DetailsPage />} />
        <Route path="/specdetails/:id" element={<SpecDetails />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/save" element={<Save />} />
        <Route path="/unauthorized" element={<Unauthorized setIsNavbarVisible={setIsNavbarVisible} setIsFooterVisible={setIsFooterVisible}/>} />

        {/* Protected Routes */}
        <Route path="/createpost" element={<ProtectedRoute element={<CreatePost />} />} />
        <Route path="/editpost/:id" element={<ProtectedRoute element={<EditPost />} />} />
        <Route path="/changepassword/:id" element={<ProtectedRoute element={<ChangePassword />} />} />
        <Route path="/editprofile/:id" element={<ProtectedRoute element={<EditProfile />} />} />
        <Route path="/personal" element={<ProtectedRoute element={<PersonalPage />} />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <AdminRoute
            setIsNavbarVisible={setIsNavbarVisible} setIsFooterVisible={setIsFooterVisible}
            element={
              <Routes>
                <Route path="/" element={<AdminDashboard setIsNavbarVisible={setIsNavbarVisible} setIsFooterVisible={setIsFooterVisible} />} />
                <Route path="/postmanage" element={<PostManagement  setIsNavbarVisible={setIsNavbarVisible} setIsFooterVisible={setIsFooterVisible} />} />
                <Route path="/usermanage" element={<UserManagement  setIsNavbarVisible={setIsNavbarVisible} setIsFooterVisible={setIsFooterVisible} />} />
                <Route path="/specmanage" element={<SpecManagement  setIsNavbarVisible={setIsNavbarVisible} setIsFooterVisible={setIsFooterVisible} />} />
                <Route path="/speccreate" element={<SpecCreate  setIsNavbarVisible={setIsNavbarVisible} setIsFooterVisible={setIsFooterVisible} />} />
                <Route path="/specedit/:id" element={<SpecEdit  setIsNavbarVisible={setIsNavbarVisible} setIsFooterVisible={setIsFooterVisible} />} />
              </Routes>
            }
          />
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {isFooterVisible && <Footer setIsFooterVisible={setIsFooterVisible} />}
      <ToastContainer />
    </Router>
  );
}

export default App;

