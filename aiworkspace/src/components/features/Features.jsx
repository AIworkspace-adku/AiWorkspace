import React, { useEffect, useRef } from "react";
import "./Features.css";
import { features } from "../../utils/constant";

const Features = () => {
  const featureRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of the element is visible
    );

    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      featureRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="features">
      <div className="features_heading-container">
        <h2 className="h2 features_heading">
          Discover the Power of
          <span className="h2 features_text-gradient"> AiWorkspace</span>
        </h2>
        <p className="text-reg features__subheading">
          SmartNotes is packed with innovative features designed to revolutionize the way you take notes, collaborate with others, and stay organized.
        </p>
      </div>
      <div className="features__feature-container">
        {features.map((obj, i) => {
          return (
            <div
              className={`feature ${obj.gridArea}`}
              key={i}
              ref={(el) => (featureRefs.current[i] = el)}
            >
              <img
                className="feature__icon"
                src={obj.image}
                alt={obj.heading}
              />
              <p className="text-large feature__heading">{obj.heading}</p>
              <p className="text-reg feature__description">{obj.description}</p>
            </div>
          );
        })}
      </div>
      <div className="features__overlay-gradient"></div>
    </section>
  );
};

export default Features;
