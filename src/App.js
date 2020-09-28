import React from "react";
import "./App.css";
import { WadizContextProvider } from "./WadizContext";
import WadizInputPage from "./WadizInputPage";

function App() {

  return (
    <WadizContextProvider>
      <WadizInputPage />
    </WadizContextProvider>
  );
}

export default App;
