import api from './axios';

const feedbackApi = {
  getFeedback: (rating) => api.get('/feedback', { params: rating ? { rating } : {} }),
  submitFeedback: (payload) => api.post('/feedback', payload),
  toggleFeedbackApproval: (id) => api.patch(`/feedback/${id}/toggle-approve`),
  deleteFeedback: (id) => api.delete(`/feedback/${id}`)
};

export default feedbackApi;
