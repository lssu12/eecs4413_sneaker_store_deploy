import React from 'react'
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
import SneakerContextProvider from "./Context/SneakerContext"; 


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SneakerContextProvider>
      <App />
    </SneakerContextProvider>
  </React.StrictMode>
);