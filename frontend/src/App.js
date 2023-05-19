import React from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./Routes";
import Navbar from "./Navbar";

function App() {
  return (
    <div className="App">
     <BrowserRouter>
       <Navbar/>
       <Router/>
     </BrowserRouter>
    </div>
  );
}

export default App;
