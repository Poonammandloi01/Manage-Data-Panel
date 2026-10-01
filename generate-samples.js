import * as XLSX from "./client/node_modules/xlsx/xlsx.mjs";
import fs from "fs";

// 1. Valid Records Dataset
const validRecords = [
  {
    "Full Name": "Aarav Mehta",
    "Email Address": "aarav.mehta@example.com",
    "Phone Number": "+91 9811122334",
    "Address": "402 Marine Drive, Mumbai",
    "Organisation": "IIT Bombay",
    "Category": "Student",
    "Link Status": "Pending",
    "Download Status": "Pending"
  },
  {
    "Full Name": "Prof. Shweta Kulkarni",
    "Email Address": "shweta.kulkarni@univ.ac.in",
    "Phone Number": "+91 9822334455",
    "Address": "FC Road, Shivaji Nagar, Pune",
    "Organisation": "Pune University",
    "Category": "Teacher",
    "Link Status": "Sent",
    "Download Status": "Downloaded"
  },
  {
    "Full Name": "Devendra Singhania",
    "Email Address": "devendra.s@apexedu.org",
    "Phone Number": "+91 9833445566",
    "Address": "Sector 62, Noida",
    "Organisation": "National Tech Institute",
    "Category": "Institute",
    "Link Status": "Sent",
    "Download Status": "Completed"
  },
  {
    "Full Name": "Rohan Deshmukh",
    "Email Address": "rohan.deshmukh@careers.in",
    "Phone Number": "+91 9844556677",
    "Address": "Koramangala 4th Block, Bengaluru",
    "Organisation": "Independent Tech Lead",
    "Category": "Mentor",
    "Link Status": "Pending",
    "Download Status": "Pending"
  },
  {
    "Full Name": "Pooja Banerjee",
    "Email Address": "pooja.banerjee@gmail.com",
    "Phone Number": "+91 9855667788",
    "Address": "Salt Lake Sector V, Kolkata",
    "Organisation": "Software Trainee",
    "Category": "Job Seeker",
    "Link Status": "Sent",
    "Download Status": "Downloaded"
  },
  {
    "Full Name": "Kavita Reddy",
    "Email Address": "kavita.reddy@hyderabadtech.edu",
    "Phone Number": "+91 9866778899",
    "Address": "Hitec City, Hyderabad",
    "Organisation": "Hyderabad Global Academy",
    "Category": "Teacher",
    "Link Status": "Sent",
    "Download Status": "Completed"
  },
  {
    "Full Name": "Aditya Verma",
    "Email Address": "aditya.verma@student.delhi.edu",
    "Phone Number": "+91 9877889900",
    "Address": "North Campus, Delhi",
    "Organisation": "Delhi University",
    "Category": "Student",
    "Link Status": "Pending",
    "Download Status": "Pending"
  },
  {
    "Full Name": "Vikas Malhotra",
    "Email Address": "vikas.malhotra@fintech.co",
    "Phone Number": "+91 9888990011",
    "Address": "Cyber City Phase 2, Gurugram",
    "Organisation": "FinTech Innovations",
    "Category": "Other",
    "Link Status": "Sent",
    "Download Status": "Downloaded"
  }
];

// 2. Mixed Dataset with some invalid rows for testing validation
const mixedRecords = [
  {
    "Full Name": "Suresh Raina",
    "Email Address": "suresh.raina@cricketedu.in",
    "Phone Number": "+91 9900112233",
    "Address": "Ghaziabad, UP",
    "Organisation": "Sports Academy",
    "Category": "Mentor",
    "Link Status": "Sent",
    "Download Status": "Downloaded"
  },
  {
    "Full Name": "", // Missing Name (Invalid)
    "Email Address": "missing.name@example.com",
    "Phone Number": "+91 9911223344",
    "Address": "Indore, MP",
    "Organisation": "Dev Institute",
    "Category": "Student",
    "Link Status": "Pending",
    "Download Status": "Pending"
  },
  {
    "Full Name": "Neha Gupta",
    "Email Address": "neha.gupta-invalid-email", // Invalid Email format
    "Phone Number": "+91 9922334455",
    "Address": "Lalbagh, Lucknow",
    "Organisation": "Medical College",
    "Category": "Student",
    "Link Status": "Pending",
    "Download Status": "Pending"
  },
  {
    "Full Name": "Kunal Kapoor",
    "Email Address": "kunal.kapoor@techcorp.com",
    "Phone Number": "+91 9933445566",
    "Address": "Bandra, Mumbai",
    "Organisation": "Tech Corp",
    "Category": "Job Seeker",
    "Link Status": "Pending",
    "Download Status": "Pending"
  },
  {
    "Full Name": "Duplicate User Test",
    "Email Address": "kunal.kapoor@techcorp.com", // Duplicate Email in same batch
    "Phone Number": "+91 9944556677",
    "Address": "Andheri, Mumbai",
    "Organisation": "Tech Corp",
    "Category": "Job Seeker",
    "Link Status": "Pending",
    "Download Status": "Pending"
  },
  {
    "Full Name": "Manisha Joshi",
    "Email Address": "manisha.joshi@school.ac.in",
    "Phone Number": "+91 9955667788",
    "Address": "Dehradun, Uttarakhand",
    "Organisation": "Doon Public School",
    "Category": "Teacher",
    "Link Status": "Sent",
    "Download Status": "Completed"
  }
];

// Write Valid XLSX
const wsValid = XLSX.utils.json_to_sheet(validRecords);
const wbValid = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wbValid, wsValid, "Candidates");
const bufValid = XLSX.write(wbValid, { type: "buffer", bookType: "xlsx" });
fs.writeFileSync("sample_manage_data_valid.xlsx", bufValid);

// Write Mixed XLSX (with validation errors)
const wsMixed = XLSX.utils.json_to_sheet(mixedRecords);
const wbMixed = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wbMixed, wsMixed, "MixedData");
const bufMixed = XLSX.write(wbMixed, { type: "buffer", bookType: "xlsx" });
fs.writeFileSync("sample_manage_data_with_errors.xlsx", bufMixed);

// Write CSV
const wsCSV = XLSX.utils.json_to_sheet(validRecords);
const csvContent = XLSX.utils.sheet_to_csv(wsCSV);
fs.writeFileSync("sample_manage_data.csv", csvContent, "utf8");

console.log("✅ Successfully generated sample Excel and CSV files in workspace root!");
