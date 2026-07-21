import React, { useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info, FileSpreadsheet } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";
import FileUploadBox from "../components/FileUploadBox";
import PreviewTable from "../components/PreviewTable";
import SampleDownloadBox from "../components/SampleDownloadBox";
import { importStudents } from "../api/institute_admin/students_api";

export default function ImportStudents() {
  const [preview, setPreview] = useState([]);
  const [errors, setErrors] = useState({});
  const [showResultModal, setShowResultModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleFile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheet = workbook.SheetNames[0];
      const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
      setPreview(rows);
      validate(rows);
    };

    reader.readAsBinaryString(file);
  };

  // Edit cell
  const handleEdit = (rowIdx, col, value) => {
    const updated = [...preview];
    updated[rowIdx] = { ...updated[rowIdx], [col]: value };
    setPreview(updated);
    validate(updated);
  };

  // Add row
  const handleAddRow = () => {
    if (!preview.length) return;
    const emptyRow = {};
    Object.keys(preview[0]).forEach((k) => (emptyRow[k] = ""));
    const updated = [...preview, emptyRow];
    setPreview(updated);
    validate(updated);
  };

  // VALIDATION
  const validate = (rows) => {
    const err = {};
    const classSectionRollSet = new Set();
    const rfidSet = new Set();
    const qrSet = new Set();
    const faceSet = new Set();

    rows.forEach((r, i) => {
      // 🔹 normalize column access (case-safe)
      const cls = String(r.ClassName ?? r.className ?? r.Class ?? r.class ?? "").trim();
      const sec = String(r["Section/Batch"] ?? r.Section ?? r.section ?? r.Batch ?? r.batch ?? "").trim();
      const roll = String(r.RollNo ?? r.rollNo ?? r.roll ?? "").trim();
      const rfid = String(r.RfidCardId ?? r.RFIDCardId ?? r.rfidCardId ?? r.RFID ?? r.rfid ?? "").trim();
      const qr = String(r.QrCode ?? r.QR ?? r.qr ?? "").trim();
      const face = String(r.FaceId ?? r.faceId ?? "").trim();

      // 1️⃣ basic REQUIRED
      const parentPhone = String(r.ParentPhone ?? r.parentPhone ?? "").trim();
      if (!cls || !sec || !roll || !parentPhone) {
        err[i] = "Class, Section, RollNo & ParentPhone required";
        return;
      }

      // 2️⃣ Roll unique per Class + Section (local check)
      const rollKey = `${cls}-${sec}-${roll}`;
      if (classSectionRollSet.has(rollKey)) {
        err[i] = `Duplicate RollNo ${roll} in this list`;
        return;
      }
      classSectionRollSet.add(rollKey);

      // 3️⃣ RFID unique (if provided)
      if (rfid && rfidSet.has(rfid)) {
        err[i] = "Duplicate RFID in this list";
        return;
      }
      if (rfid) rfidSet.add(rfid);

      // 4️⃣ QR unique (if provided)
      if (qr && qrSet.has(qr)) {
        err[i] = "Duplicate QR in this list";
        return;
      }
      if (qr) qrSet.add(qr);

      // 5️⃣ FaceID unique (if provided)
      if (face && faceSet.has(face)) {
        err[i] = "Duplicate FaceId in this list";
        return;
      }
      if (face) faceSet.add(face);
    });

    setErrors(err);
    return Object.keys(err).length === 0;
  };


  const normalizeRows = (rows) => {
    return rows.map((r) => ({
      RollNo: String(r.RollNo ?? r.rollNo ?? r.roll ?? "").trim(),
      Name: String(r.Name ?? r.name ?? "").trim(),
      ClassName: String(r.ClassName ?? r.Class ?? r.class ?? "").trim(),
      Section: String(r["Section/Batch"] ?? r.Section ?? r.section ?? r.Batch ?? r.batch ?? "").trim(),
      Email: r.Email ?? "",
      StudentPhone: String(r.StudentPhone ?? r.studentPhone ?? "").trim(),
      ParentPhone: String(r.ParentPhone ?? r.parentPhone ?? "").trim(),
      RfidCardId: String(
        r.RfidCardId ?? r.RFID ?? r.rfid ?? ""
      ).trim(),
      QrCode: String(r.QrCode ?? r.QR ?? r.qr ?? "").trim(),
      FaceId: r.FaceId ?? r.faceId ?? null,
    }));
  };

  const handleDownloadSample = () => {
    const sampleData = [
      {
        RollNo: "101",
        Name: "Abhishek Kumar",
        ClassName: "12",
        "Section/Batch": "A",
        Email: "student@example.com",
        StudentPhone: "9876543210",
        ParentPhone: "9123456789",
        RfidCardId: "12345678",
        QrCode: "STU-QR-001",
        FaceId: "F1",
      },
      {
        RollNo: "102",
        Name: "Rahul Singh",
        ClassName: "12",
        "Section/Batch": "B",
        Email: "rahul@example.com",
        StudentPhone: "8877665544",
        ParentPhone: "9988776655",
        RfidCardId: "87654321",
        QrCode: "STU-QR-002",
        FaceId: "F2",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "Student_Import_Template.xlsx");
  };



  // FINAL IMPORT
  const handleImport = async () => {
    const normalized = normalizeRows(preview);

    if (!validate(normalized)) {
      toast.error("Fix validation errors first");
      return;
    }

    setLoading(true);
    try {
      const res = await importStudents({ students: normalized });
      
      setImportResult(res);
      setShowResultModal(true);
      
      if (res.inserted > 0 || res.updated > 0) {
        setPreview([]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Import failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Import Students</h1>

      <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-center text-white shadow-xl shadow-blue-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
          <h3 className="text-2xl font-bold mb-2">Student Excel Template</h3>
          <p className="text-blue-100 opacity-90 max-w-md">
            Download the latest template with specialized columns for **QR-Codes**, **RFID-Cards**, and **Section/Batch** management.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadSample}
          className="relative z-10 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
        >
          <FileSpreadsheet className="w-5 h-5" />
          Download Template
        </motion.button>
      </div>

      <FileUploadBox onFileSelect={handleFile} />

      {preview.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <PreviewTable
            rows={preview}
            errors={errors}
            onEdit={handleEdit}
            onAddRow={handleAddRow}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-2 disabled:bg-gray-400 shadow-lg shadow-blue-200"
            onClick={handleImport}
            disabled={loading || Object.keys(errors).length > 0}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Importing...
              </>
            ) : (
              `Import ${preview.length} Students`
            )}
          </motion.button>
        </div>
      )}

      {/* Modern Result Modal */}
      <AnimatePresence>
        {showResultModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Import Summary</h2>
                  <p className="text-gray-500">Processed {preview.length || 0} student records</p>
                </div>
                <button
                  onClick={() => setShowResultModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 p-4 rounded-2xl border border-green-100 text-center">
                  <div className="text-3xl font-bold text-green-600">{importResult?.inserted || 0}</div>
                  <div className="text-sm font-medium text-green-800">New Added</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
                  <div className="text-3xl font-bold text-blue-600">{importResult?.updated || 0}</div>
                  <div className="text-sm font-medium text-blue-800">Updated</div>
                </div>
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-center">
                  <div className="text-3xl font-bold text-red-600">{importResult?.errors?.length || 0}</div>
                  <div className="text-sm font-medium text-red-800">Failed</div>
                </div>
              </div>

              {importResult?.errors?.length > 0 && (
                <div className="flex-1 overflow-hidden flex flex-col">
                  <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <AlertCircle className="text-red-500 w-5 h-5" />
                    Error Details
                  </h3>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                    {importResult.errors.map((err, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm text-gray-600 flex gap-3">
                        <span className="font-bold text-gray-400">#{i + 1}</span>
                        {err}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowResultModal(false)}
                className="mt-8 w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
              >
                Close Summary
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
