import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function ApprovedPDFs() {

  const [pdfs, setPdfs] =
    useState([]);

  const [search, setSearch] =
  useState("");

  const loadData = () => {
  axios
    .get("http://127.0.0.1:8000/pdfs")
    .then((res) =>
      setPdfs(res.data)
    );
};

useEffect(() => {
  loadData();
}, []);

const deletePdf = async (id) => {
  if (
    !window.confirm(
      "Are you sure you want to delete this PDF?"
    )
  ) {
    return;
  }

  try {
    const response =
      await axios.delete(
        `http://127.0.0.1:8000/delete-pdf/${id}`
      );

    alert(response.data.message);

    loadData();

  } catch {
    alert("Failed to delete PDF");
  }
};

const searchPdf =
  async () => {

    if (!search) {
      loadData();
      return;
    }

    const res =
      await axios.get(
        `http://127.0.0.1:8000/pdfs/search/${search}`
      );

    setPdfs(res.data);
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
        <h1>Approved PDFs</h1>

        <div
  style={{
    marginBottom: "20px"
  }}
>
  <input
    type="text"
    placeholder="Search PDF"
    value={search}
    onChange={(e) =>
      setSearch(
        e.target.value
      )
    }
    style={{
      padding: "10px"
    }}
  />

  <button
    onClick={searchPdf}
    style={{
      marginLeft: "10px"
    }}
  >
    Search
  </button>
</div>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Full Name</th>
            <th>Type</th>
            <th>Pages</th>
            <th>View</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {pdfs.map((pdf) => (
            <tr key={pdf.id}>
              <td>{pdf.id}</td>
              <td>{pdf.pdf_name}</td>
              <td>{pdf.full_name}</td>
              <td>{pdf.pdf_type}</td>
              <td>{pdf.page_count}</td>
              <td>

                <a
                  href={`http://127.0.0.1:8000/pdf/${pdf.id}`}
                  target="_blank" rel="noreferrer"
                >
                  Open PDF
                </a>
              </td>
              <td>
  <button
    onClick={() =>
      deletePdf(pdf.id)
    }
    style={{
      background: "red",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "5px",
      cursor: "pointer"
    }}
  >
    Delete
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

export default ApprovedPDFs;