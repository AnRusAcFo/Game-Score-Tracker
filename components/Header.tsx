
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-neutral shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white tracking-wider">
          <i className="fas fa-gamepad mr-3 text-accent"></i>
          Game Score Tracker
        </h1>
      </div>
    </header>
  );
};

export default Header;
