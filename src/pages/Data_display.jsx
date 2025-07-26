import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { supabase } from "#/supabase";
import toast, { Toaster } from "react-hot-toast";
import * as XLSX from "xlsx";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function VisitorTable() {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [exportStatus, setExportStatus] = useState("idle");
  const [editMode, setEditMode] = useState(false);
  const [updatedRows, setUpdatedRows] = useState({});

  const fetchVisitors = async () => {
    const { data, error } = await supabase.from("newVisitors").select("*");
    if (error) {
      toast.error("Failed to fetch data");
    } else {
      setRowData(data);
      generateColDefs(data);
    }
  };

  const generateColDefs = (data) => {
    if (!data.length) return;
    const columns = [
      {
        headerName: "#",
        valueGetter: "node.rowIndex + 1",
        width: 40,
        suppressMovable: true,
      },
      ...Object.keys(data[0])
        .filter((key) => key !== "id")
        .map((key) => {
          if (key === "image") {
            return {
              field: key,
              headerName: "Photo",
              cellRenderer: (params) =>
                params.value ? (
                  <img
                    src={params.value}
                    alt="visitor"
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : null,
              width: 80,
              minWidth: 80,
            };
          }

          const maxLength = data.reduce((max, row) => {
            const value = row[key] ?? "";
            return Math.max(max, String(value).length);
          }, 0);

          return {
            field: key,
            headerName: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            editable: editMode && key !== "image",
            minWidth: Math.max(120, maxLength * 8 + 10),
            flex: 1,
          };
        }),
    ];

    if (editMode) {
      columns.push({
        headerName: "Actions",
        field: "actions",
        width: 100,
        cellRenderer: (params) => (
          <button
            onClick={() => handleDeleteRow(params.data.id)}
            className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        ),
      });
    }

    setColDefs(columns);
  };

  const handleLogin = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setAuthenticated(true);
      fetchVisitors();
    } else {
      toast.error("Incorrect password");
    }
  };

  const summary = useMemo(() => {
    const total = rowData.length;
    const male = rowData.filter((v) => v.gender?.toLowerCase() === "m").length;
    const female = rowData.filter((v) => v.gender?.toLowerCase() === "f").length;
    return { total, male, female };
  }, [rowData]);

  const exportToExcel = async () => {
    const isWindows = navigator.platform.includes("Win");
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (!isWindows && !isMobile) {
      toast.error("Excel export is only available on Windows or mobile.");
      return;
    }

    const formatted = rowData.map((v) => ({
      Name: v.full_name,
      Phone: v.primary_phone_num,
      Address: v.address,
      Gender: v.gender,
      Age: v.age,
      "Inviter Name": v.iow_name,
      "Inviter Phone": v.iow_phone_num,
      "Follow Up Leader": v.follow_up_leader,
      "Foundation Status": v.foundation_class_status,
      "Ministers Status": v.ministers_training_status,
      "Ministry Joined": v.ministry_joined,
      "Cell Group Status": v.cell_group_status,
      Registered: v.registered_at,
    }));

    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Visitors");
    XLSX.writeFile(wb, "visitors.xlsx");
  };

  const handleDeleteRow = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this visitor?");
    if (!confirm) return;

    const { error } = await supabase.from("newVisitors").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete visitor");
    } else {
      toast.success("Visitor deleted");
      fetchVisitors();
    }
  };

  const onCellEditRequest = useCallback((params) => {
    const id = params.data.id;
    setUpdatedRows((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [params.colDef.field]: params.newValue,
      },
    }));
  }, []);

  const handleSaveChanges = async () => {
    const confirm = window.confirm("Apply all changes?");
    if (!confirm) return;

    const updatePromises = Object.entries(updatedRows).map(([id, updates]) =>
      supabase.from("newVisitors").update(updates).eq("id", id)
    );

    try {
      await Promise.all(updatePromises);
      toast.success("All changes saved");
      setUpdatedRows({});
      fetchVisitors();
    } catch (err) {
      toast.error("Failed to save changes");
    }
  };

  const toggleEditMode = () => {
    const newMode = !editMode;
    setEditMode(newMode);
    if (!newMode) setUpdatedRows({});
    generateColDefs(rowData);
  };

  return (
    <div className="space-y-8 relative">
      <Toaster />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Visitors Dashboard</h2>
        <button
          onClick={exportToExcel}
          disabled={exportStatus === "loading"}
          className="px-4 py-2 rounded-lg bg-amber-200 text-logo-800 font-semibold shadow hover:bg-amber-300 transition disabled:opacity-50"
        >
          {exportStatus === "loading" ? "Exporting..." : "Download Excel"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryCard label="Total Visitors" value={summary.total} />
        <SummaryCard label="Male Visitors" value={summary.male} />
        <SummaryCard label="Female Visitors" value={summary.female} />
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden shadow ag-theme-alpine" style={{ height: 500 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            minWidth: 50,
            flex: 1,
          }}
          editType="fullRow"
          rowHeight={50}
          pagination
          onCellEditRequest={onCellEditRequest}
        />
      </div>

      {/* Floating Buttons */}
      {authenticated && (
        <div className="fixed bottom-6 right-6 space-y-4 z-50">
          <button
            onClick={toggleEditMode}
            className={`p-3 rounded-full shadow-lg ${
              editMode ? "bg-yellow-500" : "bg-indigo-600"
            } text-white hover:opacity-90 transition`}
            title="Toggle Edit Mode"
          >
            <PencilIcon className="h-6 w-6" />
          </button>

          {editMode && Object.keys(updatedRows).length > 0 && (
            <button
              onClick={handleSaveChanges}
              className="p-3 rounded-full shadow-lg bg-green-600 text-white hover:bg-green-700 transition"
              title="Save Changes"
            >
              <CheckIcon className="h-6 w-6" />
            </button>
          )}
        </div>
      )}

      {/* Password Modal */}
      {!authenticated && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Admin Access Required</h2>
            <form
              className="w-full max-w-sm space-y-4 mb-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <PasswordField
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                show={showPassword}
                setShow={setShowPassword}
              />
            </form>
            <button
              onClick={handleLogin}
              className="w-full bg-logo text-white py-2 rounded-full hover:bg-indigo-700 transition"
            >
              Enter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center hover:shadow-md">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

const PasswordField = ({ name, value, onChange, placeholder, show, setShow }) => {
  const Icon = show ? EyeSlashIcon : EyeIcon;
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-full px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <LockClosedIcon className="w-5 h-5 text-logo-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
      <Icon
        className="w-5 h-5 text-logo-400 absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
        onClick={() => setShow(!show)}
      />
    </div>
  );
};
