import { Link } from "react-router-dom";

function Sidebar() {
  const role =
    localStorage.getItem("role");

  const username =
    localStorage.getItem("username");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div
  style={{
    width: "250px",
    height: "100vh",
    background: "#1e293b",
    color: "white",
    padding: "20px",
    position: "fixed",
    left: 0,
    top: 0,
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box"
  }}
>
      <div>
        <h2>Smart PDF AI</h2>

        <hr />

        <h3>Welcome,</h3>

        <p>{username}</p>

        <p>
          Role: {role}
        </p>

        <hr />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            flex: 1
          }}
        >
          <Link
            to="/dashboard"
            style={linkStyle}
          >
            Dashboard
          </Link>

          {/* ADMIN */}
          {role === "admin" && (
            <>
              <Link
                to="/upload"
                style={linkStyle}
              >
                Upload PDF
              </Link>

              <Link
                to="/pending"
                style={linkStyle}
              >
                Pending PDFs
              </Link>

              <Link
                to="/approved"
                style={linkStyle}
              >
                Approved PDFs
              </Link>

              <Link
                to="/users"
                style={linkStyle}
              >
                Manage Users
              </Link>
            </>
          )}

          {/* REVIEWER */}
          {role === "reviewer" && (
            <>
              <Link
                to="/pending"
                style={linkStyle}
              >
                Pending PDFs
              </Link>

              <Link
                to="/approved"
                style={linkStyle}
              >
                Approved PDFs
              </Link>
            </>
          )}

          {/* USER */}
          {role === "user" && (
            <>
              <Link
                to="/upload"
                style={linkStyle}
              >
                Upload PDF
              </Link>

              <Link
                to="/mypdfs"
                style={linkStyle}
              >
                My PDFs
              </Link>
            </>
          )}
        </div>
      </div>

      <Link
  to="/profile"
  style={linkStyle}
>
  My Profile
</Link>

      {/* Logout Button */}
     <button
  onClick={() => {
    localStorage.clear();
    window.location.href = "/";
  }}
  style={{
    width: "100%",
    padding: "12px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px"
  }}
>
  Logout
</button>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "10px",
  background: "#334155",
  borderRadius: "8px",
  textAlign: "center"
};

export default Sidebar;