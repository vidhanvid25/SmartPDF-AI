import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResetPassword() {

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const navigate =
    useNavigate();

  const [showPassword,
  setShowPassword] =
  useState(false);

const [
  showConfirmPassword,
  setShowConfirmPassword
] = useState(false);

const [strength,
  setStrength] =
  useState("");

  const checkPasswordStrength =
  (value) => {

    if (value.length < 6) {
      setStrength("Weak");
    }
    else if (
      /^(?=.*[A-Z])(?=.*\d).{8,}$/
        .test(value)
    ) {
      setStrength("Strong");
    }
    else {
      setStrength("Medium");
    }
};

  const reset = async () => {

    const email =
      localStorage.getItem(
        "reset_email"
      );

    if (!password || !confirmPassword) {
      alert(
        "Please fill all fields"
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      alert(
        "Passwords do not match"
      );
      return;
    }

    const strongPassword =
      /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (
      !strongPassword.test(
        password
      )
    ) {
      alert(
        "Password must contain at least 8 characters, one uppercase letter and one number."
      );
      return;
    }

    try {

      await axios.post(
        "http://127.0.0.1:8000/reset-password",
        {
          email,
          password
        }
      );

      localStorage.removeItem(
        "reset_email"
      );

      alert(
        "Password Changed Successfully"
      );

      navigate("/");

    } catch {

      alert(
        "Something went wrong"
      );

    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
          Reset Password
        </h1>

        <div
  style={{
    position: "relative",
    width: "100%"
  }}
>
  <input
    type={
      showPassword
        ? "text"
        : "password"
    }
    placeholder="New Password"
    value={password}
    onChange={(e) => {
      setPassword(
        e.target.value
      );

      checkPasswordStrength(
        e.target.value
      );
    }}
    style={{
      width: "100%",
      padding: "12px",
      marginTop: "20px",
      borderRadius: "10px",
      border: "none"
    }}
  />

</div>

<p
  style={{
    color:
      strength === "Strong"
        ? "lightgreen"
        : strength === "Medium"
        ? "orange"
        : "red"
  }}
>
  Password Strength:
  {strength}
</p>

        <div
  style={{
    position: "relative",
    width: "100%"
  }}
>
  <input
    type={
      showConfirmPassword
        ? "text"
        : "password"
    }
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) =>
      setConfirmPassword(
        e.target.value
      )
    }
    style={{
      width: "100%",
      padding: "12px",
      marginTop: "20px",
      borderRadius: "10px",
      border: "none"
    }}
  />

</div>

        <button
          onClick={reset}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "25px",
            background:
              "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          Change Password
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;