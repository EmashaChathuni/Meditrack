
import React, { useEffect, useState, useMemo } from "react";
import "./Dashboard.css";
import axios from "axios";

const API_BASE = import.meta.env?.VITE_API || "http://localhost:5000";


function authHeader() {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

/** Parse meta like doctor:/hospital:/followUp: from tags[] */
function parseMetaFromTags(tags = []) {
  const meta = { doctor: "", hospital: "", followUpDate: "" };
  tags.forEach((t) => {
    if (typeof t !== "string") return;
    if (t.toLowerCase().startsWith("doctor:"))
      meta.doctor = t.split(":").slice(1).join(":").trim();
    if (t.toLowerCase().startsWith("hospital:"))
      meta.hospital = t.split(":").slice(1).join(":").trim();
    if (t.toLowerCase().startsWith("followup:"))
      meta.followUpDate = t.split(":").slice(1).join(":").trim();
  });
  return meta;
}

/** Map any backend record shape to UI shape */
function normalizeRecord(rec) {
  if (!rec || typeof rec !== "object") return rec;

  const diagnosis = rec.diagnosis ?? rec.title ?? "";
  const notes = rec.notes ?? rec.description ?? "";
  const date = rec.date ?? rec.createdAt ?? "";

  const tags = Array.isArray(rec.tags) ? rec.tags : [];
  const meta = parseMetaFromTags(tags);
  // remove meta tokens from tags when showing meds
  const medsOnly = tags.filter(
    (t) =>
      !/^doctor:/i.test(t) &&
      !/^hospital:/i.test(t) &&
      !/^followup:/i.test(t)
  );
  const medications =
    rec.medications ??
    (medsOnly.length ? medsOnly.join(", ") : "");

  return {
    _id: rec._id || String(Math.random()),
    date,
    diagnosis,
    medications,
    doctor: rec.doctor ?? meta.doctor ?? "",
    hospital: rec.hospital ?? meta.hospital ?? "",
    followUpDate: rec.followUpDate ?? meta.followUpDate ?? "",
    notes,
    tests: rec.tests ?? [],
    reportFile: rec.reportFile ?? "",
    __raw: rec,
  };
}

/** Build payload for our simple backend (title/description/date/tags) */
// function toBackendPayload(edit) {
//   const meds =
//     edit.medications
//       ?.split(",")
//       .map((s) => s.trim())
//       .filter(Boolean) ?? [];
//   const metaTags = [
//     edit.doctor ? `doctor:${edit.doctor}` : null,
//     edit.hospital ? `hospital:${edit.hospital}` : null,
//     edit.followUpDate ? `followUp:${edit.followUpDate}` : null,
//   ].filter(Boolean);

//   return {
//     title: edit.diagnosis ?? edit.title ?? "",
//     description: edit.notes ?? edit.description ?? "",
//     date: edit.date || undefined,
     
//      tags: [...meds, ...metaTags],
//   };
// }
function toBackendPayload(record) {
  const meds = record.medications
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? [];

  return {
    date: new Date(record.date).toISOString(),
    diagnosis: record.diagnosis ?? "",
    medications: meds.join(", "),
    doctor: record.doctor ?? "",
    hospital: record.hospital ?? "",
    followUpDate: record.followUpDate ? new Date(record.followUpDate).toISOString() : null,
    notes: record.notes ?? "",
  };
}






/** Normalize Lab Report shape */
function normalizeLabReport(doc) {
  if (!doc || typeof doc !== "object") return doc;
  const results = doc.results || {};
  const fileUrl =
    (typeof results === "object" && results.fileUrl) ||
    doc.fileUrl ||
    "";
  return {
    _id: doc._id || String(Math.random()),
    testName: doc.testName || "Report",
    reportDate: doc.reportDate || "",
    notes: doc.notes || "",
    fileUrl,
    __raw: doc,
  };
}

/** Fallback demo data */
const fallbackDemoRecords = [
  {
    _id: "demo-1",
    date: "2025-08-12",
    diagnosis: "Influenza",
    medications: "Paracetamol, Cough Syrup",
    doctor: "Dr. Silva",
    hospital: "Nawaloka",
    followUpDate: "2025-08-20",
    notes: "Hydration + rest",
  },
  {
    _id: "demo-2",
    date: "2025-05-02",
    diagnosis: "Viral Fever",
    medications: "Ibuprofen, ORS",
    doctor: "Dr. Perera",
    hospital: "Asiri",
    followUpDate: "",
    notes: "",
  },
];

const fallbackDemoLabReports = [
  {
    _id: "lab-1",
    testName: "Blood Test",
    reportDate: "2025-08-10",
    notes: "CBC normal",
    fileUrl: "#",
  },
  {
    _id: "lab-2",
    testName: "X-ray",
    reportDate: "2025-07-30",
    notes: "No abnormalities",
    fileUrl: "#",
  },
];

const REPORT_TYPES = [
  "Blood Test",
  "X-ray",
  "MRI",
  "ECG",
  "Urine Test",
  "Lipid Profile",
  "Liver Function",
  "Kidney Function",
];

function Dashboard() {

  const [selectedLabReportType, setSelectedLabReportType] = useState(null);
  const [labReports, setLabReports] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [addRecordOpen, setAddRecordOpen] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [loadingLabs, setLoadingLabs] = useState(true);

  // New Record form state
  const [newRecord, setNewRecord] = useState({
    date: "",
    diagnosis: "",
    medications: "",
    doctor: "",
    hospital: "",
    followUpDate: "",
    notes: "",
  });

  const [newLabReport, setNewLabReport] = useState({
    reportDate: "",
    notes: "",
    fileUrl: "",
  });

 
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm MediBot. Ask me about your health records or symptoms.",
    },
  ]);
  const [userInput, setUserInput] = useState("");

  // Fetch Records
  useEffect(() => {
    const fetchRecords = async () => {
      setLoadingRecords(true);
      try {
        const res = await axios.get(`${API_BASE}/api/records`, {
          headers: authHeader(),
        });
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        const normalized = list.map(normalizeRecord);
        setMedicalRecords(normalized.length ? normalized : fallbackDemoRecords);
      } catch (err) {
        console.error("Error fetching records:", err?.response?.data || err);
        setMedicalRecords(fallbackDemoRecords);
      } finally {
        setLoadingRecords(false);
      }
    };
    fetchRecords();
  }, []);

  // Fetch Lab Reports
  useEffect(() => {
    const fetchLabs = async () => {
      setLoadingLabs(true);
      try {
        const res = await axios.get(`${API_BASE}/api/lab-reports`, {
          headers: authHeader(),
        });
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        const normalized = list.map(normalizeLabReport);
        setLabReports(
          normalized.length ? normalized : fallbackDemoLabReports
        );
      } catch (err) {
        console.error("Error fetching lab reports:", err?.response?.data || err);
        setLabReports(fallbackDemoLabReports);
      } finally {
        setLoadingLabs(false);
      }
    };
    fetchLabs();
  }, []);

  // Helpers
  const fmt = (d) => {
    try {
      if (!d) return "-";
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return String(d);
      return dt.toLocaleDateString();
    } catch {
      return String(d);
    }
  };

  const recordsHave = useMemo(
    () => medicalRecords.length > 0,
    [medicalRecords]
  );

  const reportsByType = useMemo(() => {
    const map = {};
    REPORT_TYPES.forEach((t) => (map[t] = []));
    labReports.forEach((r) => {
      const key = r.testName || "Other";
      map[key] = map[key] || [];
      map[key].push(r);
    });
    return map;
  }, [labReports]);

  // Record CRUD
  const handleSaveEdit = async () => {
    if (!editRecord?._id) return;
    try {
      const payload = toBackendPayload(editRecord);
      let updated;
      try {
        const res = await axios.put(
          `${API_BASE}/api/records/${editRecord._id}`,
          payload,
          { headers: { ...authHeader(), "Content-Type": "application/json" } }
        );
        updated = normalizeRecord(res.data);
      } catch {
        updated = { ...editRecord };
      }
      setMedicalRecords((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
      setEditRecord(null);
    } catch (err) {
      console.error("Error updating record:", err?.response?.data || err);
    }
  };

  const handleDeleteRecord = async (id) => {
    try {
      try {
        await axios.delete(`${API_BASE}/api/records/${id}`, {
          headers: authHeader(),
        });
      } catch {
        /* demo mode */
      }
      setMedicalRecords((prev) => prev.filter((rec) => rec._id !== id));
    } catch (err) {
      console.error("Error deleting record:", err?.response?.data || err);
    }
  };

  const handleCreateRecord = async () => {
    const payload = {...toBackendPayload(newRecord), date: new Date(newRecord.date).toISOString() };
    
console.log("Sending payload:", payload);

     
      
    try {
      let created;
      try {
        const res = await axios.post(`${API_BASE}/api/records`, payload, {
          headers: { ...authHeader(), "Content-Type": "application/json" },
        });
        created = normalizeRecord(res.data);
      } catch {
        created = normalizeRecord({
          _id: String(Date.now()),
          ...payload,
        });
      }

      setMedicalRecords((prev) => [created, ...prev]);
      setAddRecordOpen(false);
      setNewRecord({
        date: "",
        diagnosis: "",
        medications: "",
        doctor: "",
        hospital: "",
        followUpDate: "",
        notes: "",
      });
    } catch (err) {
      console.error("Error creating record:", err?.response?.data || err);
    }
  };

  // Lab Report CRUD
  const handleCreateLabReport = async () => {
    if (!selectedLabReportType) return;
    const body = {
      testName: selectedLabReportType,
      reportDate: newLabReport.reportDate || new Date().toISOString(),
      results: { fileUrl: newLabReport.fileUrl || "" }, // store fileUrl inside results
      notes: newLabReport.notes || "",
    };
    try {
      let created;
      try {
        const res = await axios.post(`${API_BASE}/api/lab-reports`, body, {
          headers: { ...authHeader(), "Content-Type": "application/json" },
        });
        created = normalizeLabReport(res.data);
      } catch {
        created = normalizeLabReport({
          _id: String(Date.now()),
          ...body,
        });
      }
      setLabReports((prev) => [created, ...prev]);
      setNewLabReport({ reportDate: "", notes: "", fileUrl: "" });
    } catch (err) {
      console.error("Error creating lab report:", err?.response?.data || err);
    }
  };

  const handleDeleteLabReport = async (id) => {
    try {
      try {
        await axios.delete(`${API_BASE}/api/lab-reports/${id}`, {
          headers: authHeader(),
        });
      } catch {
        /* demo mode */
      }
      setLabReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting lab report:", err?.response?.data || err);
    }
  };

  // Chatbot
  const handleSendMessage = () => {
    const msg = userInput.trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { sender: "user", text: msg }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `You asked: "${msg}". I'll assist you soon!` },
      ]);
    }, 1000);
    setUserInput("");
  };

  return (
    <div className="dashboard-container">
      {/* HERO */}
      <div className="hero-section">
        <img src="/images/dashboard.jpg" alt="Medical" className="hero-img" />
        <div className="hero-text">
          <h1>Keep track of your health journey</h1>
          <p>Upload and view all your medical documents here.</p>
        </div>
      </div>

      {/* REPORT LIBRARY */}
      <h2 className="section-title">Lab Reports</h2>
      <div className="lab-section" style={{ flexWrap: "wrap" }}>
        {REPORT_TYPES.map((test) => (
          <button
            key={test}
            className="lab-btn"
            onClick={() => setSelectedLabReportType(test)}
            title={`View ${test} reports`}
          >
            {test} View
            {/* count badge */}
            <span
              style={{
                marginLeft: 8,
                padding: "2px 8px",
                background: "#111827",
                color: "#fff",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {(reportsByType[test] || []).length}
            </span>
          </button>
        ))}
      </div>

      {/* RECORDS */}
      <div className="records-section">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <h2 className="section-title" style={{ margin: 0 }}>
            Your Medical Records
          </h2>
          <button
            className="save-btn"
            onClick={() => setAddRecordOpen(true)}
            title="Add a new record"
          >
            + Add New Record
          </button>
        </div>

        <div className="table-wrapper" style={{ marginTop: 12 }}>
          <table className="records-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Diagnosis</th>
                <th>Medications</th>
                <th>Doctor</th>
                <th>Hospital</th>
                <th>Follow-Up</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingRecords && (
                <tr>
                  <td colSpan="8" className="muted center">
                    Loading records…
                  </td>
                </tr>
              )}

              {!loadingRecords && !recordsHave && (
                <tr>
                  <td colSpan="8" className="muted center">
                    No records yet.
                  </td>
                </tr>
              )}

              {!loadingRecords &&
                recordsHave &&
                medicalRecords.map((record) => (
                  <tr key={record._id}>
                    <td>{fmt(record.date)}</td>
                    <td>{record.diagnosis || "-"}</td>
                    <td>{record.medications || "-"}</td>
                    <td>{record.doctor || "-"}</td>
                    <td>{record.hospital || "-"}</td>
                    <td>{record.followUpDate ? fmt(record.followUpDate) : "-"}</td>
                    <td style={{ maxWidth: 260 }}>
                      {record.notes || "-"}
                    </td>
                    <td>
                      <button
                        className="btn view-btn"
                        onClick={() => setSelectedRecord(record)}
                      >
                        View
                      </button>
                      <button
                        className="btn edit-btn"
                        onClick={() => setEditRecord(record)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn delete-btn"
                        onClick={() => handleDeleteRecord(record._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Floating Chatbot Button */}
      <button
        type="button"
        className="chatbot-float"
        onClick={() => setShowChat((s) => !s)}
        aria-label="Open MediBot"
      >
        <img src="/images/medibot.jpg" alt="MediBot" className="chatbot-icon" />
      </button>

      {/* ✅ Chat Window */}
      {showChat && (
        <div className="chatbot-window">
          <h4>MediBot</h4>
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <p key={i} className={msg.sender === "bot" ? "bot-msg" : "user-msg"}>
                <strong>{msg.sender === "bot" ? "Bot" : "You"}:</strong> {msg.text}
              </p>
            ))}
          </div>
          <div className="chat-input-container">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask MediBot..."
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}

      {/* ======== MODALS ======== */}

      {/* Modal: View Record */}
      {selectedRecord && (
        <div className="modal-overlay" onClick={() => setSelectedRecord(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Medical Record Details</h2>
            <p><strong>Date:</strong> {fmt(selectedRecord.date)}</p>
            <p><strong>Doctor:</strong> {selectedRecord.doctor || "-"}</p>
            <p><strong>Hospital:</strong> {selectedRecord.hospital || "-"}</p>
            <p><strong>Follow-Up:</strong> {selectedRecord.followUpDate ? fmt(selectedRecord.followUpDate) : "-"}</p>
            <p><strong>Diagnosis:</strong> {selectedRecord.diagnosis || "-"}</p>
            <p><strong>Medications:</strong> {selectedRecord.medications || "-"}</p>
            <p><strong>Doctor Notes:</strong> {selectedRecord.notes || "-"}</p>
            {Array.isArray(selectedRecord.tests) && selectedRecord.tests.length > 0 && (
              <ul>
                {selectedRecord.tests.map((t, idx) => <li key={idx}>{t}</li>)}
              </ul>
            )}
            {selectedRecord.reportFile && (
              <a href={selectedRecord.reportFile} target="_blank" rel="noreferrer" className="download-btn">
                Download Report
              </a>
            )}
            <button onClick={() => setSelectedRecord(null)} className="close-btn">Close</button>
          </div>
        </div>
      )}

      {/* Modal: Edit Record */}
      {editRecord && (
        <div className="modal-overlay" onClick={() => setEditRecord(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Medical Record</h2>

            <label>Date:</label>
            <input
              type="date"
              value={editRecord.date || ""}
              onChange={(e) => setEditRecord({ ...editRecord, date: e.target.value })}
            />

            <label>Diagnosis:</label>
            <input
              type="text"
              value={editRecord.diagnosis || editRecord.title || ""}
              onChange={(e) => setEditRecord({ ...editRecord, diagnosis: e.target.value })}
            />

            <label>Medications (comma-separated):</label>
            <input
              type="text"
              value={
                editRecord.medications ||
                (Array.isArray(editRecord.tags) ? editRecord.tags.join(", ") : "")
              }
              onChange={(e) => setEditRecord({ ...editRecord, medications: e.target.value })}
            />

            <label>Doctor:</label>
            <input
              type="text"
              value={editRecord.doctor || ""}
              onChange={(e) => setEditRecord({ ...editRecord, doctor: e.target.value })}
            />

            <label>Hospital:</label>
            <input
              type="text"
              value={editRecord.hospital || ""}
              onChange={(e) => setEditRecord({ ...editRecord, hospital: e.target.value })}
            />

            <label>Follow-Up Date:</label>
            <input
              type="date"
              value={editRecord.followUpDate || ""}
              onChange={(e) => setEditRecord({ ...editRecord, followUpDate: e.target.value })}
            />

            <label>Doctor Notes:</label>
            <textarea
              value={editRecord.notes || editRecord.description || ""}
              onChange={(e) => setEditRecord({ ...editRecord, notes: e.target.value })}
            />

            <div className="modal-actions">
              <button onClick={handleSaveEdit} className="save-btn">Save</button>
              <button onClick={() => setEditRecord(null)} className="close-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Record */}
      {addRecordOpen && (
        <div className="modal-overlay" onClick={() => setAddRecordOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Medical Record</h2>

            <label>Date:</label>
            <input
              type="date"
              value={newRecord.date}
              onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
            />

            <label>Diagnosis:</label>
            <input
              type="text"
              value={newRecord.diagnosis}
              onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
            />

            <label>Medications (comma-separated):</label>
            <input
              type="text"
              value={newRecord.medications}
              onChange={(e) => setNewRecord({ ...newRecord, medications: e.target.value })}
            />

            <label>Doctor:</label>
            <input
              type="text"
              value={newRecord.doctor}
              onChange={(e) => setNewRecord({ ...newRecord, doctor: e.target.value })}
            />

            <label>Hospital:</label>
            <input
              type="text"
              value={newRecord.hospital}
              onChange={(e) => setNewRecord({ ...newRecord, hospital: e.target.value })}
            />

            <label>Follow-Up Date:</label>
            <input
              type="date"
              value={newRecord.followUpDate}
              onChange={(e) => setNewRecord({ ...newRecord, followUpDate: e.target.value })}
            />

            <label>Doctor Notes:</label>
            <textarea
              value={newRecord.notes}
              onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
            />

            <div className="modal-actions">
              <button onClick={handleCreateRecord} className="save-btn">Create</button>
              <button onClick={() => setAddRecordOpen(false)} className="close-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Report Library for a chosen type */}
      {selectedLabReportType && (
        <div className="modal-overlay" onClick={() => setSelectedLabReportType(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedLabReportType} Reports</h2>

            <div className="table-wrapper" style={{ marginTop: 10 }}>
              <table className="records-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Notes</th>
                    <th>File</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingLabs && (
                    <tr>
                      <td colSpan="4" className="muted center">Loading…</td>
                    </tr>
                  )}
                  {!loadingLabs &&
                    (reportsByType[selectedLabReportType] || []).map((r) => (
                      <tr key={r._id}>
                        <td>{fmt(r.reportDate)}</td>
                        <td style={{ maxWidth: 320 }}>{r.notes || "-"}</td>
                        <td>
                          {r.fileUrl ? (
                            <a href={r.fileUrl} target="_blank" rel="noreferrer" className="download-btn">
                              Open
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          <button className="btn delete-btn" onClick={() => handleDeleteLabReport(r._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  {!loadingLabs &&
                    (reportsByType[selectedLabReportType] || []).length === 0 && (
                      <tr>
                        <td colSpan="4" className="muted center">No reports yet.</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>

            {/* Add new report */}
            <h3 style={{ marginTop: 16 }}>Add Report</h3>
            <label>Report Date:</label>
            <input
              type="date"
              value={newLabReport.reportDate}
              onChange={(e) => setNewLabReport({ ...newLabReport, reportDate: e.target.value })}
            />
            <label>File URL:</label>
            <input
              type="url"
              placeholder="https://… (PDF/Image)"
              value={newLabReport.fileUrl}
              onChange={(e) => setNewLabReport({ ...newLabReport, fileUrl: e.target.value })}
            />
            <label>Notes:</label>
            <textarea
              placeholder="Summary / remarks"
              value={newLabReport.notes}
              onChange={(e) => setNewLabReport({ ...newLabReport, notes: e.target.value })}
            />

            <div className="modal-actions">
              <button onClick={handleCreateLabReport} className="save-btn">Add Report</button>
              <button onClick={() => setSelectedLabReportType(null)} className="close-btn">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
