import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container" id="about">
      <h2 className="section-title">About Us</h2>
      <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.8' }}>
        At Sip & Talk, we believe great coffee brings people together. Founded in 2020, we pride ourselves on
        ethically sourced beans, expert brewing methods, and creating a cozy environment where friends meet and
        ideas flow. Join us for a cup and conversation.
      </p>
    </div>
  );
};

export default About;



