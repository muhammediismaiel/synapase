import mongoose from 'mongoose';

/**
 * Appointment Schema for booking technology services
 */
const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: {
      values: ['web', 'network', 'security', 'cameras'],
      message: 'Service type must be one of: web, network, security, cameras'
    }
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Appointment date cannot be in the past'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'completed', 'cancelled'],
      message: 'Status must be one of: pending, confirmed, completed, cancelled'
    },
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ serviceType: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ phone: 1 });

// Prevent double booking for the same date and time
appointmentSchema.index({ appointmentDate: 1, phone: 1 }, { unique: true });

// Pre-save middleware to update the updatedAt field
appointmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for formatted appointment date
appointmentSchema.virtual('formattedDate').get(function() {
  return this.appointmentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

export const Appointment = mongoose.model('Appointment', appointmentSchema);
