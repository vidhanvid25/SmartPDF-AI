import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function MyPDFs() {

  const [pdfs, setPdfs] =
    useState([]);

  const [search, setSearch] =
  useState("");

  const username =
    localStorage.getItem("username");

  useEffect(() => {

    axios.get(
      `http://127.0.0.1:8000/my-pdfs/${username}`
    )
    .then((res) =>
      setPdfs(res.data)
    );

  }, []);

  const downloadPDF = async (
  id
) => {
  try {

    const response =
      await axios.get(
        `http://127.0.0.1:8000/download-pdf/${id}`,
        {
          responseType:
            "blob"
        }
      );

    const url =
      window.URL.createObjectURL(
        new Blob([response.data])
      );

    const link =
      document.createElement("a");

    link.href = url;
    const pdf =
  pdfs.find(
    (p) => p.id === id
  );

link.setAttribute(
  "download",
  pdf.pdf_name
);

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

  } catch (error) {
    console.log(error);
    alert(
      "Download failed"
    );
  }
};

const deletePDF = async (id) => {

  const confirmDelete =
    window.confirm(
      "Are you sure?"
    );

  if (!confirmDelete) {
    return;
  }

  try {

    const response =
      await axios.delete(
        `http://127.0.0.1:8000/delete-pdf/${id}`
      );

    alert(
      response.data.message ||
      "PDF Deleted Successfully"
    );

    setPdfs(
      pdfs.filter(
        (pdf) => pdf.id !== id
      )
    );

  } catch (error) {
    console.log(error);

    alert(
      "Delete failed"
    );
  }
};

const searchPdf = async () => {

  const username =
    localStorage.getItem(
      "username"
    );

  if (!search) {
    loadData();
    return;
  }

  try {

    const res =
      await axios.get(
        `http://127.0.0.1:8000/my-pdfs/search/${username}/${search}`
      );

    setPdfs(res.data);

  } catch {
    alert("Search failed");
  }
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
        <h1>My PDFs</h1>

        <div
  style={{
    marginBottom: "20px"
  }}
>
  <input
    type="text"
    placeholder="Search My PDFs"
    value={search}
    onChange={(e) =>
      setSearch(
        e.target.value
      )
    }
    style={{
      padding: "10px",
      width: "250px"
    }}
  />

  <button
    onClick={searchPdf}
    style={{
      marginLeft: "10px",
      padding: "10px"
    }}
  >
    Search
  </button>
</div>
<div>
   Search Box
</div>

        <table
          border="1"
          cellPadding="10"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>PDF Name</th>
              <th>Type</th>
              <th>Pages</th>
              <th>Open PDF</th>
              <th>Download</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {pdfs.map((pdf) => (
              <tr key={pdf.id}>
                <td>{pdf.id}</td>
                <td>{pdf.pdf_name}</td>
                <td>{pdf.pdf_type}</td>
                <td>{pdf.page_count}</td>

                <td>
                  <a
                    href={pdf.pdf_link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>
                </td>
<td>
                <button
    onClick={() =>
      downloadPDF(pdf.id)
    }
  >
    Download
  </button>
</td>
<td>
  <button
    onClick={() =>
      deletePDF(pdf.id)
    }
    style={{
      background: "#dc2626",
      color: "white",
      border: "none",
      padding: "8px",
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

export default MyPDFs;