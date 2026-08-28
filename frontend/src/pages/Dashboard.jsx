import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const username =
  localStorage.getItem("username");
  const role =
  localStorage.getItem("role");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/dashboard").then((res) => setData(res.data));
  }, []);

  return (
    <>
    <Sidebar />

    <div
      style={{
        marginLeft: "270px",
        padding: "30px"
      }}
    >

    <div
  style={{
    display: "flex",
    justifyContent: "space-between"
  }}
>
  <h1>Dashboard</h1>

</div>

      <h1>Smart PDF AI Dashboard</h1>

      <h2>
  Welcome, {username}
</h2>

<h3>
  Role: {role}
</h3>

      <div style={{
        display: "flex",
        gap: "20px",
        marginTop: "20px"
      }}>

        <div style={{
          border: "1px solid gray",
          padding: "20px",
          width: "200px"
        }}>
          <h3>Approved PDFs</h3>
          <h2>{data.approved_pdfs}</h2>
        </div>

        <div style={{
          border: "1px solid gray",
          padding: "20px",
          width: "200px"
        }}>
          <h3>Pending PDFs</h3>
          <h2>{data.pending_pdfs}</h2>
        </div>

      </div>

    </div>
    </>
  );
}

export default Dashboard;