import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Save.css';

import { FaAngleDoubleLeft } from "react-icons/fa";

function Save() {

    const navigate = useNavigate();

  return (
    <div className='save-flex-containers'>
        <h1 className='save-title'> Save  </h1>
        <button onClick={()=>{navigate('/setting', {replace:true})}}
        className='bt-back'> <FaAngleDoubleLeft style={{ marginRight: '5px' }}/> Back</button>

        <div>
          <hr className='white'/>
        </div>

        <div className='save-form'>
          <div className='save-image'>
             <img  className='Simage'src="logo512.png" alt="imageEvent" width="200px" height="170px"></img>
          </div>

          <div className='save-name'>
              <h5 className='save-title'>Post title</h5>
              <p className='save-date'>Date saved: Wednesday, November 8, 2023</p>
              <p className='save-username'>Author: <span className='username'>Tran Nguyen Tien</span></p>
              <div className='save-unsave'>
                <div className='Sunsave'>Unsave</div>
                <div className='Sselect'>...</div>
              </div>
          </div>
        </div>

        <div className='save-form'>
          <div className='save-image'>
             <img  className='Simage'src="logo512.png" alt="imageEvent" width="200px" height="170px"></img>
          </div>

          <div className='save-name'>
              <h5 className='save-title'>Post title</h5>
              <p className='save-date'>Date saved: Wednesday, November 8, 2023</p>
              <p className='save-username'>Author: <span className='username'>Tran Nguyen Tien</span></p>
              <div className='save-unsave'>
                <div className='Sunsave'>Unsave</div>
                <div className='Sselect'>...</div>
              </div>
          </div>
        </div>

        <div className='save-form'>
          <div className='save-image'>
             <img  className='Simage'src="logo512.png" alt="imageEvent" width="200px" height="170px"></img>
          </div>

          <div className='save-name'>
              <h5 className='save-title'>Post title</h5>
              <p className='save-date'>Date saved: Wednesday, November 8, 2023</p>
              <p className='save-username'>Author: <span className='username'>Tran Nguyen Tien</span></p>
              <div className='save-unsave'>
                <div className='Sunsave'>Unsave</div>
                <div className='Sselect'>...</div>
              </div>
          </div>
        </div>

        <div className='save-form'>
          <div className='save-image'>
             <img  className='Simage'src="logo512.png" alt="imageEvent" width="200px" height="170px"></img>
          </div>

          <div className='save-name'>
              <h5 className='save-title'>Post title</h5>
              <p className='save-date'>Date saved: Wednesday, November 8, 2023</p>
              <p className='save-username'>Author: <span className='username'>Tran Nguyen Tien</span></p>
              <div className='save-unsave'>
                <div className='Sunsave'>Unsave</div>
                <div className='Sselect'>...</div>
              </div>
          </div>
        </div>

        <div className='save-form'>
          <div className='save-image'>
             <img  className='Simage'src="logo512.png" alt="imageEvent" width="200px" height="170px"></img>
          </div>

          <div className='save-name'>
              <h5 className='save-title'>Post title</h5>
              <p className='save-date'>Date saved: Wednesday, November 8, 2023</p>
              <p className='save-username'>Author: <span className='username'>Tran Nguyen Tien</span></p>
              <div className='save-unsave'>
                <div className='Sunsave'>Unsave</div>
                <div className='Sselect'>...</div>
              </div>
          </div>
        </div>

        <div className='save-form'>
          <div className='save-image'>
             <img  className='Simage'src="logo512.png" alt="imageEvent" width="200px" height="170px"></img>
          </div>

          <div className='save-name'>
              <h5 className='save-title'>Post title</h5>
              <p className='save-date'>Date saved: Wednesday, November 8, 2023</p>
              <p className='save-username'>Author: <span className='username'>Tran Nguyen Tien</span></p>
              <div className='save-unsave'>
                <div className='Sunsave'>Unsave</div>
                <div className='Sselect'>...</div>
              </div>
          </div>
        </div>

        <div className='save-form'>
          <div className='save-image'>
             <img  className='Simage'src="logo512.png" alt="imageEvent" width="200px" height="170px"></img>
          </div>

          <div className='save-name'>
              <h5 className='save-title'>Post title</h5>
              <p className='save-date'>Date saved: Wednesday, November 8, 2023</p>
              <p className='save-username'>Author: <span className='username'>Tran Nguyen Tien</span></p>
              <div className='save-unsave'>
                <div className='Sunsave'>Unsave</div>
                <div className='Sselect'>...</div>
              </div>
          </div>
        </div>

    </div>
  )
}

export default Save