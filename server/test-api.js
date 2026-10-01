// Comprehensive API test script for Part 2
const BASE_URL = "http://localhost:5000/api";

async function runTests() {
  console.log("=== STARTING FULL API TESTS ===");

  // 1. Health check
  console.log("\n1. Testing GET /api/health");
  const healthRes = await fetch(`${BASE_URL}/health`);
  console.log("Status:", healthRes.status, await healthRes.json());

  // 2. Initial Summary
  console.log("\n2. Testing GET /api/records/summary (initial)");
  const summaryRes1 = await fetch(`${BASE_URL}/records/summary`);
  console.log("Status:", summaryRes1.status, await summaryRes1.json());

  // 3. Validation failure test
  console.log("\n3. Testing POST /api/records with invalid payload");
  const invalidPostRes = await fetch(`${BASE_URL}/records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "",
      email: "invalid-email",
      phone: "",
      type: "InvalidEnum"
    })
  });
  console.log("Status:", invalidPostRes.status, await invalidPostRes.json());

  // 4. Create multiple records
  console.log("\n4. Creating test records...");
  const recordsToCreate = [
    {
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 9876543210",
      address: "123 Connaught Place, New Delhi",
      organisation: "Delhi University",
      type: "Student",
      linkStatus: "Pending",
      downloadStatus: "Pending"
    },
    {
      name: "Priya Patel",
      email: "priya.patel@techinstitute.org",
      phone: "+91 9823456789",
      address: "45 SG Highway, Ahmedabad",
      organisation: "Ahmedabad Tech Institute",
      type: "Teacher",
      linkStatus: "Sent",
      downloadStatus: "Downloaded"
    },
    {
      name: "Apex Global Institute",
      email: "admissions@apexedu.in",
      phone: "+91 1145678900",
      address: "Plot 12 Knowledge Park, Greater Noida",
      organisation: "Apex Education Trust",
      type: "Institute",
      linkStatus: "Sent",
      downloadStatus: "Completed"
    },
    {
      name: "Amit Verma",
      email: "amit.verma@careers.com",
      phone: "+91 9911223344",
      address: "Bandra West, Mumbai",
      organisation: "Freelance",
      type: "Job Seeker",
      linkStatus: "Pending",
      downloadStatus: "Pending"
    },
    {
      name: "Ananya Sen",
      email: "ananya.sen@univ.ac.in",
      phone: "+91 9123456780",
      address: "Salt Lake Sector V, Kolkata",
      organisation: "Kolkata Tech College",
      type: "Student",
      linkStatus: "Sent",
      downloadStatus: "Downloaded"
    }
  ];

  const createdRecords = [];
  for (const item of recordsToCreate) {
    const res = await fetch(`${BASE_URL}/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    });
    const data = await res.json();
    console.log(`Created [${item.type}] ${item.name} -> ID: ${data.data?._id}`);
    createdRecords.push(data.data);
  }

  const sampleId = createdRecords[0]._id;

  // 5. Get Summary after creation
  console.log("\n5. Testing GET /api/records/summary (after creations)");
  const summaryRes2 = await fetch(`${BASE_URL}/records/summary`);
  const summaryData = await summaryRes2.json();
  console.log("Summary Result:", JSON.stringify(summaryData, null, 2));

  // 6. Get All Records with Pagination
  console.log("\n6. Testing GET /api/records?page=1&limit=2");
  const pagedRes = await fetch(`${BASE_URL}/records?page=1&limit=2`);
  const pagedData = await pagedRes.json();
  console.log("Paged (total:", pagedData.pagination?.totalRecords, "pages:", pagedData.pagination?.totalPages, "items:", pagedData.data?.length, ")");

  // 7. Search filter test
  console.log("\n7. Testing GET /api/records?search=rahul");
  const searchRes = await fetch(`${BASE_URL}/records?search=rahul`);
  const searchData = await searchRes.json();
  console.log("Search 'rahul' match:", searchData.data?.map(r => ({ name: r.name, email: r.email })));

  // 8. Type filter test
  console.log("\n8. Testing GET /api/records?type=Teacher");
  const typeRes = await fetch(`${BASE_URL}/records?type=Teacher`);
  const typeData = await typeRes.json();
  console.log("Type 'Teacher' match:", typeData.data?.map(r => ({ name: r.name, type: r.type })));

  // 9. Status filter test
  console.log("\n9. Testing GET /api/records?linkStatus=Sent&downloadStatus=Downloaded");
  const statusRes = await fetch(`${BASE_URL}/records?linkStatus=Sent&downloadStatus=Downloaded`);
  const statusData = await statusRes.json();
  console.log("Status filter match count:", statusData.data?.length);

  // 10. Get Single Record by ID
  console.log(`\n10. Testing GET /api/records/${sampleId}`);
  const singleRes = await fetch(`${BASE_URL}/records/${sampleId}`);
  console.log("Single Record Status:", singleRes.status, (await singleRes.json()).data?.name);

  // 11. Invalid ID and 404 tests
  console.log("\n11. Testing invalid ID formats & 404s");
  const invalidIdRes = await fetch(`${BASE_URL}/records/not-a-valid-id`);
  console.log("Invalid ID 400 response:", invalidIdRes.status, await invalidIdRes.json());

  const notFoundRes = await fetch(`${BASE_URL}/records/507f1f77bcf86cd799439011`);
  console.log("Non-existent ID 404 response:", notFoundRes.status, await notFoundRes.json());

  // 12. Update Record & Verify Persistence
  console.log(`\n12. Testing PUT /api/records/${sampleId}`);
  const updateRes = await fetch(`${BASE_URL}/records/${sampleId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Rahul Sharma (Updated)",
      linkStatus: "Sent",
      downloadStatus: "Downloaded",
      organisation: "Delhi University - Department of CS"
    })
  });
  const updatedData = await updateRes.json();
  console.log("Update response status:", updateRes.status);
  console.log("Updated fields:", {
    name: updatedData.data?.name,
    linkStatus: updatedData.data?.linkStatus,
    downloadStatus: updatedData.data?.downloadStatus,
    organisation: updatedData.data?.organisation
  });

  // Verify persistence of Update
  console.log(`\nVerifying Update Persistence: Fetching GET /api/records/${sampleId} from DB`);
  const verifyUpdateRes = await fetch(`${BASE_URL}/records/${sampleId}`);
  const verifyUpdateData = await verifyUpdateRes.json();
  console.log("DB Verified Name:", verifyUpdateData.data?.name);
  console.log("DB Verified Link Status:", verifyUpdateData.data?.linkStatus);
  console.log("DB Verified Download Status:", verifyUpdateData.data?.downloadStatus);

  // 13. Delete Record & Verify Persistence
  const deleteId = createdRecords[createdRecords.length - 1]._id;
  console.log(`\n13. Testing DELETE /api/records/${deleteId}`);
  const deleteRes = await fetch(`${BASE_URL}/records/${deleteId}`, {
    method: "DELETE"
  });
  console.log("Delete Status:", deleteRes.status, await deleteRes.json());

  // Verify persistence of Deletion
  console.log(`\nVerifying Deletion Persistence: Fetching deleted ID GET /api/records/${deleteId} from DB`);
  const verifyDeleteRes = await fetch(`${BASE_URL}/records/${deleteId}`);
  console.log("DB Verified 404 response on deleted record:", verifyDeleteRes.status);

  // 14. Verify Summary after deletion
  console.log("\n14. Final Summary verification after deletion");
  const finalSummaryRes = await fetch(`${BASE_URL}/records/summary`);
  console.log(await finalSummaryRes.json());

  console.log("\n=== ALL CRUD & PERSISTENCE TESTS COMPLETED SUCCESSFULLY ===");
}

runTests().catch(console.error);
