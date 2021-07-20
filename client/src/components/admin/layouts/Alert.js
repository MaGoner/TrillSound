import React from 'react';

export const Alert = ({ msg, action, id }) => {
  const closeAlertModal = () => {
    window.location.reload();
  };

  return (
    <div className='alert-modal-container-ex'>
      <div className='alert-modal'>
        <p className='msg'>{msg}</p>
        <div className='options'>
          <span onClick={closeAlertModal}>No</span>
          <span
            onClick={() => {
              action(id);
              setTimeout(() => {
                closeAlertModal();
              }, 100);
            }}
          >
            Yes
          </span>
        </div>
      </div>
    </div>
  );
};
