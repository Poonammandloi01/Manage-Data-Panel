import Record from "../models/Record.js";

/**
 * Safe helper to escape regex special characters and prevent ReDoS
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Service to handle Record database operations
 */
export const recordService = {
  /**
   * Get all records with filtering, search, pagination, and sorting
   */
  getRecords: async (query = {}) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const {
      search,
      type,
      linkStatus,
      downloadStatus,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = query;

    const filter = {};

    // Global Safe Search across name, email, phone, organisation
    if (search && search.trim()) {
      const safeSearch = escapeRegex(search.trim());
      const searchRegex = new RegExp(safeSearch, "i");
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { organisation: searchRegex }
      ];
    }

    // Type / Category Filter (supports single value or comma-separated list)
    if (type && type.trim()) {
      const types = type.split(",").map((t) => t.trim()).filter(Boolean);
      if (types.length === 1) {
        filter.type = types[0];
      } else if (types.length > 1) {
        filter.type = { $in: types };
      }
    }

    // Link Status Filter
    if (linkStatus && linkStatus.trim()) {
      filter.linkStatus = linkStatus.trim();
    }

    // Download Status Filter
    if (downloadStatus && downloadStatus.trim()) {
      filter.downloadStatus = downloadStatus.trim();
    }

    // Date Range Filter on dateAdded
    if (startDate || endDate) {
      filter.dateAdded = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          start.setHours(0, 0, 0, 0);
          filter.dateAdded.$gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          filter.dateAdded.$lte = end;
        }
      }
    }

    // Determine Sort Options
    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "dateAdded",
      "name",
      "email",
      "phone",
      "type",
      "linkStatus",
      "downloadStatus"
    ];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortDirection = sortOrder.toLowerCase() === "asc" ? 1 : -1;

    const [records, totalRecords] = await Promise.all([
      Record.find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .lean(),
      Record.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalRecords / limit) || 1;

    return {
      records,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  },

  /**
   * Get MongoDB-generated summary counts
   */
  getSummary: async () => {
    const [allData, students, teachers, institutes] = await Promise.all([
      Record.countDocuments({}),
      Record.countDocuments({ type: "Student" }),
      Record.countDocuments({ type: "Teacher" }),
      Record.countDocuments({ type: "Institute" })
    ]);

    return {
      allData,
      students,
      teachers,
      institutes
    };
  },

  /**
   * Get a single record by MongoDB ObjectId
   */
  getRecordById: async (id) => {
    return await Record.findById(id).lean();
  },

  /**
   * Create a new record
   */
  createRecord: async (recordData) => {
    const record = new Record(recordData);
    return await record.save();
  },

  /**
   * Update an existing record by ID
   */
  updateRecord: async (id, updateData) => {
    return await Record.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
  },

  /**
   * Delete a record by ID
   */
  deleteRecord: async (id) => {
    return await Record.findByIdAndDelete(id).lean();
  },

  /**
   * Bulk delete records by an array of MongoDB IDs
   */
  bulkDeleteRecords: async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error("Invalid payload: 'ids' must be a non-empty array of IDs");
    }
    const result = await Record.deleteMany({ _id: { $in: ids } });
    return {
      deletedCount: result.deletedCount
    };
  },

  /**
   * Bulk import validated records into MongoDB
   */
  importRecords: async (recordsArray) => {
    if (!Array.isArray(recordsArray) || recordsArray.length === 0) {
      throw new Error("Invalid payload: 'records' must be a non-empty array");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allowedTypes = [
      "Student",
      "Teacher",
      "Mentor",
      "Job Seeker",
      "Institute",
      "Other"
    ];
    const allowedLinkStatuses = ["Pending", "Sent"];
    const allowedDownloadStatuses = ["Pending", "Downloaded", "Completed"];

    const validRecords = [];
    const errors = [];
    const seenEmailsInBatch = new Set();

    for (let index = 0; index < recordsArray.length; index++) {
      const item = recordsArray[index];
      const rowNum = index + 1;
      const rowErrors = [];

      // Validate Name
      if (!item.name || typeof item.name !== "string" || !item.name.trim()) {
        rowErrors.push("Missing or invalid Name");
      }

      // Validate Email
      if (!item.email || typeof item.email !== "string" || !item.email.trim()) {
        rowErrors.push("Missing Email");
      } else {
        const cleanEmail = item.email.trim().toLowerCase();
        if (!emailRegex.test(cleanEmail)) {
          rowErrors.push(`Invalid email format: '${cleanEmail}'`);
        } else if (seenEmailsInBatch.has(cleanEmail)) {
          rowErrors.push(`Duplicate email within batch: '${cleanEmail}'`);
        } else {
          seenEmailsInBatch.add(cleanEmail);
        }
      }

      // Validate Phone
      if (!item.phone || (typeof item.phone !== "string" && typeof item.phone !== "number") || !String(item.phone).trim()) {
        rowErrors.push("Missing Phone number");
      }

      // Validate & Normalize Type
      let normalizedType = "Student";
      if (item.type && typeof item.type === "string") {
        const matchingType = allowedTypes.find(
          (t) => t.toLowerCase() === item.type.trim().toLowerCase()
        );
        if (matchingType) {
          normalizedType = matchingType;
        } else {
          rowErrors.push(`Invalid category type: '${item.type}'`);
        }
      }

      // Validate & Normalize Link Status
      let normalizedLinkStatus = "Pending";
      if (item.linkStatus && typeof item.linkStatus === "string") {
        const matchingLink = allowedLinkStatuses.find(
          (s) => s.toLowerCase() === item.linkStatus.trim().toLowerCase()
        );
        if (matchingLink) {
          normalizedLinkStatus = matchingLink;
        } else {
          rowErrors.push(`Invalid link status: '${item.linkStatus}'`);
        }
      }

      // Validate & Normalize Download Status
      let normalizedDownloadStatus = "Pending";
      if (item.downloadStatus && typeof item.downloadStatus === "string") {
        const matchingDownload = allowedDownloadStatuses.find(
          (s) => s.toLowerCase() === item.downloadStatus.trim().toLowerCase()
        );
        if (matchingDownload) {
          normalizedDownloadStatus = matchingDownload;
        } else {
          rowErrors.push(`Invalid download status: '${item.downloadStatus}'`);
        }
      }

      // Date parsing
      let parsedDateAdded = new Date();
      if (item.dateAdded) {
        const d = new Date(item.dateAdded);
        if (!isNaN(d.getTime())) {
          parsedDateAdded = d;
        }
      }

      if (rowErrors.length > 0) {
        errors.push({
          row: rowNum,
          name: item.name || "N/A",
          email: item.email || "N/A",
          errors: rowErrors
        });
      } else {
        validRecords.push({
          name: item.name.trim(),
          email: item.email.trim().toLowerCase(),
          phone: String(item.phone).trim(),
          address: item.address ? String(item.address).trim() : "",
          organisation: item.organisation ? String(item.organisation).trim() : "",
          type: normalizedType,
          linkStatus: normalizedLinkStatus,
          downloadStatus: normalizedDownloadStatus,
          dateAdded: parsedDateAdded
        });
      }
    }

    let insertedRecords = [];
    if (validRecords.length > 0) {
      insertedRecords = await Record.insertMany(validRecords, { ordered: false });
    }

    return {
      importedCount: insertedRecords.length,
      failedCount: errors.length,
      totalProcessed: recordsArray.length,
      errors
    };
  }
};
