import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../../context/global state/GlobalState';

export const Register = () => {
  const { register, errorMessage, successMessage, loading } = useContext(
    GlobalContext
  );

  const [usernameValue, setUsernameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [zoneValue, setZoneValue] = useState('');
  const [socialHandleValue, setSocialHandleValue] = useState('');
  const [adminAuthValue, setAdminAuthValue] = useState('');

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

    if (!usernameValue || !passwordValue || !zoneValue || !adminAuthValue)
      return;

    register(
      usernameValue,
      passwordValue,
      zoneValue,
      socialHandleValue,
      adminAuthValue
    );
  };

  return (
    <div className='admin-login-container'>
      <div>
        <div className='admin-login-form'>
          <h3 className='page-title admin artist-title'>
            <i className='fas fa-sign-in-alt'></i> Register
          </h3>
          <form onSubmit={submitForm}>
            <label htmlFor='username'>Username - your display name</label>
            <input
              type='text'
              name='username'
              value={usernameValue}
              onChange={(e) => setUsernameValue(e.target.value)}
              placeholder='Enter username'
              required
            />
            <label htmlFor='zone'>Zone</label>
            <input
              type='text'
              name='zone'
              value={zoneValue}
              onChange={(e) => setZoneValue(e.target.value)}
              placeholder='Enter zone e.g Lagos Zone 2'
              required
            />
            <label htmlFor='socialHandle'>Social Media Link</label>
            <input
              type='url'
              name='socialHandle'
              value={socialHandleValue}
              onChange={(e) => setSocialHandleValue(e.target.value)}
              placeholder='Enter social media link'
              required
            />
            <label htmlFor='password'>Password</label>
            <div className='admin-exp'>
              <input
                type='password'
                name='password'
                value={passwordValue}
                id='password'
                onChange={(e) => setPasswordValue(e.target.value)}
                placeholder='Enter password'
                required
              />
              <div className='admin-visible'>
                <i
                  className='fas fa-eye-slash'
                  onClick={makePasswordVisible}
                ></i>
              </div>
            </div>
            <label htmlFor='admin-auth'>Admin Authentication</label>
            <div className='admin-exp'>
              <input
                type='password'
                name='admin-auth'
                value={adminAuthValue}
                id='password2'
                onChange={(e) => setAdminAuthValue(e.target.value)}
                placeholder='Enter admin authentication'
                required
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
              className='admin-prim-btn'
              value={loading ? 'loading...' : 'Submit'}
            />
          </form>
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
        </div>
      </div>
    </div>
  );
};
