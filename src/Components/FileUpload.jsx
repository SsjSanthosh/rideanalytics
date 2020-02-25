import React from "react";

import { connect } from "react-redux";
import { addData } from "./../Redux/csvData/csvActions";
import { csvdata } from "../csvdata.js";
function FileUpload(props) {
  // const [data, setData] = useState([]);

  // App built to function by uploading a csv but
  // I am bootstrapping it to run from local data because
  // a. the data is not mine
  // b. It requires a very specific data set and anything else would either crash and/or wreck the site

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

    //return JavaScript object
    result.pop();

    return result;
  };

  const handleUpload = () => {
    // used to have logic to handle file upload with
    // react FileUpload
    // now just adds data to the redux store
    props.addData(csvJSON(csvdata));
  };

  return (
    <div className="File-Container">
      <button className="btn" id="uploadbtn" onClick={handleUpload}>
        Start analysis
      </button>
    </div>
  );
}

// mapping the store's redux to the props of the component
const mapStateToProps = state => {
  return {
    data: state.data
  };
};

// mapping the actions of the store to a function to be passed onto the props
const mapDispatchToProps = dispatch => {
  return {
    addData: data => dispatch(addData(data))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(FileUpload);
