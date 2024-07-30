const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Allow cross-origin requests
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://Adem:TtvdnoNEk4jE2PBm@cluster0.4edihyj.mongodb.net/users?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Data Models
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'admin' }, // 'patient' or 'admin'
});

const appointmentSchema = new mongoose.Schema({
  patientName: String,
  date: String,
  time: String,
  description: String,
  status: { type: String, default: 'pending' },
});

const User = mongoose.model('User', userSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token is required');

  jwt.verify(token.split(' ')[1], 'YOUR_SECRET_KEY', (err, decoded) => {
    if (err) return res.status(401).send('Invalid token');
    req.user = decoded;
    next();
  });
};

// Register User
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, 'YOUR_SECRET_KEY');
    res.status(201).send({ token });
  } catch (err) {
    res.status(500).send('Error registering user');
  }
});

// Login User
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user._id, role: user.role }, 'YOUR_SECRET_KEY');
    res.send({ token });
  } catch (err) {
    res.status(500).send('Error logging in');
  }
});

// Create New Appointment
app.post('/appointments', verifyToken, async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).send(appointment);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get All Appointments (for Admin)
app.get('/admin/appointments', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied');

  try {
    const appointments = await Appointment.find();
    res.send(appointments);
  } catch (err) {
    res.status(500).send(err);
  }
});

// View Patient Appointments (for Doctor)
app.get('/doctor/appointments', verifyToken, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).send('Access denied');

  try {
    const appointments = await Appointment.find();
    res.send(appointments);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Approve/Reject Appointment
app.patch('/appointments/:id/status', verifyToken, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).send('Access denied');

  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) return res.status(404).send('Appointment not found');
    res.send(appointment);
  } catch (err) {
    res.status(400).send(err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
