import Webcam from "react-webcam";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Espelho do Sorriso</h1>
        <p>Visualize o seu novo sorriso de forma simples e intuitiva 💚</p>
      </header>

      <main className="main">
        <div className="espelho">
          <Webcam
            style={{
              width: "100%",
              maxWidth: "400px",
              borderRadius: "12px",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            }}
            mirrored={true}
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
