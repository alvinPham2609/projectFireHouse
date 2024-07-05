// Import necessary libraries
import './App.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';

// Functional component
function App() {
  const [FormData, setFormData] = useState({
    id: "",
    buocsong: ""
  });

  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("http://10.106.25.73:8081/nhietdo")//
      .then((response) => {
        console.log(response.data)
        setData(response.data)
      })
  
	    .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);// Empty dependency array to run the effect only once on mount

  // Function to check if the status exceeds a threshold and return a warning message
  const getStatusWarning = (status) => {
    // Define your threshold here (replace 50 with your actual threshold)
    const threshold = 300;
    if (parseInt(status) > threshold) {
      return "Status is above the threshold!";
    }
    return null;
  }

  return (
    <div className='container'>
      <div className='row col-md-12 text-center'>
        <div className='wrap'>
          <h1>Bảng thông tin trạng thái hiện tại</h1>
        </div>
        <div className='body'>
          {data.map((item) => (
            <div className='item' key={item.id}>
              <table className='item-info'>
                <tbody>
                  <tr>
                    <th>trangthai</th>//
                    <th>statuswater</th>//
                  </tr>
                  <tr>
                    <td>{item.id}</td>//
                    <td>{item.buocsong}</td>//

                  </tr>
                </tbody>
              </table>
              {/* Display the warning message if the status exceeds the threshold */}
              {getStatusWarning(item.buocsong) && (
                <div className="warning-message">
                  {getStatusWarning(item.buocsong)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
