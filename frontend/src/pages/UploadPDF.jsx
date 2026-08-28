import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function UploadPDF() {

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const upload = async () => {

    if (files.length === 0) {
      setMessage("Please select a PDFs file");
      return;
    }

    const username =
      localStorage.getItem("username");

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(
      "files",
      files[i]
    );
  }
    formData.append(
      "entry_by",
      username
    );

    try {
      setLoading(true);
      setMessage("Processing PDF...");

      const response =
        await axios.post(
          "http://127.0.0.1:8000/upload-pdfs",
          formData
        );

      if (
  response.data.duplicates.length > 0 &&
  response.data.uploaded.length === 0
) {
  setMessage(
    "This PDF already exists in the database."
  );
}
else {
  setMessage(
    `${response.data.uploaded.length} PDF(s) uploaded successfully.
${response.data.duplicates.length} duplicate PDF(s) skipped.`
  );
}

setFiles([]);

document.getElementById(
  "pdfInput"
).value = "";

    } catch (error) {
  console.log(error);

  if (error.response) {
    setMessage(
      error.response.data.detail
    );
  } else {
    setMessage(
      "Upload Failed"
    );
  }
    } finally {
      setLoading(false);
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
        <h1>Upload PDF</h1>

        <input
  id="pdfInput"
  type="file"
  accept=".pdf"
  multiple
  onChange={(e) =>
    setFiles(e.target.files)
  }
/>

        <br />
        <br />

        <button
          onClick={upload}
          disabled={loading}
        >
          {loading
            ? "Uploading..."
            : "Upload PDF"}
        </button>

        <br />
        <br />

        {message && (
          <h3>{message}</h3>
        )}
      </div>
    </>
  );
}

export default UploadPDF;