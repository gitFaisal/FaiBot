import React from 'react';

function Navbar() {
  return (
    <nav className='navbar navbar-expand-lg bg-primary' data-bs-theme='dark'>
      <div className='container-fluid'>
        <a className='navbar-brand' href='#'>
          <i class='fa-solid fa-robot'></i>
          FaiBot
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
