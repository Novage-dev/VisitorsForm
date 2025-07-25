import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "#/supabase";
import * as XLSX from "xlsx";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function VisitorTable() {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [exportStatus, setExportStatus] = useState("idle");

  // ✅ Fetch data from Supabase
  const fetchVisitors = async () => {
    const { data, error } = await supabase.from("newVisitors").select("*");
    if (error) {
      toast.error("Failed to fetch data");
    } else {
      setRowData(data);
      if (data.length > 0) {
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
                          objectFit: "contain",
                        }}
                      />
                    ) : null,
                  width: 50,
                };
              }

              // Estimate minWidth based on longest content
              const maxContentLength = data.reduce((max, row) => {
                const value = row[key] ?? "";
                const stringLength = String(value).length;
                return Math.max(max, stringLength);
              }, 0);

              const estimatedMinWidth = maxContentLength * 8 + 10;
              const finalMinWidth = Math.max(estimatedMinWidth, 120);

              return {
                field: key,
                headerName: key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase()),
                sortable: true,
                filter: true,
                minWidth: finalMinWidth,
                flex: 1,
              };
            }),
        ];

        setColDefs(columns);
      }
    }
  };

  // ✅ Export to Excel (Windows + Mobile only)
  const exportToExcel = async () => {
    const isWindows = navigator.platform.includes("Win");
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (!isWindows && !isMobile) {
      toast.error("Excel export is only available on Windows or mobile.");
      return;
    }

    const exportPromise = new Promise(async (resolve, reject) => {
      setExportStatus("loading");

      try {
        const formattedVisitors = rowData.map((visitor) => ({
          Name: visitor.full_name,
          Phone: visitor.primary_phone_num,
          Address: visitor.address,
          Gender: visitor.gender,
          Age: visitor.age,
          "Inviter Name": visitor.iow_name,
          "Inviter Phone": visitor.iow_phone_num,
          "Follow Up Leader": visitor.follow_up_leader,
          "Foundation Status": visitor.foundation_class_status,
          "Ministers Status": visitor.ministers_training_status,
          "Ministry Joined": visitor.ministry_joined,
          "Cell Group Status": visitor.cell_group_status,
          Registered: visitor.registered_at,
        }));

        const ws = XLSX.utils.json_to_sheet(formattedVisitors);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Visitors");

        XLSX.writeFile(wb, "visitors.xlsx");
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        setExportStatus("idle");
      }
    });

    toast.promise(exportPromise, {
      loading: "Exporting...",
      success: "Download ready!",
      error: "Export failed!",
    });
  };

  // ✅ Admin login with password
  const handleLogin = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setAuthenticated(true);
      fetchVisitors();
    } else {
      toast.error("Incorrect password");
    }
  };

  // ✅ Summary stats
  const summary = useMemo(() => {
    const total = rowData.length;
    const male = rowData.filter((v) => v.gender?.toLowerCase() === "m").length;
    const female = rowData.filter(
      (v) => v.gender?.toLowerCase() === "f"
    ).length;

    return { total, male, female };
  }, [rowData]);

  return (
    <div className="space-y-8 relative">
      <Toaster />

      {/* Header & Export */}
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

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryCard label="Total Visitors" value={summary.total} />
        <SummaryCard label="Male Visitors" value={summary.male} />
        <SummaryCard label="Female Visitors" value={summary.female} />
      </div>

      {/* AG Grid Table */}
      <div
        className="rounded-xl border border-gray-200 overflow-hidden shadow"
        style={{ height: 500 }}
      >
        <div className="ag-theme-quartz h-full w-full">
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              flex: 1,
            }}
            pagination={true}
            theme={themeQuartz}
            rowHeight={50}
          />
        </div>
      </div>

      {/* Password Modal */}
      {!authenticated && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", padding: "2rem" }}
        >
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Admin Access Required
            </h2>

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

// ✅ SummaryCard component
function SummaryCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center transition hover:shadow-md">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-800 break-words">{value}</p>
    </div>
  );
}

// ✅ Reusable password field with visibility toggle
const PasswordField = ({
  name,
  value,
  onChange,
  placeholder,
  show,
  setShow,
}) => {
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
