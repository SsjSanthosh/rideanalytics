import React from "react";
import Map from "./Components/Map";
import "./App.scss";
import FileUpload from "./Components/FileUpload";
import { Provider } from "react-redux";

import store from "./Redux/store";
import Navbar from "./Components/Navbar";
import Charts from "./Components/Charts";
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Navbar />
        <div className="Top-Container">
          <FileUpload />
          <Map />
        </div>
        <Charts />
        {/* <Maptest /> */}
      </div>
    </Provider>
  );
}

export default App;
