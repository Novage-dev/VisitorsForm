import React from "react";
import { NavLink } from "react-router-dom";
import "@/styles/tabbar.css";
import {
  ClipboardDocumentListIcon as ListSolid,
  TableCellsIcon as TableSolid,
} from "@heroicons/react/24/solid";
import {
  ClipboardDocumentListIcon as ListOutline,
  TableCellsIcon as TableOutline,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const tabs = [
  {
    name: "Form",
    path: "/form",
    icon: { active: ListSolid, inactive: ListOutline },
  },
];

const admin_tabs = [
  {
    name: "Registration Form",
    path: "/form",
    icon: { active: ListSolid, inactive: ListOutline },
  },
  {
    name: "Registered Vistors",
    path: "/data",
    icon: { active: TableSolid, inactive: TableOutline },
  },
];

export default function TabBar() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  if (loading) return null;
  if (error) return <p className="text-red-500">{error}</p>;
  const role = "admin"; // This should be dynamically set based on user role
  const currentTabs = role === "admin" ? admin_tabs : tabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-6 py-3 flex justify-around rounded-t-2xl z-50">
      {currentTabs.map(({ name, path, icon }) => (
        <NavLink
          to={path}
          key={name}
          end={path === "/"}
          className="flex flex-col items-center text-xs relative"
        >
          {({ isActive }) => {
            const Icon = isActive ? icon.active : icon.inactive;

            return (
              <motion.div
                initial={{ scale: 0.9, opacity: 0.6 }}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  opacity: isActive ? 1 : 0.6,
                }}
                transition={{ duration: 0.1 }}
                className={`flex flex-col items-center ${
                  isActive ? "txt_color_main font-semibold" : "text-logo-400"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="mt-1">{name}</span>
              </motion.div>
            );
          }}
        </NavLink>
      ))}
    </nav>
  );
}
