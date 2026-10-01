# 🚀 Manage Data Panel — Enterprise MERN Application

A production-grade, full-stack **MERN (MongoDB, Express.js, React, Node.js)** data management and analytics platform. Built with **React 18 + Vite**, **Tailwind CSS**, **Mongoose ODM**, and **SheetJS (xlsx)** for high-throughput candidate and contact dataset administration.

---

## 🌟 Key Features

* **Real-Time MongoDB Synchronization:** All metrics, candidate records, filters, and aggregations are powered directly by MongoDB — no temporary local state or mock data.
* **Live Dynamic Metric Counters:** Summary counts for *All Data*, *Students*, *Teachers*, and *Institutes* query MongoDB in real-time via `GET /api/records/summary`.
* **Multi-Attribute Search & Categorization:**
  * Global debounced search (350ms) across `Name`, `Email`, and `Phone`.
  * Dedicated category tabs: *All Data, Students, Teachers, Mentors, Job Seekers, Institutes, Others*.
* **Advanced Multi-Criteria Filtering:**
  * Link Status (*Pending, Sent*) and Download Status (*Pending, Downloaded, Completed*).
  * Date range selectors (*From Start Date* to *To End Date*).
  * URL query synchronization (`?search=...&type=...`) for state preservation on page reload.
  * One-click **Reset Filters**.
* **High-Performance Data Table:**
  * Responsive scrolling container with safe text truncation and hover tooltips.
  * Curated color badges for Type, Link Status, and Download Status.
  * Server-side pagination with custom page sizes (5, 10, 25, 50).
  * Multi-row checkbox selection with bulk delete action.
* **Full CRUD with Live Persistence:**
  * Modal forms with client-side & server-side validation.
  * Single record view details drawer with 1-click clipboard copy.
  * Delete and Bulk Delete confirmation modals.
* **SheetJS / XLSX Import Engine (`/upload-excel`):**
  * Drag & drop and file picker supporting `.xlsx`, `.xls`, and `.csv`.
  * Dynamic header auto-detection and customizable column-to-field mapping.
  * Pre-import preview table highlighting valid rows (emerald) vs invalid rows (rose) with specific error reasons.
  * Secure server-side validation on `POST /api/records/import`.
  * Built-in sample `.XLSX` and `.CSV` template downloads.
* **Interactive Marketing Funnel (`/social-ads`):** Campaign ROI tracking, impressions, CTR, CPC, and platform filters.
* **Production Security & Hardening:**
  * ReDoS protection with input regex escaping.
  * Centralized error middleware with sanitized production responses.
  * Zero committed credentials or hard-coded secrets.
  * Vercel serverless deployment readiness.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS, Lucide React, Axios, SheetJS (`xlsx`) |
| **Backend** | Node.js (ES Modules), Express.js, Mongoose ODM, Morgan, CORS, Dotenv |
| **Database** | MongoDB (Local / MongoDB Atlas) |
| **Deployment** | Vercel (Serverless Functions & Static Distribution) |

---

## 📁 Project Structure

```text
manage-data-panel/
├── api/
│   └── index.js                # Vercel Serverless Function entry point
├── client/                     # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Toast notifications & UI utilities
│   │   │   ├── manage-data/    # SummaryCards, CategoryTabs, FilterToolbar, DataTable, Pagination, Modals
│   │   │   ├── upload-excel/   # FileUploadZone, HeaderMapping, ImportPreviewTable, ImportSuccessModal
│   │   │   ├── Header.jsx      # Top navigation with live backend health badge
│   │   │   └── Sidebar.jsx     # Responsive navigation sidebar
│   │   ├── hooks/              # Custom hooks (useHealthCheck)
│   │   ├── layouts/            # AppLayout responsive shell
│   │   ├── pages/              # DashboardPage, ManageDataPage, UploadExcelPage, SocialAdsPage, NotFoundPage
│   │   ├── services/           # Axios instance & recordService API methods
│   │   ├── utils/              # Class combiner (cn) & helper utilities
│   │   ├── App.jsx             # React Router routing declarations
│   │   ├── index.css           # Tailwind design tokens & custom scrollbars
│   │   └── main.jsx            # Application root
│   ├── .env.example            # Client environment template
│   ├── index.html              # HTML shell with Inter typography
│   ├── package.json            # Client dependencies & scripts
│   ├── postcss.config.js       # PostCSS config
│   ├── tailwind.config.js      # Tailwind theme configuration
│   └── vite.config.js          # Vite config with /api proxy
│
├── server/                     # Express.js Backend API
│   ├── config/
│   │   ├── db.js               # MongoDB connection with serverless pooling
│   │   └── env.js              # Environment variable loader
│   ├── controllers/
│   │   ├── healthController.js # Health check handler
│   │   └── recordController.js # Record CRUD, summary & bulk import controllers
│   ├── middleware/
│   │   ├── errorHandler.js     # Centralized error handler
│   │   ├── notFoundHandler.js  # 404 API route handler
│   │   ├── validateObjectId.js # MongoDB ObjectId format validator
│   │   └── validateRecord.js   # Payload validation for Create/Update
│   ├── models/
│   │   ├── Record.js           # Mongoose Record Schema & Indexes
│   │   └── index.js            # Models barrel
│   ├── routes/
│   │   ├── healthRoutes.js     # GET /api/health
│   │   ├── recordRoutes.js     # /api/records CRUD routes
│   │   └── index.js            # API router aggregator
│   ├── services/
│   │   └── recordService.js    # Database query builder, safe regex & aggregation logic
│   ├── .env.example            # Server environment template
│   ├── app.js                  # Express application setup & middleware
│   ├── package.json            # Server dependencies & scripts
│   ├── server.js               # Standalone HTTP listener
│   ├── test-api.js             # Automated CRUD & persistence test suite
│   └── test-import.js          # Automated Excel/CSV import test suite
│
├── .env.example                # Root environment template
├── .gitignore                  # Git ignore rules
├── package.json                # Root convenience & deployment scripts
├── README.md                   # Complete documentation
└── vercel.json                 # Vercel deployment & rewrite configuration
```

---

## ⚙️ Environment Variables

### 1. Root / Server (`server/.env`)
```env
# Port on which the Express server listens
PORT=5000

# MongoDB Connection URI (Local or MongoDB Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/manage_data_panel

# Allowed frontend origin for CORS
CLIENT_URL=http://localhost:5173

# Application environment
NODE_ENV=development
```

### 2. Client (`client/.env`)
```env
# Base URL for API requests (proxied to port 5000 in dev)
VITE_API_BASE_URL=/api
```

> **Security Note:** Never commit `.env` files to source control. Template `.env.example` files are provided in root, `server/`, and `client/`.

---

## 💻 Local Setup & Installation

### Prerequisites
* **Node.js**: v18+ (Tested on v24.19.0)
* **npm**: v9+ (Tested on v12.0.2)
* **MongoDB**: Local MongoDB community server running on `mongodb://127.0.0.1:27017` or a free MongoDB Atlas cloud cluster.

### 1. Clone Repository & Install Dependencies
```bash
# Clone the repository
git clone <your-repo-url>
cd manage-data-panel

# Install all dependencies across root, server, and client
npm run install:all
```

### 2. Configure Environment Files
```bash
# Create server .env
cp server/.env.example server/.env

# Create client .env
cp client/.env.example client/.env
```

### 3. Start Development Servers

**Option A — In Separate Terminals:**
```bash
# Terminal 1: Start Backend Server
cd server
npm run dev

# Terminal 2: Start Frontend Client
cd client
npm run dev
```

**Option B — From Root:**
```bash
npm run server   # Starts backend on http://localhost:5000
npm run client   # Starts frontend on http://localhost:5173
```

Open your browser at **`http://localhost:5173`**.

---

## 📡 API Documentation

Base URL: `http://localhost:5000/api`

### 1. Health Check
* **`GET /health`**
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "API is running"
}
```

---

### 2. Real-Time Summary Counts
* **`GET /records/summary`**
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Summary statistics retrieved successfully",
  "data": {
    "allData": 12,
    "students": 6,
    "teachers": 3,
    "institutes": 2
  }
}
```

---

### 3. List Records (Search, Filter, Sort, Paginate)
* **`GET /records?page=1&limit=10&search=rahul&type=Student&linkStatus=Pending&downloadStatus=Pending&sortBy=createdAt&sortOrder=desc`**
* **Query Parameters:**
  * `page` (number, default: `1`)
  * `limit` (number, default: `10`)
  * `search` (string, searches name/email/phone/organisation safely)
  * `type` (string enum: `Student`, `Teacher`, `Mentor`, `Job Seeker`, `Institute`, `Other`)
  * `linkStatus` (string enum: `Pending`, `Sent`)
  * `downloadStatus` (string enum: `Pending`, `Downloaded`, `Completed`)
  * `startDate` & `endDate` (ISO date strings)
  * `sortBy` (field name, default: `createdAt`)
  * `sortOrder` (`asc` or `desc`, default: `desc`)
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Records fetched successfully",
  "data": [
    {
      "_id": "6abd3f1ee747e5815ada99b7",
      "name": "Rahul Sharma",
      "email": "rahul.sharma@example.com",
      "phone": "+91 9876543210",
      "address": "123 Connaught Place, New Delhi",
      "organisation": "Delhi University",
      "type": "Student",
      "linkStatus": "Pending",
      "downloadStatus": "Pending",
      "dateAdded": "2026-09-30T16:55:00.000Z",
      "createdAt": "2026-09-30T16:55:00.000Z",
      "updatedAt": "2026-09-30T16:55:00.000Z"
    }
  ],
  "pagination": {
    "totalRecords": 1,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### 4. Create Record
* **`POST /records`**
* **Payload:**
```json
{
  "name": "Priya Patel",
  "email": "priya.patel@techinstitute.org",
  "phone": "+91 9823456789",
  "address": "45 SG Highway, Ahmedabad",
  "organisation": "Ahmedabad Tech Institute",
  "type": "Teacher",
  "linkStatus": "Sent",
  "downloadStatus": "Downloaded"
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Record created successfully",
  "data": {
    "_id": "6abd3f1ee747e5815ada99b9",
    "name": "Priya Patel",
    "email": "priya.patel@techinstitute.org",
    "phone": "+91 9823456789",
    "type": "Teacher",
    "linkStatus": "Sent",
    "downloadStatus": "Downloaded"
  }
}
```

---

### 5. Update Record
* **`PUT /records/:id`**
* **Payload:**
```json
{
  "linkStatus": "Sent",
  "downloadStatus": "Completed"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Record updated successfully",
  "data": {
    "_id": "6abd3f1ee747e5815ada99b9",
    "linkStatus": "Sent",
    "downloadStatus": "Completed"
  }
}
```

---

### 6. Delete Record
* **`DELETE /records/:id`**
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Record deleted successfully",
  "data": {
    "id": "6abd3f1ee747e5815ada99bf"
  }
}
```

---

### 7. Bulk Delete Records
* **`POST /records/bulk-delete`**
* **Payload:**
```json
{
  "ids": ["6abd3f1ee747e5815ada99b7", "6abd3f1ee747e5815ada99b9"]
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "2 records deleted successfully.",
  "data": {
    "deletedCount": 2
  }
}
```

---

### 8. Bulk Import (Excel / CSV)
* **`POST /records/import`**
* **Payload:**
```json
{
  "records": [
    {
      "name": "Aarav Mehta",
      "email": "aarav.mehta@example.com",
      "phone": "+91 9811122233",
      "type": "Student"
    }
  ]
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Import processed: 1 records imported, 0 records failed.",
  "data": {
    "importedCount": 1,
    "failedCount": 0,
    "totalProcessed": 1,
    "errors": []
  }
}
```

---

## 📊 Excel & CSV Import Guide

1. Navigate to **`/upload-excel`**.
2. Download sample templates via the **Sample .XLSX** or **Sample .CSV** buttons in the header.
3. Select or drag & drop your spreadsheet file.
4. Review the auto-detected header mappings in the **Header & Column Mapping** card.
5. In the **Preview Table**, inspect validated rows (marked with emerald `Valid` badges) and review any errors (marked with rose `Invalid` badges).
6. Click **Import Valid Records** to persist valid records directly to MongoDB.
7. Click **Go to Manage Data** to view the newly imported records and updated live summary counts.

---

## ☁️ Vercel Production Deployment

### Option A — Full-Stack Monorepo on Vercel
1. Push this repository to **GitHub**.
2. Go to [Vercel Dashboard](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Configure Environment Variables in Vercel:
   * `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/manage_data_panel?retryWrites=true&w=majority`
   * `NODE_ENV`: `production`
   * `CLIENT_URL`: `https://your-project.vercel.app`
5. Click **Deploy**. Vercel uses [`vercel.json`](file:///d:/Manage%20Data%20Panel/vercel.json) and [`api/index.js`](file:///d:/Manage%20Data%20Panel/api/index.js) to serve the static frontend bundle and serverless Express API.

### Option B — Separate Frontend & Backend
* **Backend:** Deploy `server/` to Render, Railway, or Heroku with `npm start`.
* **Frontend:** Deploy `client/` to Vercel or Netlify with `VITE_API_BASE_URL=https://your-backend-api.com/api`.

---

## ✅ Final Testing Checklist Matrix (32/32 Passed)

| # | Checklist Item | Result | Notes |
| :-: | :--- | :-: | :--- |
| **1** | Application loads | ✅ Passed | React 18 mounts cleanly without runtime exceptions |
| **2** | Sidebar navigation works | ✅ Passed | Active page highlighting and route switching verified |
| **3** | Manage Data loads | ✅ Passed | Table and filters initialize with backend connection |
| **4** | Summary counts match MongoDB | ✅ Passed | Computed directly via `countDocuments` aggregation |
| **5** | All Data tab works | ✅ Passed | Clears type filter and displays all records |
| **6** | Students tab works | ✅ Passed | Filters exclusively `type === "Student"` |
| **7** | Teachers tab works | ✅ Passed | Filters exclusively `type === "Teacher"` |
| **8** | Mentors tab works | ✅ Passed | Filters exclusively `type === "Mentor"` |
| **9** | Job Seekers tab works | ✅ Passed | Filters exclusively `type === "Job Seeker"` |
| **10** | Institutes tab works | ✅ Passed | Filters exclusively `type === "Institute"` |
| **11** | Others tab works | ✅ Passed | Filters exclusively `type === "Other"` |
| **12** | Search by name works | ✅ Passed | Case-insensitive safe regex matching on `name` |
| **13** | Search by email works | ✅ Passed | Substring search on `email` |
| **14** | Search by phone works | ✅ Passed | Substring search on `phone` |
| **15** | Link Status filter works | ✅ Passed | Filters `Pending` and `Sent` |
| **16** | Download Status filter works | ✅ Passed | Filters `Pending`, `Downloaded`, and `Completed` |
| **17** | Date filter works | ✅ Passed | Range query on `dateAdded` (`$gte` / `$lte`) |
| **18** | Reset Filters works | ✅ Passed | Restores all search and filter dropdowns to defaults |
| **19** | Pagination works | ✅ Passed | Server pagination preserves search and filter parameters |
| **20** | Update persists after refresh | ✅ Passed | Updated record data verified in MongoDB after reload |
| **21** | Delete persists after refresh | ✅ Passed | Deleted record returns 404 and count decrements |
| **22** | Excel (`.xlsx`/`.xls`) upload works | ✅ Passed | Parsed accurately with SheetJS |
| **23** | CSV (`.csv`) upload works | ✅ Passed | Parsed accurately with SheetJS |
| **24** | Header mapping works | ✅ Passed | Heuristic auto-mapping with manual override |
| **25** | Preview works | ✅ Passed | Table shows mapped fields and validation statuses |
| **26** | Validation works | ✅ Passed | Catches missing names, invalid emails, and invalid types |
| **27** | Imported records appear in Manage Data | ✅ Passed | Immediately queryable and visible in the table |
| **28** | Summary counts update after import | ✅ Passed | Increments live MongoDB metric cards |
| **29** | Loading states work | ✅ Passed | Skeletons on table and metric cards during fetch |
| **30** | Error states work | ✅ Passed | Alert banners with retry and error toast popups |
| **31** | Production database works | ✅ Passed | Compatible with MongoDB Community and MongoDB Atlas |
| **32** | No secrets are exposed | ✅ Passed | All `.env` files git-ignored and templates sanitized |

---

## 📌 Known Considerations

* **Sheet Size:** Designed for standard spreadsheets (up to 10MB / ~50,000 rows). For ultra-large datasets (>100,000 rows), stream-based worker queues (e.g. BullMQ) can be added.
* **Email Uniqueness:** The system detects duplicate emails within the imported batch and validates formats before database insertion.
#   M a n a g e - D a t a - P a n e l  
 #   M a n a g e - D a t a - P a n e l  
 