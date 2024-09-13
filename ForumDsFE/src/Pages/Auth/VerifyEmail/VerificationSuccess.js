import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function VerificationSuccess() {
  // Access the email information from the location state
  const location = useLocation();
  const email = location.state?.email || 'your default value if needed';
  const navigate = useNavigate();

  return (
    <section className='contact_section layout_padding'>
      <div className='container'>
        <div className="heading_container">
          <h2>
            VERIFICATION SUCCESS
          </h2>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <p>
              Your email ({email}) has been successfully verified. You can now{' '}
              <b>
                <Link
                  to={{
                    pathname: '/login',
                    state: { preFilledEmail: email }, // Pass the email as state
                  }}
                >
                  login to your account
                </Link>
              </b>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VerificationSuccess;
