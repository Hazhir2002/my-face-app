import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { useNavigate } from "react-router-dom";

type Orientation = "left" | "front" | "right";
type Capture = { orientation: Orientation; blob?: Blob };

export default function FaceCapture() {
  const [captures, setCaptures] = useState<Capture[]>([
    { orientation: "left" },
    { orientation: "front" },
    { orientation: "right" },
  ]);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => alert("Camera access denied."));
  }, []);

  const takeSnapshot = async () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);

    const detection = await faceapi
      .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    if (!detection) {
      alert("No face detected. Please try again.");
      return;
    }

    canvas.toBlob((blob) => {
      setCaptures((prev) => {
        const next = [...prev];
        next[step].blob = blob!;
        return next;
      });
    }, "image/jpeg");
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, captures.length - 1));
  const skipStep = () =>
    setCaptures((prev) => {
      const next = [...prev];
      delete next[step].blob;
      return next;
    });

  const handleContinue = () => {
    navigate("/results", { state: { captures } });
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted width={300} />
      <div>
        <button onClick={takeSnapshot}>
          Capture: {captures[step].orientation}
        </button>
        <button onClick={nextStep}>Next</button>
        <button onClick={skipStep}>Skip</button>
        {step === captures.length - 1 && (
          <button onClick={handleContinue}>Continue</button>
        )}
      </div>
      <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
        {captures.map((c, i) =>
          c.blob ? (
            <img
              key={i}
              src={URL.createObjectURL(c.blob)}
              alt={c.orientation}
              width={100}
            />
          ) : (
            <div
              key={i}
              style={{
                width: 100,
                height: 75,
                background: "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {c.orientation}
            </div>
          )
        )}
      </div>
    </div>
  );
}
