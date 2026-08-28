import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function PendingPDFs() {

  const [pdfs, setPdfs] = useState([]);

  const loadData = () => {

    axios.get("http://127.0.0.1:8000/pending-pdfs").then((res) => setPdfs(res.data));
  };

  useEffect(() => {loadData();}, []);

  const approve = async (id) => {

    await axios.post(
      `http://127.0.0.1:8000/approve/${id}`
    );
    loadData();
  };

  const reject = async (id) => {

    await axios.delete(
      `http://127.0.0.1:8000/reject/${id}`
    );
    loadData();
  };

  return (
    <>
      <Sidebar />
      <div
        style={{
          marginLeft: "270px",
          padding: "30px"
        }}
      >
        <h1>Pending PDFs</h1>

      <table border="1">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Full Name</th>
            <th>Type</th>
            <th>Open PDF</th>
            <th>Approve</th>
            <th>Reject</th>
          </tr>
        </thead>

        <tbody>

          {pdfs.map((pdf) => (

            <tr key={pdf.id}>

              <td>{pdf.id}</td>

              <td>{pdf.pdf_name}</td>

              <td>{pdf.full_name}</td>

              <td>{pdf.pdf_type}</td>

              <td>

              <a href={`http://127.0.0.1:8000/temp-pdf/${pdf.id}`} target="_blank">
               Open PDF
              </a>

              </td>

              <td>
                <button
                  onClick={() =>
                    approve(pdf.id)
                  }
                >
                  Approve
                </button>
              </td>

              <td>
                <button
                  onClick={() =>
                    reject(pdf.id)
                  }
                >
                  Reject
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
    </>
  );
}

export default PendingPDFs;