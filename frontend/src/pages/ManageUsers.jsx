import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function ManageUsers() {

  const [users, setUsers] =
    useState([]);
  
  const [search, setSearch] =
  useState("");

  const loadUsers = () => {
    axios.get(
      "http://127.0.0.1:8000/users"
    )
    .then((res) =>
      setUsers(res.data)
    );
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser =
    async (id) => {

      await axios.delete(
        `http://127.0.0.1:8000/users/${id}`
      );

      loadUsers();
    };

  const changeRole =
    async (id, role) => {

      await axios.put(
        `http://127.0.0.1:8000/users/${id}/${role}`
      );

      loadUsers();
    };
  
  const searchUsers =
  async () => {

    if (!search) {
      loadData();
      return;
    }

    const res =
      await axios.get(
        `http://127.0.0.1:8000/users/search/${search}`
      );

    setUsers(res.data);
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
        <h1>Manage Users</h1>

        <input
  placeholder="Search User"
  value={search}
  onChange={(e) =>
    setSearch(
      e.target.value
    )
  }
/>
<button
  onClick={searchUsers}
>
  Search
</button>

        <table
          border="1"
          cellPadding="10"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.full_name}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.created_at}</td>

                <td>

                  <button
                    onClick={() =>
                      changeRole(
                        u.id,
                        "user"
                      )
                    }
                  >
                    User
                  </button>

                  <button
                    onClick={() =>
                      changeRole(
                        u.id,
                        "reviewer"
                      )
                    }
                  >
                    Reviewer
                  </button>

                  <button
                    onClick={() =>
                      changeRole(
                        u.id,
                        "admin"
                      )
                    }
                  >
                    Admin
                  </button>

                  <button
                    onClick={() =>
                      deleteUser(
                        u.id
                      )
                    }
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

export default ManageUsers;