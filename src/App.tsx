import { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import "./App.css";

function App() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      const video = webcamRef.current?.video;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          ctx.fillStyle = "#00ff88";
          for (const point of landmarks) {
            const x = point.x * canvas.width;
            const y = point.y * canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }
    });

    if (webcamRef.current && webcamRef.current.video) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await faceMesh.send({ image: webcamRef.current!.video! });
        },
        width: 400,
        height: 300,
      });
      camera.start();
    }
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Espelho do Sorriso</h1>
        <p>Visualize o seu novo sorriso de forma simples e intuitiva 💚</p>
      </header>

      <main className="main">
        <div className="espelho">
          {/* Mantém o canvas no mesmo tamanho fixo */}
          <div
            style={{
              position: "relative",
              width: "400px",
              height: "300px",
            }}
          >
            <Webcam
              ref={webcamRef}
              mirrored
              style={{
                visibility: "hidden",
                position: "absolute",
                width: "400px",
                height: "300px",
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                width: "400px",
                height: "300px",
                borderRadius: "12px",
                boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Clínica Sorriso Perfeito</p>
      </footer>
    </div>
  );
}

export default App;