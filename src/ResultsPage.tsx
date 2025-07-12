import { useLocation, useNavigate } from "react-router-dom";

type Capture = {
  orientation: "left" | "front" | "right";
  blob?: Blob;
};

export default function ResultsPage() {
  const { state } = useLocation();
  const captures: Capture[] = (state as any)?.captures;
  const navigate = useNavigate();

  if (!captures) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your 3 Face Captures</h2>
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        {captures.map((c, i) =>
          c.blob ? (
            <img
              key={i}
              src={URL.createObjectURL(c.blob)}
              alt={c.orientation}
              width={140}
              style={{
                borderRadius: "8px",
                boxShadow: "0 0 4px rgba(0,0,0,0.2)",
              }}
            />
          ) : (
            <div
              key={i}
              style={{
                width: 140,
                height: 105,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f0f0f0",
                borderRadius: "8px",
              }}
            >
              {c.orientation} skipped
            </div>
          )
        )}
      </div>
      <button
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/", { replace: true })}
      >
        Start Over
      </button>
    </div>
  );
}
