import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import '../style/Home.css';

const Home = () => {
  return (
    <div className='home'>
      <Navbar />
      <Header />
    </div>
  );
};

export default Home;
