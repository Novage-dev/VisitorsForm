import logo from "@/assets/images/logo.jpg"; // replace with your actual logo path

export default function Loading() {
  return (
    <div
      className="flex items-center justify-center bg-white"
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        background: "#00000075",
        top: 0,
        left: 0,
      }}
    >
      <div
        className="flex flex-col items-center space-y-4"
        style={{
          background: "white",
          padding: "23px 19px 19px 19px",
          borderRadius: 11,
        }}
      >
        <div className="flex text-xl font-semibold text-gray-700 space-x-1">
          <span className="flex" style={{ alignItems: "flex-end" }}>
            <Dot delay="0s" />
            <Dot delay="0.2s" />
            <Dot delay="0.4s" />
          </span>
        </div>
      </div>
    </div>
  );
}

// Dot component for animation
const Dot = ({ delay }) => (
  <span
    className="w-2 h-2 bg-gray-700 rounded-full mx-1 animate_bounce_2"
    style={{ animationDelay: delay }}
  ></span>
);
