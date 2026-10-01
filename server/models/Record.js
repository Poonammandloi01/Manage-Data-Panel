import mongoose from "mongoose";

export const RECORD_TYPES = [
  "Student",
  "Teacher",
  "Mentor",
  "Job Seeker",
  "Institute",
  "Other"
];

export const LINK_STATUSES = ["Pending", "Sent"];

export const DOWNLOAD_STATUSES = ["Pending", "Downloaded", "Completed"];

const recordSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address"
      ]
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true
    },
    address: {
      type: String,
      trim: true,
      default: ""
    },
    organisation: {
      type: String,
      trim: true,
      default: ""
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: {
        values: RECORD_TYPES,
        message: `{VALUE} is not a valid type. Allowed: ${RECORD_TYPES.join(", ")}`
      },
      default: "Student"
    },
    linkStatus: {
      type: String,
      enum: {
        values: LINK_STATUSES,
        message: `{VALUE} is not a valid link status. Allowed: ${LINK_STATUSES.join(", ")}`
      },
      default: "Pending"
    },
    downloadStatus: {
      type: String,
      enum: {
        values: DOWNLOAD_STATUSES,
        message: `{VALUE} is not a valid download status. Allowed: ${DOWNLOAD_STATUSES.join(", ")}`
      },
      default: "Pending"
    },
    dateAdded: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound and individual indexes for high query performance
recordSchema.index({ name: 1 });
recordSchema.index({ email: 1 });
recordSchema.index({ phone: 1 });
recordSchema.index({ type: 1 });
recordSchema.index({ linkStatus: 1 });
recordSchema.index({ downloadStatus: 1 });
recordSchema.index({ dateAdded: -1 });
recordSchema.index({ createdAt: -1 });

const Record = mongoose.model("Record", recordSchema);

export default Record;
