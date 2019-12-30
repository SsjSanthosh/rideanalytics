import React, { useState } from "react";
import ReactFileReader from "react-file-reader";
import { connect } from "react-redux";
import { addData } from "./../Redux/csvData/csvActions";
function FileUpload(props) {
  const [data, setData] = useState([]);
  // Function to convert csv into a JS object
  const csvJSON = csv => {
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    //return //JavaScript object
    result.pop();

    return result;
  };
  const handleUpload = files => {
    const reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = () => {
      props.addData(csvJSON(reader.result));
    };
  };

  return (
    <div className="File-Container">
      <ReactFileReader fileTypes={".csv"} handleFiles={handleUpload}>
        <button className="btn" id="uploadbtn">
          Upload a csv file
        </button>
      </ReactFileReader>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    data: state.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addData: data => dispatch(addData(data))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(FileUpload);
