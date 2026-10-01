// Test script for POST /api/records/import
const BASE_URL = "http://localhost:5000/api";

async function runImportTests() {
  console.log("=== STARTING IMPORT API TESTS ===");

  // 1. Initial Summary before import
  const initialSummaryRes = await fetch(`${BASE_URL}/records/summary`);
  const initialSummary = await initialSummaryRes.json();
  console.log("Initial Summary before import:", initialSummary.data);

  // 2. Test Import with Mixed Valid & Invalid Records
  console.log("\n2. Testing POST /api/records/import with mixed dataset (valid, invalid email, invalid type, duplicates, missing name)");
  const testBatch = [
    {
      name: "Rohit Verma",
      email: "rohit.verma@example.com",
      phone: "+91 9988776655",
      address: "Andheri East, Mumbai",
      organisation: "Mumbai University",
      type: "Student",
      linkStatus: "Pending",
      downloadStatus: "Pending"
    },
    {
      name: "Prof. Vikram Sarabhai",
      email: "vikram.sarabhai@spaceedu.in",
      phone: "+91 9877665544",
      address: "ISRO Colony, Ahmedabad",
      organisation: "Physical Research Laboratory",
      type: "Teacher",
      linkStatus: "Sent",
      downloadStatus: "Downloaded"
    },
    {
      name: "National Institute of Design",
      email: "admissions@nid.edu",
      phone: "+91 7926623692",
      address: "Paldi, Ahmedabad",
      organisation: "NID Ahmedabad",
      type: "Institute",
      linkStatus: "Sent",
      downloadStatus: "Completed"
    },
    {
      name: "", // Missing name
      email: "missing.name@example.com",
      phone: "9998887776",
      type: "Student"
    },
    {
      name: "Invalid Email User",
      email: "not-a-valid-email-format", // Invalid email
      phone: "9998887775",
      type: "Student"
    },
    {
      name: "Duplicate User 1",
      email: "duplicate.user@example.com",
      phone: "9998887774",
      type: "Student"
    },
    {
      name: "Duplicate User 2",
      email: "duplicate.user@example.com", // Duplicate email in same batch
      phone: "9998887773",
      type: "Student"
    },
    {
      name: "Invalid Type User",
      email: "invalid.type@example.com",
      phone: "9998887772",
      type: "Astronaut" // Invalid enum type
    }
  ];

  const importRes = await fetch(`${BASE_URL}/records/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ records: testBatch })
  });

  const importData = await importRes.json();
  console.log("Import Status:", importRes.status);
  console.log("Import Summary:", {
    success: importData.success,
    message: importData.message,
    importedCount: importData.data?.importedCount,
    failedCount: importData.data?.failedCount,
    totalProcessed: importData.data?.totalProcessed
  });
  console.log("Reported Validation Errors (per row):", JSON.stringify(importData.data?.errors, null, 2));

  // 3. Verify Summary after import
  console.log("\n3. Verifying updated summary in MongoDB...");
  const newSummaryRes = await fetch(`${BASE_URL}/records/summary`);
  const newSummary = await newSummaryRes.json();
  console.log("Updated Summary after import:", newSummary.data);

  // 4. Verify that imported records appear in GET /api/records
  console.log("\n4. Verifying imported records in GET /api/records?search=Rohit");
  const queryRes = await fetch(`${BASE_URL}/records?search=Rohit`);
  const queryData = await queryRes.json();
  console.log("Queried record:", queryData.data?.map(r => ({ name: r.name, email: r.email, type: r.type })));

  console.log("\n=== IMPORT API TESTS COMPLETED SUCCESSFULLY ===");
}

runImportTests().catch(console.error);
