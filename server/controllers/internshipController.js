const Internship = require('../models/Internship');

// @desc    Get all internships (optionally filtering by domain)
// @route   GET /api/internships
exports.getInternships = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.domain) {
      filter.domain = req.query.domain;
    }
    const internships = await Internship.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: internships });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single internship
// @route   GET /api/internships/:id
exports.getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    res.json({ success: true, data: internship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create an internship (admin only)
// @route   POST /api/internships
exports.createInternship = async (req, res) => {
  try {
    const internship = await Internship.create(req.body);
    res.status(201).json({ success: true, data: internship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an internship (admin only)
// @route   PUT /api/internships/:id
exports.updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    res.json({ success: true, data: internship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an internship (admin only)
// @route   DELETE /api/internships/:id
exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    res.json({ success: true, message: 'Internship deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
