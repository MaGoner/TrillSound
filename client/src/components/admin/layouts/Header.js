import React, { useContext } from 'react';
import { GlobalContext } from '../../../context/global state/GlobalState';

export const Header = () => {
  const { signedInAdmin } = useContext(GlobalContext);

  const toggleProfileModal = () => {
    const modalToToggle = document.querySelector('.admin-profile-info');
    const modalSupport = document.querySelector('.admin-body-container');
    const this_e = document.querySelectorAll('.alert-modal-container');
    modalToToggle.classList.toggle('open');
    modalSupport.classList.add('active');
    modalSupport.addEventListener('click', () => {
      modalSupport.classList.remove('active');
      modalToToggle.classList.remove('open');
      closeAlertModal(this_e, true);
    });
  };
  const togglePostModal = () => {
    const modalToToggle = document.querySelector('.add-post-modal');
    const modalSupport = document.querySelector('.admin-body-container');
    modalToToggle.classList.toggle('open');
    modalSupport.classList.add('active');
    modalSupport.addEventListener('click', () => {
      modalSupport.classList.remove('active');
      modalToToggle.classList.remove('open');
    });
  };

  const openAlertModal = (e) => {
    const alertModal = e.target.nextElementSibling;
    alertModal.classList.add('active');
  };

  const closeAlertModal = (e, fromFunc = false) => {
    if (fromFunc) {
      e.forEach((value) => {
        value.classList.remove('active');
      });
    } else {
      e.target.parentElement.parentElement.parentElement.classList.remove(
        'active'
      );
    }
  };

  const logout = () => {
    const date = new Date(1970, 1, 0);
    document.cookie = `_admin_token=; expires=${date.toUTCString()}`;
  };

  let admin = signedInAdmin;

  return (
    <header className='admin-header'>
      <div className='title'>
        <div className='profile'>
          <div className='admin-profile' onClick={toggleProfileModal}>
            <i className='fas fa-user'></i>
          </div>
          <div className='admin-profile-info'>
            <div className='profile-header'>
              {admin && (
                <div>
                  <div className='admin-profile exL'>
                    <i className='fas fa-user'></i>
                  </div>

                  <p>{admin.username}</p>
                  <span>{admin.zone}</span>
                </div>
              )}
            </div>
            <div className='profile-body'>
              <div className='profile-top'>
                <ul>
                  <li>
                    <i className='fas fa-pencil-alt'></i>
                    <a href='/admin/add-song'>Write a Post</a>
                  </li>
                  <li>
                    <i className='fas fa-pencil-alt'></i>
                    <a href='/admin/add-artist'>Write a Bio</a>
                  </li>
                  <li>
                    <i className='fas fa-bookmark'></i>
                    <a href='/s'>Suggest an Idea</a>
                  </li>
                </ul>
              </div>
              <div className='profile-bottom'>
                <ul>
                  <li>
                    <i className='fas fa-lock'></i>
                    <a href='/admin/change-password'>Change Password</a>
                  </li>
                  <li>
                    <i className='fas fa-sign-out-alt'></i>
                    <span onClick={openAlertModal}>Logout</span>
                    <div className='alert-modal-container'>
                      <div className='alert-modal'>
                        <p className='msg'>Are you sure you want to Logout?</p>
                        <div className='options'>
                          <span onClick={closeAlertModal}>No</span>
                          <a href='/admin' onClick={logout}>
                            Yes
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <h3>
          <a href='/admin/songs'>Dashboard</a>
        </h3>
      </div>
      <div className='header-contents admin-desktop-only'>
        <div className='new-post a'>
          <a href='/admin/add-song'>
            <span>+</span>
            <p>New Song</p>
          </a>
        </div>
        <div className='new-post b'>
          <a href='/admin/add-artist'>
            <span>+</span>
            <p>New Artist</p>
          </a>
        </div>
      </div>
      <div className='admin-mobile-only post-modal'>
        <div className='admin-profile s' onClick={togglePostModal}>
          <span>+</span>
        </div>
        <div className='add-post-modal'>
          <ul>
            <li>
              <i className='fas fa-pencil-alt'></i>
              <a href='/s'>New Post</a>
            </li>
            <li>
              <i className='fas fa-pencil-alt'></i>
              <a href='/s'>New Artist Bio</a>
            </li>
          </ul>
        </div>
      </div>
      <div className='admin-body-container'></div>
    </header>
  );
};
