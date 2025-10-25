import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container" id="about">
      <div className="about-content">
        <h2 className="section-title">About Us</h2>
        <p className="about-text">
          At Sip & Talk, we believe great coffee brings people together. Founded in 2020, we pride ourselves on
          ethically sourced beans, expert brewing methods, and creating a cozy environment where friends meet and
          ideas flow. Join us for a cup and conversation.
        </p>
        <div className="about-highlights">
          <div className="highlight-item">
            <h3>☕ Quality Coffee</h3>
            <p>Ethically sourced beans from around the world</p>
          </div>
          <div className="highlight-item">
            <h3>🤝 Community</h3>
            <p>A welcoming space for everyone</p>
          </div>
          <div className="highlight-item">
            <h3>💡 Ideas Flow</h3>
            <p>Where creativity meets conversation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;



