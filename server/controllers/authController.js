const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const validateEmailFormat = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};


// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!validateEmailFormat(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password,
      role: normalizedEmail === 'omshivhare666@gmail.com' ? 'admin' : (role === 'admin' ? 'student' : (role || 'student')) // Grant admin only to specific email
    });

    const token = user.generateToken();
    
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!validateEmailFormat(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' }); 
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Force admin approval for specific email
    if (user.email === 'omshivhare666@gmail.com' && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const token = user.generateToken();

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profile: user.profile,
        activeDomain: user.activeDomain,
        selectedDomain: user.activeDomain,
        domainsProgress: user.domainsProgress,
        dailyStreak: user.dailyStreak
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google Login / Registration
// @route   POST /api/auth/google
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Google token is required' });
    }

    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google token payload is missing email' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists with this googleId
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user already exists with this email (to link local account)
      user = await User.findOne({ email: normalizedEmail });
      if (user) {
        user.googleId = googleId;
        user.provider = 'google';
        if (picture && !user.avatar) {
          user.avatar = picture;
        }
        await user.save();
      } else {
        // Auto-create new student account
        user = await User.create({
          fullName: name || 'Google User',
          email: normalizedEmail,
          googleId,
          provider: 'google',
          avatar: picture || '',
          role: normalizedEmail === 'omshivhare666@gmail.com' ? 'admin' : 'student'
        });
      }
    }

    // Force admin approval for specific email
    if (user.email === 'omshivhare666@gmail.com' && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const jwtToken = user.generateToken();

    res.json({
      success: true,
      token: jwtToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profile: user.profile,
        activeDomain: user.activeDomain,
        selectedDomain: user.activeDomain,
        domainsProgress: user.domainsProgress,
        dailyStreak: user.dailyStreak
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('activeDomain')
      .populate({ path: 'earnedBadges.badgeId', populate: { path: 'domainId' } })
      .populate('assignedMentor', 'fullName email');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, profile } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone; // Allow empty string to clear phone
    
    if (profile) {
      user.profile = { 
        ...(user.profile?.toObject ? user.profile.toObject() : (user.profile || {})), 
        ...profile 
      };
      // Check if profile is complete
      const p = user.profile;
      if (profile.isProfileComplete !== undefined) {
        user.profile.isProfileComplete = profile.isProfileComplete;
      } else {
        user.profile.isProfileComplete = !!(p.currentSkillLevel && p.goal);
      }
    }

    await user.save();

    res.json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: user.profile,
        currentPhase: user.currentPhase,
        overallProgress: user.overallProgress
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

