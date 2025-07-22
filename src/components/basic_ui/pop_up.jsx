import { motion, AnimatePresence } from "framer-motion";

export default function PopUp({ show, onClose, message, type = "info" }) {
  const bgColor = {
    success: "#2ab152",
    error: "#d14c4c",
    info: "#7196fe",
    warning: "#e1b64d",
  }[type];

  return (
    <AnimatePresence>
      {show && !message=="" && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-5 right-5 text-white px-4 py-3 rounded-lg shadow-lg z-50`}
          style={{background: bgColor, zIndex: 999}}
        >
          <div className="flex items-center justify-between space-x-3">
            <span>{message}</span>
            <button
              onClick={onClose}
              className="btn"
              type="button"
              style={{
                fontWeight: 900,
                background: "transparent",
                border: "none",
              }}
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
