import React, { useEffect } from 'react';
import Split from 'react-split';
import './Hero.css';
import rightBg from '../../../src/utils/right_bg_pics/right_bg1.png';

const Hero = ({ data }) => {
    useEffect(() => {
        const sparklesContainer = document.querySelector('.sparkles-container');
        for (let i = 0; i < 15; i++) { // Add sparkles dynamically
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.animationDelay = `${Math.random()}s`;
            sparklesContainer.appendChild(sparkle);
        }
    }, []);

    return (
        <div className="hero-container">
            <Split
                className="split"
                sizes={[45, 55]}
                minSize={200}
                expandToMin={false}
                gutterSize={10}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
                direction="horizontal"
                cursor="col-resize"
            >
                {/* Left Section */}
                <div className="land-left">
                    <h1>Workspace like No other</h1>
                    <br />
                    {!data && (
                        <button className="button">
                            <a
                                href="/signin"
                                style={{ color: 'white', textDecoration: 'none' }}
                            >
                                Signin
                            </a>
                        </button>
                    )}
                </div>

                {/* Right Section */}
                <div className="land-right">
                <div className="sparkles-container"></div>
                </div>
            </Split>
        </div>
    );
};

export default Hero;
