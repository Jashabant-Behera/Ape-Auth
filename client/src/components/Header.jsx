import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import '../style/Header.css';

const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className="header">
      <h1 className="heading1">
        Yo, Code Champ! 🤝 <span className="custom-font">{userData ? userData.name : 'Cyber Primate'}</span>!
      </h1>

      <h2 className="heading2">
        It's The Wild Web Ape . . .{' '}
        {userData ? userData.name : 'But First, Prove'} You’re a Trustworthy
        Ape!
      </h2>

      <p className="caption">
        From Chimps to Champs – Access Like a Boss Ape !
      </p>

      <button className="btn"> Swing into action and get started ! </button>
    </div>
  );
};

export default Header;
