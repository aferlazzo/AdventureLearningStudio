import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import "./styles/comic-builder.css";
import "./styles/image-upload.css";
import "./styles/studio-home.css";
import "./styles/workspace-experience.css";
import "./styles/guided-workspace.css";
import "./styles/focused-sequence.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);