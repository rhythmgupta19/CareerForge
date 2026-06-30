import React, { useState } from 'react';
import { FiStar, FiSend, FiMessageSquare } from 'react-icons/fi';
import feedbackApi from '../api/feedbackApi';
import toast from 'react-hot-toast';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating of 1 to 5 stars.');
      return;
    }

    if (!feedbackText.trim()) {
      toast.error('Please write some feedback before submitting.');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Submitting your feedback...');

    try {
      const response = await feedbackApi.submitFeedback({
        rating,
        feedbackText: feedbackText.trim()
      });

      if (response.data.success) {
        toast.success('Thank you! Your feedback has been submitted.', { id: loadingToast });
        setRating(0);
        setFeedbackText('');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to submit feedback. Please try again.';
      toast.error(errorMsg, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextChange = (e) => {
    if (e.target.value.length <= 500) {
      setFeedbackText(e.target.value);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black tracking-tight text-[var(--text-main)]">Share Your Experience</h1>
        <p className="text-sm font-semibold text-[var(--text-muted)] mt-2">
          Your reviews and feedback help us make CareerForge a better platform for everyone.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="card p-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl shadow-lg relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[var(--primary)]/5 dark:bg-[var(--primary)]/10 rounded-full blur-2xl"></div>
          
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            {/* Header Icon */}
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-2xl border border-[var(--border)] shadow-inner">
                <FiMessageSquare />
              </div>
            </div>

            {/* Rating Star Selection */}
            <div className="text-center space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-[var(--text-main)] block">
                How would you rate CareerForge?
              </label>
              
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((starIndex) => {
                  const isStarred = starIndex <= (hoverRating || rating);
                  return (
                    <button
                      key={starIndex}
                      type="button"
                      onClick={() => setRating(starIndex)}
                      onMouseEnter={() => setHoverRating(starIndex)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-3xl sm:text-4xl transition-all duration-200 hover:scale-125 focus:outline-none cursor-pointer"
                      title={`${starIndex} Star${starIndex > 1 ? 's' : ''}`}
                    >
                      <FiStar
                        className={`transition-colors duration-200 ${
                          isStarred 
                            ? 'text-amber-500 fill-amber-500' 
                            : 'text-[var(--text-light)] hover:text-[var(--text-muted)]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              
              {rating > 0 && (
                <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  {rating === 1 && 'Needs Work 😞'}
                  {rating === 2 && 'Fair 😐'}
                  {rating === 3 && 'Good 🙂'}
                  {rating === 4 && 'Very Good 😃'}
                  {rating === 5 && 'Excellent! 😍'}
                </span>
              )}
            </div>

            {/* Written Feedback Textarea */}
            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black uppercase tracking-wider text-[var(--text-main)]">
                  Your Detailed Review
                </label>
                <span className={`text-[10px] font-bold ${feedbackText.length >= 450 ? 'text-rose-500 animate-pulse' : 'text-[var(--text-light)]'}`}>
                  {feedbackText.length} / 500
                </span>
              </div>

              <textarea
                value={feedbackText}
                onChange={handleTextChange}
                placeholder="Share your thoughts on the roadmaps, AI Mentor, and your overall learning experience..."
                rows={5}
                required
                className="w-full bg-[var(--bg-sub)] border border-[var(--border)] focus:border-[var(--primary)] rounded-2xl p-4 text-sm text-[var(--text-main)] placeholder:text-[var(--text-light)] outline-none transition-colors duration-300 resize-none shadow-inner"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-extrabold rounded-2xl text-sm transition-all shadow-[var(--shadow-bubbly)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting Review...</span>
                </>
              ) : (
                <>
                  <FiSend />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
