import mongoose from "mongoose";

/**
 * Middleware to validate MongoDB ObjectId in URL params
 */
export const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format: '${id}'. Must be a valid 24-character hexadecimal MongoDB ObjectId.`
      });
    }
    next();
  };
};
