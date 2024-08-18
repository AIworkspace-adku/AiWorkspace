import React from 'react';
import './Infinite.css';
import { logos } from '../../utils/constant';

const Infinite = () => {
  return <section className="logos">
    <div className="logo_slide">
      {logos.map((img, i)=>(
        <img src={img} alt="logo" className="logo" key={i} />
      ))}
      {logos.map((img, i)=>(
        <img src={img} alt="logo" className="logo" key={i} />
      ))}
    </div>
    <div className='logos_overlay logos_overlay_left'></div>
    <div className='logos_overlay logos_overlay_right'></div>
  </section>
}

export default Infinite;
