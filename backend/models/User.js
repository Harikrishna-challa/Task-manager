// backend/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    trim: true,
    maxLength: [20, 'Name cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'please enter your email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [
      {
        validator: (value) => {
          const re = /^([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+)\.([a-zA-Z0-9-.]+)$/;
          return re.test(value);
        },
        message: 'Please enter a valid email address'
      }
    ]
  },
  password: {
    type: String,
    required: [true, 'please enter your password'],
    minLength: [6, 'password should be at least 6 characters'],
    select: false  // Exclude password from queries by default
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
}, { timestamps: true });

/**
 * Pre-save hook: hashes the password if it has been modified.
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();  // skip if password field wasn't changed
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method: compares a plaintext password
 * to the stored (hashed) password.
 *
 * @param {string} candidatePassword — the plaintext to check
 * @returns {Promise<boolean>} — true if match, false otherwise
 */
userSchema.methods.comparePassword = function(candidatePassword) {
  // `this.password` is available because we select it explicitly in login
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
