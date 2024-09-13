import React from 'react';
import './NotFound.css'; // Import the CSS file

const NotFound = () => {
  return (
    <div className="container-notfound">
      <h1 className='h1-notfound'>Not Found</h1>
      <h1 className='h1-notfound'>404</h1>
      <p className='p-notfound'>The requested page could not be found.</p>
    </div>
  );
};

export default NotFound;
