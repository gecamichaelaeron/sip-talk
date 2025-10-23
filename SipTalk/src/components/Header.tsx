import React, { useEffect } from 'react';

const Header: React.FC = () => {
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (header) {
        if (window.scrollY > 50) {
          header.style.filter = "blur(4px)";
        } else {
          header.style.filter = "none";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header id="home">
      <div>
        <h1>Sip & Talk</h1>
        <p>Good conversations start with a sip.</p>
      </div>
    </header>
  );
};

export default Header;



