import React from 'react';
import Spline from '@splinetool/react-spline';
import Split from 'react-split';
import './Hero.css';

const Hero = () => {
  return (
    <div className="hero-container">
      <Split className="split" sizes={[45, 55]} minSize={200} expandToMin={false} gutterSize={10} gutterAlign="center" snapOffset={30} dragInterval={1} direction="horizontal" cursor="col-resize">
        <div className="land-left">
          <h1>Workspace like No other</h1>
        </div>
        <div className="land-right">
          <Spline
            scene="https://prod.spline.design/ovoLpMM5FYMjDtjF/scene.splinecode"
            width={1000}
            height={1000}
          />
        </div>
      </Split>
    </div>
  );
};

export default Hero;
