import { RECORD_TYPES, LINK_STATUSES, DOWNLOAD_STATUSES } from "../models/Record.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Middleware to validate record payload on Create (POST)
 */
export const validateCreateRecord = (req, res, next) => {
  const { name, email, phone, type, linkStatus, downloadStatus, dateAdded } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("Name is required and must be a non-empty string");
  }

  if (!email || typeof email !== "string" || !email.trim()) {
    errors.push("Email is required and must be a non-empty string");
  } else if (!emailRegex.test(email.trim())) {
    errors.push("Email format is invalid");
  }

  if (!phone || typeof phone !== "string" || !phone.trim()) {
    errors.push("Phone number is required");
  }

  if (type !== undefined && !RECORD_TYPES.includes(type)) {
    errors.push(`Type '${type}' is invalid. Allowed types: ${RECORD_TYPES.join(", ")}`);
  }

  if (linkStatus !== undefined && !LINK_STATUSES.includes(linkStatus)) {
    errors.push(`Link status '${linkStatus}' is invalid. Allowed: ${LINK_STATUSES.join(", ")}`);
  }

  if (downloadStatus !== undefined && !DOWNLOAD_STATUSES.includes(downloadStatus)) {
    errors.push(`Download status '${downloadStatus}' is invalid. Allowed: ${DOWNLOAD_STATUSES.join(", ")}`);
  }

  if (dateAdded !== undefined && isNaN(Date.parse(dateAdded))) {
    errors.push("DateAdded must be a valid ISO Date string or timestamp");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  next();
};

/**
 * Middleware to validate record payload on Update (PUT / PATCH)
 */
export const validateUpdateRecord = (req, res, next) => {
  const { name, email, phone, type, linkStatus, downloadStatus, dateAdded } = req.body;
  const errors = [];

  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    errors.push("Name must be a non-empty string");
  }

  if (email !== undefined) {
    if (typeof email !== "string" || !email.trim()) {
      errors.push("Email must be a non-empty string");
    } else if (!emailRegex.test(email.trim())) {
      errors.push("Email format is invalid");
    }
  }

  if (phone !== undefined && (typeof phone !== "string" || !phone.trim())) {
    errors.push("Phone number cannot be empty");
  }

  if (type !== undefined && !RECORD_TYPES.includes(type)) {
    errors.push(`Type '${type}' is invalid. Allowed types: ${RECORD_TYPES.join(", ")}`);
  }

  if (linkStatus !== undefined && !LINK_STATUSES.includes(linkStatus)) {
    errors.push(`Link status '${linkStatus}' is invalid. Allowed: ${LINK_STATUSES.join(", ")}`);
  }

  if (downloadStatus !== undefined && !DOWNLOAD_STATUSES.includes(downloadStatus)) {
    errors.push(`Download status '${downloadStatus}' is invalid. Allowed: ${DOWNLOAD_STATUSES.join(", ")}`);
  }

  if (dateAdded !== undefined && isNaN(Date.parse(dateAdded))) {
    errors.push("DateAdded must be a valid ISO Date string or timestamp");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  next();
};
