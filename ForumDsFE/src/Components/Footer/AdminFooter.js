// AdminHeader.js
import React from 'react';
import { useAuth } from '../../Contexts/AuthProvider';

function AdminFooter() {
  const { isAdmin } = useAuth();

  return (
    <div>
      {isAdmin && <p>Admin AdminFooter Content</p>}
      {/* Additional admin header content */}
    </div>
  );
}

export default AdminFooter;
