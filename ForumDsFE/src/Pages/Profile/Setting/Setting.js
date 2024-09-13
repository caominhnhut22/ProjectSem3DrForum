import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import './Setting.css';

import { MdEdit } from "react-icons/md";
import { FaSignOutAlt }    from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { FaComments } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";

import Switch from '@mui/material/Switch';

function Setting() {
    // Call API
    useEffect(() => {
        axios.get('http://localhost:8089/user-api')
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error('Error fetching data from API:', error);
          });
      }, []);

    // ReactJS 
    const [toggle, setToggle] = useState(1);
    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    const navigate = useNavigate();

    function updateToggle(id) {
      setToggle(id)
    }

  return (
    <div className='setting-flex-container'>
        <nav className='setting-tabs'>
            <ul className='setting-ul'>
                <li className='setting-li' onClick={()=>updateToggle(1)}>Account</li>
                <li className='setting-li' onClick={()=>updateToggle(2)}>Profile</li>
                <li className='setting-li' onClick={()=>updateToggle(3)}>Feed Setting</li>
                <li className='setting-li' onClick={()=>updateToggle(4)}>Activity Log</li>
            </ul>
            <hr className='setting-hr'/>
      </nav>

      <div className={toggle === 1 ? "show-settingss" : "settingss"}>
          <h2 className='setting-h2'>Account</h2>
          <div className='form-setting'>
            <p className='setting-text'>Full Name</p>
            <div className='setting-information'>
                <p className='setting-texts'>Cao Minh Nhut</p>
                <span className='setting-edit'><MdEdit /></span>
            </div>
            <hr className='setting-hr'/>

            <p className='setting-text'>Username</p>
            <div className='setting-information'>
                <p className='setting-texts'>caominhnhut@hutech.edu.vn</p>
                <span className='setting-edit'><MdEdit /></span>
            </div>
            <hr className='setting-hr'/>

            <p className='setting-text'>Password</p>
            <div className='setting-information'>
                <p className='setting-texts'>0123456789</p>
                <span className='setting-edit'><MdEdit /></span>
            </div>
            <hr className='setting-hr'/>

            <button onClick={()=>{navigate('/login', {replace:true})}}
            className='bt-setting-logout'><FaSignOutAlt style={{ marginRight: '5px' }}/>Logout</button>
          </div>
      </div>

      <div className={toggle === 2 ? "show-settingss" : "settingss"}>
          <h2 className='setting-h2'>My Profile</h2>
          <div className='form-setting'>
            <p className='setting-text'>Full Name</p>
            <div className='setting-information'>
                <p className='setting-texts'>Cao Minh Nhut</p>
                <span className='setting-edit'><MdEdit /></span>
            </div>
            <hr className='setting-hr'/>

            <p className='setting-text'>Date of Birth</p>
            <div className='setting-information'>
                <p className='setting-texts'>July 23, 200</p>
                <span className='setting-edit'><MdEdit /></span>
            </div>
            <hr className='setting-hr'/>

            <p className='setting-text'>Student ID</p>
            <div className='setting-information'>
                <p className='setting-texts'>201401107</p>
                <span className='setting-edit'><MdEdit /></span>
            </div>
            <hr className='setting-hr'/>

            <p className='setting-text'>Class</p>
            <div className='setting-information'>
                <p className='setting-texts'>20BOIT02</p>
                <span className='setting-edit'><MdEdit /></span>
            </div>
            <hr className='setting-hr'/>

            <p className='setting-text'>Phone Numbers</p>
            <div className='setting-information'>
                <p className='setting-texts'>0963364511</p>
                <span className='setting-edit'><MdEdit /></span>
            </div>
            <hr className='setting-hr'/>

            <p className='setting-text'>Email</p>
            <div className='setting-information'>
                <p className='setting-texts'>caominhnhut@doctor.edu.vn</p>
                <span className='setting-edit'><MdEdit /></span>
            </div>
            <hr className='setting-hr'/>

            <p className='setting-text'>Faculty/Institute</p>
            <div className='setting-information'>
                <p className='setting-texts'>International DOCTOR</p>
                <span className='setting-edit'><MdEdit /></span>
            </div>
            <hr className='setting-hr'/>

            <p className='setting-text'>Program</p>
            <div className='setting-information'>
                <p className='setting-texts'>OUM</p>
                <span className='setting-edit'><MdEdit /></span>
            </div>
            <hr className='setting-hr'/>

            <p className='setting-text'>Major</p>
            <div className='setting-information'>
                <p className='setting-texts'>Information Technology</p>
                <span className='setting-edit'><MdEdit /></span>
            </div>
            <hr className='setting-hr'/>

            <p className='setting-text'>Course</p>
            <div className='setting-information'>
                <p className='setting-texts'>2020 - 2024</p>
                <span className='setting-edit'><MdEdit /></span>
            </div>
            <hr className='setting-hr'/>

          </div>
      </div>

      <div className={toggle === 3 ? "show-settingss" : "settingss"}>
          <h2 className='setting-h2'>Feed Setting</h2>
          <div className='form-setting'>
            <p className='setting-text'>View Options</p>
            <div className='setting-information'>
                <p className='setting-texts'>Dark Mode</p>
                <span className='setting-edit'><Switch {...label} defaultChecked /></span>
            </div>
            <hr className='setting-hr'/>

            <p className='setting-text'>Notification</p>
            <div className='setting-information'>
                <p className='setting-texts'>Notification status</p>
                <span className='setting-edit'><Switch {...label} defaultChecked /></span>
            </div>
            <hr className='setting-hr'/>

          </div>
      </div>

      <div className={toggle === 4 ? "show-settingss" : "settingss"}>
          <h2 className='setting-h2'>Your activities on HUTECH forum</h2>
          <div className='form-activities'>
            <div onClick={()=>{navigate('/save', {replace:true})}}
            className='activity-log'>
                <div className='Item'><FaHeart /></div>
                <p className='activity-text'>Posts you liked</p>
                <div className='Items'><FaChevronRight /></div>
            </div>

            <hr className='hr-activity-log'/>

            <div onClick={()=>{navigate('/save', {replace:true})}}
            className='activity-log'>
                <div className='Item'><FaComments /></div>
                <p className='activity-text'>Comments</p>
                <div className='Items'><FaChevronRight /></div>
            </div>

            <hr className='hr-activity-log'/>

            <div onClick={()=>{navigate('/save', {replace:true})}}
            className='activity-log'>
                <div className='Item'><FaStar /></div>
                <p className='activity-text'>Posts you've saved</p>
                <div className='Items'><FaChevronRight /></div>
            </div>

          </div>
      </div>
    </div>
  );
}

export default Setting;