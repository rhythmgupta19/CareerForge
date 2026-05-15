import axios from 'axios';

export const aiChat = async (req, res) => {
  const { message } = req.body;
  try {
    // Mock AI response for now
    const mockResponse = `This is a simulated AI response. You said: "${message}". Keep following your roadmap to succeed!`;
    res.json({ reply: mockResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
