import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword,
  setShowPassword] =
  useState(false);

const [strength,
  setStrength] =
  useState("");

  const [captcha, setCaptcha] =
    useState("");

  const [captchaInput,
    setCaptchaInput] =
    useState("");

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const text = Math.random()
      .toString(36)
      .substring(2, 8);

    setCaptcha(text);
  };

  const login = async () => {
    if (!email || !password) {
      alert(
        "Please fill all fields"
      );
      return;
    }

    if (
      captchaInput !== captcha
    ) {
      alert(
        "Wrong Captcha"
      );

      generateCaptcha();

      setCaptchaInput("");

      return;
    }
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

    try {
      const response =
        await axios.post(
          "http://127.0.0.1:8000/login",
          {
            email,
            password
          }
        );

      if (
        response.data.message !==
        "Login successful"
      ) {
        alert(
          response.data.message
        );
        return;
      }

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      localStorage.setItem(
        "username",
        response.data.username
      );

      navigate("/dashboard");

    } catch (error) {
      alert(
        "Invalid Email or Password"
      );
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "16px"
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
        <h1
          style={{
            marginBottom: "10px"
          }}
        >
          Smart PDF AI
        </h1>

        <h2>Login</h2>

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

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <p
  style={{
    textAlign: "right",
    marginTop: "10px"
  }}
>
  <Link
    to="/forgot-password"
    style={{
      color: "#60a5fa",
      textDecoration: "none"
    }}
  >
    Forgot Password?
  </Link>
</p>

        <div
          style={{
            marginTop: "20px",
            fontSize: "22px",
            fontWeight: "bold",
            letterSpacing: "4px",
            background: "#334155",
            padding: "10px",
            borderRadius: "10px"
          }}
        >
          {captcha}
        </div>

        <input
          type="text"
          placeholder="Enter Captcha"
          value={captchaInput}
          onChange={(e) =>
            setCaptchaInput(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            border: "none",
            borderRadius: "10px",
            background:
              "#2563eb",
            color: "white",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Login
        </button>

        <p
          style={{
            marginTop: "20px"
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#60a5fa"
            }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;