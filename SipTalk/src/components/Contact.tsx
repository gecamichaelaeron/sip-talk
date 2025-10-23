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
      <h2 className="section-title">Contact Us</h2>
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
  );
});

Contact.displayName = 'Contact';

export default Contact;
