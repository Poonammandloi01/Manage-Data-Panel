import { recordService } from "../services/recordService.js";

/**
 * Controller for Record CRUD operations and summary analytics
 */

/**
 * GET /api/records
 * Retrieve paginated records with optional filters, search, and sorting
 */
export const getRecords = async (req, res, next) => {
  try {
    const result = await recordService.getRecords(req.query);
    return res.status(200).json({
      success: true,
      message: "Records fetched successfully",
      data: result.records,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/records/summary
 * Retrieve MongoDB-generated aggregated summary counts
 */
export const getSummary = async (req, res, next) => {
  try {
    const summary = await recordService.getSummary();
    return res.status(200).json({
      success: true,
      message: "Summary statistics retrieved successfully",
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/records/:id
 * Retrieve a single record by MongoDB ObjectId
 */
export const getRecordById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await recordService.getRecordById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: `Record not found with ID: ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Record retrieved successfully",
      data: record
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/records
 * Create a new record
 */
export const createRecord = async (req, res, next) => {
  try {
    const newRecord = await recordService.createRecord(req.body);
    return res.status(201).json({
      success: true,
      message: "Record created successfully",
      data: newRecord
    });
  } catch (error) {
    // Handle Mongoose duplicate key or validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages
      });
    }
    next(error);
  }
};

/**
 * PUT /api/records/:id
 * Update an existing record
 */
export const updateRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedRecord = await recordService.updateRecord(id, req.body);

    if (!updatedRecord) {
      return res.status(404).json({
        success: false,
        message: `Cannot update. Record not found with ID: ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: updatedRecord
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages
      });
    }
    next(error);
  }
};

/**
 * DELETE /api/records/:id
 * Delete a single record by ID
 */
export const deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedRecord = await recordService.deleteRecord(id);

    if (!deletedRecord) {
      return res.status(404).json({
        success: false,
        message: `Cannot delete. Record not found with ID: ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Record deleted successfully",
      data: { id: deletedRecord._id }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/records/bulk-delete
 * Bulk delete multiple records
 */
export const bulkDeleteRecords = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload: 'ids' must be a non-empty array."
      });
    }

    const result = await recordService.bulkDeleteRecords(ids);

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} records deleted successfully.`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/records/import
 * Bulk import validated records into MongoDB
 */
export const importRecords = async (req, res, next) => {
  try {
    const { records } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload: 'records' field is required and must be a non-empty array."
      });
    }

    const result = await recordService.importRecords(records);

    return res.status(200).json({
      success: true,
      message: `Import processed: ${result.importedCount} records imported, ${result.failedCount} records failed.`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
