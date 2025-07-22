import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export default function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: "white !important" }}
        className="w-full px-4 py-3 text-left rounded-full border border-gray-300 bg-white text-sm shadow-sm flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <span>{value || placeholder}</span>
        <ChevronDownIcon className="w-5 h-5 text-logo-400" />
      </button>

      {isOpen && (
        <ul
          style={{ background: "white !important", zIndex: 999 }}
          className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden text-sm max-h-60 overflow-y-auto"
        >
          {options.map((option, index) => (
            <>
              <li
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 hover:bg-indigo-100 cursor-pointer ${
                  option === value ? "bg-indigo-50 font-medium" : ""
                }`}
                style={{ cursor: "pointer", textAlign: "left" }}
              >
                {option}
              </li>
              {options.length - 1 !== index && (
                <div
                  style={{
                    width: "80%",
                    height: 1,
                    background: "#0000004f",
                    marginLeft: "10%",
                    borderRadius: 100,
                  }}
                ></div>
              )}
            </>
          ))}
        </ul>
      )}
    </div>
  );
}
