import React from 'react';
import { useNavigate } from 'react-router-dom'
import './ForgotPassword.css';

function ForgotPassword() {

    const navigate = useNavigate();

  return (
    <div className='forgot-password-flex-container'>
        <div className='form-forgot-password'>
            <h4>Forgot Password ?</h4>
            <hr className='hr-forgot-password'/>
            <p className='text-forgot-password'>Please enter your student email to change your new password.</p>
            <form>
                <input className='input-forgot-password'
                       type="text" 
                       placeholder="Enter email"/>
            </form>
            <hr className='hr-forgot-password'/>
            <div className='button-forgot-password'>
                <button onClick={()=>{navigate('/login', {replace:true})}}
                className='bt-cancel-forgot-password'>Cancel</button>
                <button className='bt-submit-forgot-password'>Submit</button>
            </div>
        </div>
        
    </div>
  );
}

export default ForgotPassword;