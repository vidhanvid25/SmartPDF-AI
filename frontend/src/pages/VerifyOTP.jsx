import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VerifyOTP() {
  const [otp, setOtp] =
    useState("");

  const [timer, setTimer] =
    useState(300);

  const navigate =
    useNavigate();

  useEffect(() => {
    const interval =
      setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    return () =>
      clearInterval(interval);
  }, []);

  const verify = async () => {
    if (!otp) {
      alert(
        "Please enter OTP"
      );
      return;
    }

    const email =
      localStorage.getItem(
        "reset_email"
      );

    try {
      const response =
        await axios.post(
          "http://127.0.0.1:8000/verify-otp",
          {
            email,
            otp
          }
        );

      alert(
        response.data.message
      );

      navigate(
        "/reset-password"
      );

    } catch {
      alert(
        "Invalid or Expired OTP"
      );
    }
  };

  const resendOTP =
    async () => {
      const email =
        localStorage.getItem(
          "reset_email"
        );

      try {
        await axios.post(
          "http://127.0.0.1:8000/forgot-password",
          {
            email
          }
        );

        setTimer(300);

        alert(
          "New OTP Sent"
        );

      } catch {
        alert(
          "Failed to resend OTP"
        );
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
          Verify OTP
        </h1>

        <p>
          OTP expires in:
        </p>

        <h3>
          {Math.floor(
            timer / 60
          )}
          :
          {String(
            timer % 60
          ).padStart(
            2,
            "0"
          )}
        </h3>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) =>
            setOtp(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            borderRadius:
              "10px",
            border: "none"
          }}
        />

        <button
          onClick={verify}
          disabled={
            timer === 0
          }
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            background:
              "#2563eb",
            color: "white",
            border: "none",
            borderRadius:
              "10px",
            cursor: "pointer"
          }}
        >
          Verify OTP
        </button>

        <button
          onClick={
            resendOTP
          }
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            background:
              "#475569",
            color: "white",
            border: "none",
            borderRadius:
              "10px",
            cursor: "pointer"
          }}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}

export default VerifyOTP;