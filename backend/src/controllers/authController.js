import { User } from '../models/User.js';
import { Patient } from '../models/Patient.js';
import { Doctor } from '../models/Doctor.js';
import { generateTokens, verifyRefreshToken, generateAccessToken } from '../services/jwtService.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, dateOfBirth, gender, role = 'patient', specialization, licenseNumber, experience, consultationFee, availableDays, availableTimeStart, availableTimeEnd, bio } = req.body;
    
    if (!email || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields: firstName, lastName, email, password, phone' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    if (role === 'patient') {
      if (!dateOfBirth || !gender) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide dateOfBirth and gender' 
        });
      }
    }
    
    if (role === 'doctor') {
      if (!specialization || !licenseNumber || experience === undefined || consultationFee === undefined) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide specialization, licenseNumber, experience, and consultationFee' 
        });
      }
    }
    
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      role: role || 'patient',
      isVerified: role === 'doctor' ? false : true,
      isAdmin: false
    });
    
    if (role === 'patient') {
      await Patient.create({
        userId: user._id,
        firstName,
        lastName,
        phone,
        dateOfBirth,
        gender
      });
    } else if (role === 'doctor') {
      await Doctor.create({
        userId: user._id,
        firstName,
        lastName,
        phone,
        specialization,
        licenseNumber,
        experience: experience || 0,
        consultationFee: consultationFee || 0,
        availableDays: availableDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        availableTimeStart: availableTimeStart || '09:00',
        availableTimeEnd: availableTimeEnd || '17:00',
        bio,
        isAdmin: false,
        isVerified: false
      });
    }
    
    const tokens = generateTokens(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });
    
    const message = role === 'doctor' 
      ? 'Registration submitted. Awaiting admin verification.' 
      : 'Registration successful';
    
    res.status(201).json({
      success: true,
      message,
      data: { user: { id: user._id, email: user.email, role: user.role, isVerified: user.isVerified }, ...tokens }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message).join(', ');
      return res.status(400).json({ success: false, message: messages });
    }
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'This information is already registered' });
    }
    console.error('Registration error:', error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+refreshToken');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }
    
    if (user.role === 'doctor' && !user.isVerified && !user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Account not verified. Please contact admin.' });
    }
    
    const tokens = generateTokens(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });
    
    res.json({
      success: true,
      message: 'Login successful',
      data: { user: { id: user._id, email: user.email, role: user.role, isVerified: user.isVerified, isAdmin: user.isAdmin }, ...tokens }
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }
    
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId).select('+refreshToken');
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
    
    const tokens = generateTokens(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });
    
    res.json({ success: true, data: tokens });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};