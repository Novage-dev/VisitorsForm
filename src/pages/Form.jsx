import React, { useState, useRef } from "react";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

import {
  UserCircleIcon,
  IdentificationIcon,
  CloudArrowUpIcon,
  MapPinIcon,
  CakeIcon,
  CalendarIcon,
  UserGroupIcon,
  PhoneIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import Dropdown from "@/components/basic_ui/options.jsx";

import { uploadVisitorData } from "@/utils/upload_data.js";

export default function Form() {
  const [loadingHere, setLoading] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    photo: null,
    fullName: "",
    primaryPhone: "",
    secondaryPhone: "",
    address: "",
    gender: "",
    age: "",
    visitationDate: "",
    inviterName: "",
    inviterPhone: "",
    followUpLeader: "",
    foundationStatus: "",
    foundationTeacher: "",
    ministersStatus: "",
    ministersTeacher: "",
    ministryJoined: "",
    cellGroupStatus: "",
    assignedCellGroup: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Saving visitor data...");

    const result = await uploadVisitorData(formData);

    if (result.success) {
      toast.success("Visitor registered successfully!", { id: toastId });
    } else {
      toast.error("Error: " + result.error, { id: toastId });
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-6 bg-white"
      style={{
        borderRadius: 13,
        paddingBottom: 25,
        paddingTop: 25,
        gap: 70,
      }}
    >
      <div
        className="flex flex-col justify-center items-center bg-white"
        style={{ maxWidth: 360, minWidth: 245, width: "100%" }}
      >
        <h2 className="text-2xl font-bold mb-2 text-logo-800">
          Register Member
        </h2>
        <p className="text-logo-500 text-sm mb-6">New Visitors Form</p>

        <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
          <ImageInput
            name="photo"
            value={formData.photo}
            onChange={(file) => setFormData({ ...formData, photo: file })}
            setFileInputRef={fileInputRef}
            setHandleImageChange={handlePhotoChange}
          />

          <InputField
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Name"
            Icon={IdentificationIcon}
          />
          <InputField
            name="primaryPhone"
            type="tel"
            value={formData.primaryPhone}
            onChange={handleChange}
            placeholder="Primary Phone"
            Icon={PhoneIcon}
          />
          <InputField
            name="secondaryPhone"
            type="tel"
            value={formData.secondaryPhone}
            onChange={handleChange}
            placeholder="Secondary Phone"
            Icon={PhoneIcon}
          />

          <InputField
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            Icon={MapPinIcon}
          />
          <CustomDropdownField
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder={"Gender"}
            options={["Male", "Female"]}
          />
          <InputField
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            Icon={CakeIcon}
          />
          <InputField
            name="visitationDate"
            type="date"
            value={formData.visitationDate}
            onChange={handleChange}
            placeholder="Visitation Date"
            Icon={CalendarIcon}
          />
          <InputField
            name="inviterName"
            value={formData.inviterName}
            onChange={handleChange}
            placeholder="Inviter Name"
            Icon={UserCircleIcon}
          />
          <InputField
            name="inviterPhone"
            type="tel"
            value={formData.inviterPhone}
            onChange={handleChange}
            placeholder="Inviter Phone"
            Icon={PhoneIcon}
          />
          <InputField
            name="followUpLeader"
            value={formData.followUpLeader}
            onChange={handleChange}
            placeholder="Follow Up Leader"
            Icon={UserCircleIcon}
          />
          <CustomDropdownField
            name="foundationStatus"
            value={formData.foundationStatus}
            onChange={handleChange}
            placeholder={"Foundation Status"}
            options={[
              "Didn't start",
              "Started 1",
              "FInished 1",
              "Started 2",
              "FInished 2",
            ]}
          />
          <InputField
            name="foundationTeacher"
            value={formData.foundationTeacher}
            onChange={handleChange}
            placeholder="Foundation Teacher"
            Icon={UserCircleIcon}
          />
          <CustomDropdownField
            name="ministersStatus"
            value={formData.ministersStatus}
            onChange={handleChange}
            placeholder={"Minister's Training Status"}
            options={[
              "Didn't start",
              "Stated",
              "FInished",
              "Has Joined A Ministry",
            ]}
          />
          <InputField
            name="ministersTeacher"
            value={formData.ministersTeacher}
            onChange={handleChange}
            placeholder="Ministers Teacher"
            Icon={UserCircleIcon}
          />
          <InputField
            name="ministryJoined"
            value={formData.ministryJoined}
            onChange={handleChange}
            placeholder="Ministry Joined"
            Icon={BuildingLibraryIcon}
          />
          <CustomDropdownField
            name="cellGroupStatus"
            value={formData.cellGroupStatus}
            onChange={handleChange}
            placeholder={"Cell Group Status"}
            options={["Didn't Join", "Joined"]}
          />
          <InputField
            name="assignedCellGroup"
            value={formData.assignedCellGroup}
            onChange={handleChange}
            placeholder="Assigned Cell Group"
            Icon={UserGroupIcon}
          />

          <button
            type="submit"
            className={`w-full mt-5 py-3 rounded-full font-semibold shadow-md transition ${
              loadingHere
                ? "bg-gray-400"
                : "bg-logo hover:bg-indigo-700 text-white"
            }`}
            disabled={loadingHere}
          >
            {loadingHere ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-md p-2"
      required
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-md p-2"
      required
    >
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

// Reusable Input component
const InputField = ({
  name,
  value,
  onChange,
  placeholder,
  Icon,
  type = "text",
}) => {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-full px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <Icon className="w-5 h-5 text-logo-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
    </div>
  );
};

// Reusable Password Field
const ImageInput = ({ name, value, setFileInputRef, setHandleImageChange }) => {
  return (
    <div
      className="relative w-[150px] h-[200px] border-2 border-dashed border-gray-400 rounded-md overflow-hidden cursor-pointer flex items-center justify-center hover:border-indigo-500"
      onClick={() => setFileInputRef.current.click()}
      style={{ width: "100%", borderRadius: "12px" }}
    >
      {value ? (
        <div>
          <img
            src={URL.createObjectURL(value)}
            alt="Preview"
            className="w-full h-full object-contain"
          />
          <span style={{}}>click to change</span>
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-400">
          <CloudArrowUpIcon className="w-8 h-8 mb-2" />
          <span className="text-sm">Click to upload</span>
        </div>
      )}
      <input
        type="file"
        name={name}
        accept="image/*"
        ref={setFileInputRef}
        className="hidden"
        onChange={setHandleImageChange}
      />
    </div>
  );
};

// Reusable Dropdown Field
const CustomDropdownField = ({
  name,
  placeholder,
  value,
  onChange,
  Icon,
  options,
  hasIconPadding = false,
}) => {
  const handleChange = (selectedValue) => {
    let finalValue = selectedValue;

    onChange({
      target: {
        name,
        value: finalValue,
      },
    });
  };

  return (
    <div className="relative border rounded-full bg-white">
      <div className={hasIconPadding ? "" : ""}>
        <Dropdown
          options={options}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </div>
      {/* {Icon && (
        <Icon className="w-5 h-5 text-logo-400 absolute left-4 top-1/2 transform -translate-y-1/2 mr-10" />
      )} */}
    </div>
  );
};
