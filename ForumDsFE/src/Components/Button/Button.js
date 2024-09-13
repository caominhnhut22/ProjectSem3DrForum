// // Button.js
// import React from 'react';
// import './Button.css';
// import { Link } from 'react-router-dom';

// export function Button({ isLoggedIn, handleLogout, user }) {
//   if (isLoggedIn) {
//     return (
//       <button className='btn login-button' onClick={handleLogout}>
//         Logout, {user && user.username}
//       </button>
//     );
//   } else {
//     return (
//       <Link to='/login'>
//         <button className='btn login-button'>Login</button>
//       </Link>
//     );
//   }
// }