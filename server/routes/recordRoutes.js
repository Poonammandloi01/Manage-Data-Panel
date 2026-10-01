import { Router } from "express";
import {
  getRecords,
  getSummary,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  importRecords,
  bulkDeleteRecords
} from "../controllers/recordController.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import {
  validateCreateRecord,
  validateUpdateRecord
} from "../middleware/validateRecord.js";

const router = Router();

// GET /api/records - Retrieve list of records with filters/search/pagination
router.get("/", getRecords);

// GET /api/records/summary - Summary statistics (MUST be before /:id)
router.get("/summary", getSummary);

// POST /api/records/import - Bulk Excel/CSV Import (MUST be before /:id)
router.post("/import", importRecords);

// POST /api/records/bulk-delete - Bulk delete records (MUST be before /:id)
router.post("/bulk-delete", bulkDeleteRecords);

// GET /api/records/:id - Retrieve single record
router.get("/:id", validateObjectId("id"), getRecordById);

// POST /api/records - Create new record
router.post("/", validateCreateRecord, createRecord);

// PUT /api/records/:id - Update record
router.put("/:id", validateObjectId("id"), validateUpdateRecord, updateRecord);

// DELETE /api/records/:id - Delete record
router.delete("/:id", validateObjectId("id"), deleteRecord);

export default router;
