import { useEffect,
  useState } from "react";

import axios from "axios";

import Sidebar from
  "../components/Sidebar";

function Profile() {

  const [profile,
    setProfile] =
    useState({});

  const username =
    localStorage.getItem(
      "username"
    );

  useEffect(() => {

    axios.get(
      `http://127.0.0.1:8000/profile/${username}`
    )
    .then((res) =>
      setProfile(
        res.data
      )
    );

  }, []);

  return (
    <>
      <Sidebar />

      <div
        style={{
          marginLeft:
            "270px",
          padding:
            "30px"
        }}
      >
        <h1>
          My Profile
        </h1>

        <div
          style={{
            width:
              "500px",
            padding:
              "30px",
            border:
              "1px solid #ddd",
            borderRadius:
              "15px",
            marginTop:
              "30px"
          }}
        >
          <h3>
            Username:
            {" "}
            {
              profile.username
            }
          </h3>

          <h3>
            Email:
            {" "}
            {
              profile.email
            }
          </h3>

          <h3>
            Role:
            {" "}
            {
              profile.role
            }
          </h3>

          <h3>
            PDFs Uploaded:
            {" "}
            {
              profile.total_pdfs
            }
          </h3>

          <h3>
  Joined:{" "}
  {profile.created_at
    ? new Date(
        profile.created_at
      ).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric"
        }
      )
    : ""}
</h3>
        </div>
      </div>
    </>
  );
}

export default Profile;