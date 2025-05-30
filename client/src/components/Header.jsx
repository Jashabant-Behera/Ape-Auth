import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import '../style/Header.css';
import { FaGithub } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  return (
    <div className="header">
      <a
        href="https://github.com/Jashabant-Behera/Ape-Auth"
        target="_blank"
        rel="noopener noreferrer"
        className="github-corner"
        aria-label="View source on GitHub"
      >
        <FaGithub className="github-icon" />
        <span className="tooltip-text">View Source Code</span>
      </a>
      
      <h1 className="heading1">
        Yo, Code Champ! 🤝{' '}
        <span className="custom-font">
          {userData ? userData.name : 'Cyber Primate'}
        </span>
        !
      </h1>

      <h2 className="heading2">
        It's The Wild Web Ape . . .{' '}
        {userData ? userData.name.toUpperCase() : 'But First, Prove'} You’re a
        Trustworthy Ape!
      </h2>

      <p className="caption">
        From Chimps to Champs – Access Like a Boss Ape !
      </p>

      <button onClick={() => navigate('/login')} className="btn">
        {' '}
        Swing into action and get started !{' '}
      </button>
    </div>
  );
};

export default Header;
