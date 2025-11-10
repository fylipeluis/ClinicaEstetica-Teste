import React, { useRef, useEffect } from "react";
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
      maxNumFaces: 1, // detecta apenas 1 rosto
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    // Quando o modelo detectar o rosto
    faceMesh.onResults((results) => {
      const video = webcamRef.current?.video;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Define o tamanho do canvas igual ao do vídeo
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Limpa o canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Desenha o vídeo ao fundo
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Desenha os pontos do rosto detectado
      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          ctx.fillStyle = "#00ff88";
          for (const point of landmarks) {
            const x = point.x * canvas.width;
            const y = point.y * canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 1.2, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }
    });

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      const camera = new Camera(webcamRef.current.video!, {
        onFrame: async () => {
          await faceMesh.send({ image: webcamRef.current!.video! });
        },
        width: 640,
        height: 480,
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
          {/* Webcam oculta atrás do canvas */}
          <Webcam
            ref={webcamRef}
            style={{
              visibility: "hidden",
              position: "absolute",
            }}
            mirrored
          />

          {/* Canvas onde será desenhado o rosto + pontos */}
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              maxWidth: "400px",
              borderRadius: "12px",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Clínica Sorriso Perfeito</p>
      </footer>
    </div>
  );
}

export default App;
