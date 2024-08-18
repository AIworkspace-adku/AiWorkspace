import React from 'react';
import Navbar from './components/navbar/Navbar';
import Hero from './components/herosection/Hero';
import Infinite from './components/infinitescroller/Infinite';
import Features from './components/features/Features';
import Testimonial from './components/testimonial/Testimonial';
import Footer from './components/footer/Footer';
import './App.css';

function App() {
  return (
    <React.StrictMode>
      <Navbar />

      <div className='hero'>
        <Hero />
      </div>
      <Infinite />


      <Features />

    </React.StrictMode>
  )
}

export default App;
