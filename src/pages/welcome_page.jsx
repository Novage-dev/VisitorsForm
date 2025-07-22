import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import welcomeImg from "@/assets/images/welcome.jpg"; // Adjust path if needed
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function Welcome() {
  const navigate = useNavigate();
  const [inputPassword, setInputPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [updateState, setUpdateState] = useState({
    updating: false,
    error: null,
  });

  const correctPassword = import.meta.env.VITE_ACCESS_PASSWORD; // ⛔ You can move this to .env for safety

  const handleAccess = () => {
    if (inputPassword === correctPassword) {
      toast.success("Access granted");
      navigate("/form");
    } else {
      toast.error("Incorrect password");
    }
  };

  return (
    <div
      className="min-h-[100%] min-w-[100%] flex flex-col justify-center items-center bg-white px-6"
      style={{
        width: "100%",
        height: "94vh",
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
        <img
          src={welcomeImg}
          alt="welcome_illustration"
          className="w-60 mb-6"
        />
        <h1 className="text-2xl font-bold text-logo-800 mb-2">Hello</h1>
        <p
          className="text-logo-500 text-sm text-center mb-8 mt-5"
          style={{ fontWeight: "bold" }}
        >
          Welcome to GLC new visitors registration form!
        </p>

        <form
          className="w-full max-w-sm space-y-4 mb-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <PasswordField
            name="password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            placeholder="Enter Password"
            show={showPassword}
            setShow={setShowPassword}
          />
        </form>

        <button
          className="bg-logo text-white py-3 rounded-full font-semibold w-full"
          style={{ borderRadius: "calc(infinity * 1px)" }}
          onClick={handleAccess}
        >
          Enter
        </button>
      </div>
    </div>
  );
}

// ✅ Reusable Password Field
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
