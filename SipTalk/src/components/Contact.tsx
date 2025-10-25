import React, { useState, forwardRef, useImperativeHandle } from 'react';

interface ContactProps {
  onSubmit: (formData: { name: string; email: string; message: string }) => void;
}

export interface ContactHandle {
  reset: () => void;
}

const Contact = forwardRef<ContactHandle, ContactProps>(({ onSubmit }, ref) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', message: '' });
  };

  useImperativeHandle(ref, () => ({
    reset: resetForm
  }));

  return (
    <div className="container contact" id="contact">
      <div className="contact-content">
        <h2 className="section-title">Contact Us</h2>
        
        <div className="contact-info">
          <p className="contact-intro">We'd love to hear from you! Reach out through any of these channels:</p>
          
          <div className="social-links">
            <a 
              href="mailto:hello@siptalk.com" 
              className="social-link email"
              aria-label="Email us"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>hello@siptalk.com</span>
            </a>
            
            <a 
              href="https://facebook.com/siptalk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link facebook"
              aria-label="Visit our Facebook page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>@SipTalkCoffee</span>
            </a>
            
            <a 
              href="https://instagram.com/siptalk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link instagram"
              aria-label="Visit our Instagram page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>@SipTalkCoffee</span>
            </a>
          </div>
        </div>

        <form id="contactForm" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            rows={4}
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
});

Contact.displayName = 'Contact';

export default Contact;
