# Manage Data Panel

A full-stack **MERN data management and analytics application** for managing, searching, filtering, importing, and analyzing candidate and contact datasets.

Built with **React, Vite, Tailwind CSS, Node.js, Express.js, MongoDB, Mongoose, and SheetJS**.

---

## ✨ Features

### 📊 Dashboard & Data Management

* Real-time MongoDB-powered summary metrics
* All Data, Students, Teachers, Mentors, Job Seekers, Institutes, and Others categories
* Global search across:

  * Name
  * Email
  * Phone
  * Organisation
* Advanced filtering by:

  * Link Status
  * Download Status
  * Date range
* URL query synchronization for search and filter state
* Server-side pagination
* Configurable page sizes: `5`, `10`, `25`, `50`
* Single-record details view
* Create, update, delete, and bulk-delete operations
* Confirmation modals for destructive actions
* Clipboard copy support

### 📥 Excel & CSV Import

The application provides a dedicated Excel/CSV import workflow.

* Supports `.xlsx`, `.xls`, and `.csv`
* Drag & drop or file picker upload
* Automatic header detection
* Manual column-to-field mapping
* Import preview before database insertion
* Row-level validation
* Clear validation error messages
* Valid and invalid row indicators
* Server-side validation
* Bulk import into MongoDB
* Sample XLSX and CSV templates

### 📈 Social Ads

The Social Ads section provides marketing analytics such as:

* Campaign performance
* Impressions
* CTR
* CPC
* ROI
* Platform-based filtering

### 🔐 Security & Reliability

* Environment variables for sensitive configuration
* `.env` files excluded from Git
* Sanitized production error responses
* Centralized Express error handling
* MongoDB ObjectId validation
* Safe regular-expression handling
* Server-side request validation
* MongoDB Atlas support
* Vercel deployment support

---

## 🛠️ Tech Stack

| Area            | Technologies                                                    |
| --------------- | --------------------------------------------------------------- |
| Frontend        | React 18, Vite, React Router, Tailwind CSS, Axios, Lucide React |
| Backend         | Node.js, Express.js, Mongoose, Morgan, CORS, dotenv             |
| Database        | MongoDB / MongoDB Atlas                                         |
| File Processing | SheetJS (`xlsx`)                                                |
| Deployment      | Vercel                                                          |

---

## 📁 Project Structure

```text
manage-data-panel/
│
├── api/
│   └── index.js                 # Vercel serverless API entry
│
├── client/                      # React + Vite frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── common/
│       │   ├── manage-data/
│       │   ├── upload-excel/
│       │   ├── Header.jsx
│       │   └── Sidebar.jsx
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
├── server/                      # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── .env.example
│   ├── app.js
│   ├── package.json
│   ├── server.js
│   ├── test-api.js
│   └── test-import.js
│
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── vercel.json
```

---

## ⚙️ Environment Variables

### Server

Create:

```text
server/.env
```

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/manage_data_panel
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

### Client

Create:

```text
client/.env
```

```env
VITE_API_BASE_URL=/api
```

> **Important:** Never commit `.env` files or database credentials to GitHub.
> The repository contains `.env.example` files only.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Node.js `18+`
* npm `9+`
* MongoDB Community Server **or** MongoDB Atlas

---

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd manage-data-panel
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Configure Environment Variables

Create the environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Update `server/.env` with your MongoDB connection string.

---

## ▶️ Run the Application

### Option 1 — Separate Terminals

**Backend**

```bash
cd server
npm run dev
```

**Frontend**

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

### Option 2 — From Root

```bash
npm run server
npm run client
```

---

# 📡 API

Base URL:

```text
http://localhost:5000/api
```

## Health Check

```http
GET /health
```

Example response:

```json
{
  "success": true,
  "message": "API is running"
}
```

---

## Summary

```http
GET /records/summary
```

Returns live MongoDB counts for:

* All Data
* Students
* Teachers
* Institutes

Example:

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

## List Records

```http
GET /records
```

Supports search, filtering, sorting, and pagination.

Example:

```text
GET /records?page=1&limit=10&search=rahul&type=Student&linkStatus=Pending&downloadStatus=Pending&sortBy=createdAt&sortOrder=desc
```

### Query Parameters

| Parameter        | Description                                            |
| ---------------- | ------------------------------------------------------ |
| `page`           | Page number                                            |
| `limit`          | Records per page                                       |
| `search`         | Searches name, email, phone, and organisation          |
| `type`           | Student, Teacher, Mentor, Job Seeker, Institute, Other |
| `linkStatus`     | Pending or Sent                                        |
| `downloadStatus` | Pending, Downloaded, Completed                         |
| `startDate`      | Start date                                             |
| `endDate`        | End date                                               |
| `sortBy`         | Sorting field                                          |
| `sortOrder`      | `asc` or `desc`                                        |

---

## Create Record

```http
POST /records
```

Example:

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

---

## Update Record

```http
PUT /records/:id
```

Example:

```json
{
  "linkStatus": "Sent",
  "downloadStatus": "Completed"
}
```

---

## Delete Record

```http
DELETE /records/:id
```

---

## Bulk Delete

```http
POST /records/bulk-delete
```

Example:

```json
{
  "ids": [
    "6abd3f1ee747e5815ada99b7",
    "6abd3f1ee747e5815ada99b9"
  ]
}
```

---

## Import Records

```http
POST /records/import
```

Example:

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

---

# 📥 Excel & CSV Import

The application includes a complete spreadsheet import workflow.

### Import Flow

```text
Upload File
     ↓
Detect Headers
     ↓
Map Columns
     ↓
Validate Rows
     ↓
Preview Data
     ↓
Import Valid Records
     ↓
MongoDB
```

### Supported Files

* `.xlsx`
* `.xls`
* `.csv`

### How to Import

1. Open `/upload-excel`.
2. Download the sample XLSX or CSV template if required.
3. Upload or drag & drop your file.
4. Review the detected column mapping.
5. Correct mappings manually if required.
6. Review the preview table.
7. Check valid and invalid rows.
8. Click **Import Valid Records**.
9. Open **Manage Data** to verify the imported records.

The project root also contains **sample XLSX files with valid and invalid data for testing the import workflow**.

---

# ☁️ Deployment

## Vercel — Full-Stack Deployment

1. Push the repository to GitHub.
2. Open the Vercel Dashboard.
3. Create a new project.
4. Import the GitHub repository.
5. Configure the required environment variables.
6. Deploy the project.

Required production variables include:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
NODE_ENV=production
CLIENT_URL=https://your-project.vercel.app
```

The project includes:

```text
vercel.json
api/index.js
```

for the Vercel deployment configuration.

> **Never put your real MongoDB username, password, or connection string directly into the source code.**

---

## Alternative Deployment

The frontend and backend can also be deployed separately.

### Backend

Compatible with services such as:

* Render
* Railway
* Heroku

### Frontend

Compatible with:

* Vercel
* Netlify

When deploying separately, configure:

```env
VITE_API_BASE_URL=https://your-backend-api.com/api
```

---

# 🧪 Testing

The application has been tested across the following areas:

| Area                            | Status |
| ------------------------------- | :----: |
| Application loading             |    ✅   |
| Sidebar navigation              |    ✅   |
| Manage Data                     |    ✅   |
| Summary counters                |    ✅   |
| Category filtering              |    ✅   |
| Search                          |    ✅   |
| Link Status filtering           |    ✅   |
| Download Status filtering       |    ✅   |
| Date filtering                  |    ✅   |
| Reset Filters                   |    ✅   |
| Pagination                      |    ✅   |
| Record update persistence       |    ✅   |
| Record deletion persistence     |    ✅   |
| XLSX import                     |    ✅   |
| XLS import                      |    ✅   |
| CSV import                      |    ✅   |
| Header mapping                  |    ✅   |
| Import preview                  |    ✅   |
| Import validation               |    ✅   |
| Imported records visibility     |    ✅   |
| Summary update after import     |    ✅   |
| Loading states                  |    ✅   |
| Error states                    |    ✅   |
| MongoDB Community compatibility |    ✅   |
| MongoDB Atlas compatibility     |    ✅   |
| Git secret protection           |    ✅   |

---

# 📌 Known Considerations

* The import workflow is designed for standard spreadsheets of approximately **10 MB / 50,000 rows**.
* Very large datasets may require a background processing or streaming approach.
* Duplicate emails within an import batch are detected during validation.
* Email formats and record types are validated before import.
* MongoDB Atlas can be used instead of a local MongoDB instance.

---

## 🔒 Security

Before pushing the project to GitHub, verify that:

* `.env` files are ignored by Git.
* MongoDB credentials are not present in source files.
* API keys and secrets are not committed.
* Only `.env.example` templates contain environment variable names.
* Production credentials are configured through the deployment platform.

---

## 📄 License

This project is intended for application development and demonstration purposes.
