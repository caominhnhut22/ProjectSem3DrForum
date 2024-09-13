import React, { useEffect } from 'react';

function UserManagement({ setIsNavbarVisible, setIsFooterVisible }) {

    useEffect(() => {
        setIsNavbarVisible(false);
        setIsFooterVisible(false);
    }, [setIsNavbarVisible, setIsFooterVisible]);

    return (
        <div>
            vvv
        </div>
    );
}

export default UserManagement;