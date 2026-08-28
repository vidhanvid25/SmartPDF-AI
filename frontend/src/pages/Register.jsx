import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {

  const [fullName, setFullName] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword] =
    useState(false);

  const [strength,
    setStrength] =
    useState("");

  const navigate =
    useNavigate();

  const checkPasswordStrength =
    (value) => {

      if (value.length < 8) {
        setStrength("Weak");
      }
      else if (
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/
          .test(value)
      ) {
        setStrength("Strong");
      }
      else {
        setStrength("Medium");
      }
    };

  const register = async () => {

    if (
      !fullName ||
      !username ||
      !email ||
      !password
    ) {
      alert(
        "Please fill all fields"
      );
      return;
    }

    const strongPassword =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

    if (
      !strongPassword.test(
        password
      )
    ) {
      alert(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number."
      );
      return;
    }

    try {

      const response =
        await axios.post(
          "http://127.0.0.1:8000/register",
          {
            full_name:
              fullName,
            username,
            email,
            password
          }
        );

      if (
        response.data.error
      ) {
        alert(
          response.data.error
        );
        return;
      }

      alert(
        response.data.message
      );

      navigate("/");

    } catch (error) {
  console.log(error);

  if (error.response) {
    alert(
      error.response.data.error ||
      error.response.data.message
    );
  } else {
    alert(error.message);
  }
}
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        height: "100vh",
        background:
          "linear-gradient(135deg,#0f172a,#1e293b)"
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "40px",
          borderRadius: "20px",
          background:
            "rgba(255,255,255,0.1)",
          backdropFilter:
            "blur(15px)",
          boxShadow:
            "0px 0px 25px rgba(0,0,0,0.5)",
          textAlign: "center",
          color: "white"
        }}
      >
        <h1>
          Smart PDF AI
        </h1>

        <h2>
          Register
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) =>
            setFullName(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <div
          style={{
            position:
              "relative"
          }}
        >
          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(
                e.target.value
              );

              checkPasswordStrength(
                e.target.value
              );
            }}
            style={inputStyle}
          />


        </div>

        <p
          style={{
            color:
              strength ===
              "Strong"
                ? "lightgreen"
                : strength ===
                  "Medium"
                ? "orange"
                : "red"
          }}
        >
          Password Strength:
          {" "}
          {strength}
        </p>

        <p
          style={{
            fontSize:
              "13px",
            textAlign:
              "left",
            color:
              "#cbd5e1"
          }}
        >
          Password must contain:
          <br />
          • Minimum 8 characters
          <br />
          • One uppercase letter
          <br />
          • One lowercase letter
          <br />
          • One number
        </p>

        <button
          onClick={register}
          style={{
            width: "100%",
            padding: "12px",
            marginTop:
              "20px",
            border: "none",
            borderRadius:
              "10px",
            background:
              "#2563eb",
            color:
              "white",
            fontSize:
              "16px",
            cursor:
              "pointer"
          }}
        >
          Register
        </button>

        <p
          style={{
            marginTop:
              "20px"
          }}
        >
          Already have an account?{" "}
          <Link
            to="/"
            style={{
              color:
                "#60a5fa"
            }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  fontSize: "16px",
  boxSizing: "border-box"
};

export default Register;