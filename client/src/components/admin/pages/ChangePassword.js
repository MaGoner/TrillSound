import React, { useState, useContext } from 'react';
import { GlobalContext } from '../../../context/global state/GlobalState';

export const ChangePassword = () => {
  const { changePassword, successMessage, errorMessage, loading } = useContext(
    GlobalContext
  );

  const [oldPasswordValue, setOldPasswordValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const makePasswordVisible = (e) => {
    const password = e.target.parentElement.previousElementSibling;
    const eyeIcon = e.target;
    if (password.type === 'password') {
      password.type = 'text';
      eyeIcon.classList.remove('fa-eye-slash');
    } else {
      password.type = 'password';
      eyeIcon.classList.add('fa-eye-slash');
    }
    eyeIcon.classList.toggle('fa-eye');
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (passwordValue !== confirmPasswordValue) {
      return setErrorMsg('Password does not match');
    }

    changePassword(oldPasswordValue, passwordValue);
  };

  return (
    <div className='admin-login-container'>
      <div>
        <div className='admin-login-form'>
          <h3 className='page-title admin artist-title'>
            <i className='fas fa-lock'></i> Change Password
          </h3>
          {/* save your admin passwords elsewhere */}
          <form onSubmit={submitForm}>
            <label htmlFor='password'>Current Password</label>
            <div className='admin-exp'>
              <input
                type='password'
                name='password'
                value={oldPasswordValue}
                onChange={(e) => setOldPasswordValue(e.target.value)}
                placeholder='Enter current password'
              />
              <div className='admin-visible'>
                <i
                  className='fas fa-eye-slash'
                  onClick={makePasswordVisible}
                ></i>
              </div>
            </div>
            <label htmlFor='password'>New Password</label>
            <div className='admin-exp'>
              <input
                type='password'
                name='password'
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                placeholder='Enter new password'
              />
              <div className='admin-visible'>
                <i
                  className='fas fa-eye-slash'
                  onClick={makePasswordVisible}
                ></i>
              </div>
            </div>
            <label htmlFor='password'>Confirm New Password</label>
            <div className='admin-exp'>
              <input
                type='password'
                name='con-password'
                value={confirmPasswordValue}
                id='password'
                onChange={(e) => setConfirmPasswordValue(e.target.value)}
                placeholder='Enter password'
              />
              <div className='admin-visible'>
                <i
                  className='fas fa-eye-slash'
                  onClick={makePasswordVisible}
                ></i>
              </div>
            </div>
            <input
              type='submit'
              name='submit'
              value={loading ? 'loading...' : 'Submit'}
              className='admin-prim-btn'
            />
            <p>
              Forgot Password? <a href='/add'>Contact Elijah</a>
            </p>
            {errorMsg && (
              <p className='page-title admin artist-title error'>{errorMsg}</p>
            )}
            {errorMessage && (
              <p className='page-title admin artist-title error'>
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className='page-title admin artist-title success'>
                {successMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
