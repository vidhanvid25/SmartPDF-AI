import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {

  const [email, setEmail] =
    useState("");

  const navigate =
    useNavigate();

  const sendOTP = async () => {

    try {

      const response =
        await axios.post(
          "http://127.0.0.1:8000/forgot-password",
          {
            email
          }
        );

      alert(
        "OTP Sent"
      );

      localStorage.setItem(
        "reset_email",
        email
      );

      navigate(
        "/verify-otp"
      );

    } catch (error) {

      alert(
        "Email not found"
      );

    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "100px"
      }}
    >
      <h1>
        Forgot Password
      </h1>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
      />

      <br />

      <button
        onClick={sendOTP}
      >
        Send OTP
      </button>
    </div>
  );
}

export default ForgotPassword;