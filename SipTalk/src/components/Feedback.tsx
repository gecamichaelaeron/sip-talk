import React, { useState, forwardRef, useImperativeHandle } from 'react';

interface FeedbackProps {
  onSubmit: (formData: { name: string; rating: string; message: string }) => void;
}

export interface FeedbackHandle {
  reset: () => void;
}

const Feedback = forwardRef<FeedbackHandle, FeedbackProps>(({ onSubmit }, ref) => {
  const [formData, setFormData] = useState({
    name: '',
    rating: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({ name: '', rating: '', message: '' });
  };

  useImperativeHandle(ref, () => ({
    reset: resetForm
  }));

  return (
    <div className="container" id="feedback">
      <div className="feedback">
        <h2 className="section-title">Customer Feedback</h2>
        <form id="feedbackForm" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name (optional)"
            value={formData.name}
            onChange={handleChange}
          />
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
          >
            <option value="">Rate Us</option>
            <option value="5">★★★★★ Excellent</option>
            <option value="4">★★★★ Very Good</option>
            <option value="3">★★★ Good</option>
            <option value="2">★★ Needs Improvement</option>
            <option value="1">★ Poor</option>
          </select>
          <textarea
            rows={4}
            name="message"
            placeholder="Your feedback..."
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
});

Feedback.displayName = 'Feedback';

export default Feedback;
