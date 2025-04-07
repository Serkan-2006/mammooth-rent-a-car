"use client";
import { useState } from "react";

const Page = () => {
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });

  const [validation, setValidation] = useState(false);
  const [validationMessages, setValidationMessages] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.Username === "" ||
      formData.Password === "" ||
      formData.Email === "" ||
      formData.ConfirmPassword === ""
    ) {
      setValidation(true);
      setValidationMessages("You have not entered a username, passwords or email.");
    } else {
      const response = await fetch("https://localhost:5022/api/Auth/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      console.log(responseData)
      if (responseData.success) {
        window.location.href = "/login";
      } else {
        setValidation(true);
        setValidationMessages(responseData.errors);
      }
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <div className="login-box">
          <h1>Регистриране</h1>
          <span className="signup-span">
            Вече имаш акаунт?{" "}
            <a href="/login" className="signup-btn">
              Влезте
            </a>
          </span>
          <button className="social-btn">Регистрирай се с Google</button>
          <div className="or-seperator">
            <hr className="or-line" />
            <p>или</p>
            <hr className="or-line" />
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="Username">Твоето потребителско име</label>
            <input
              type="text"
              id="Username"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              className="input-field"
            />
            <label htmlFor="Email">Твоят имейл</label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              className="input-field"
            />
            <label htmlFor="Password">Твоята парола</label>
            <input
              type="password"
              id="Password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              className="input-field"
            />
            <label htmlFor="ConfirmPassword">потвърди твоята парола</label>
            <input
              type="password"
              id="ConfirmPassword"
              name="ConfirmPassword"
              value={formData.ConfirmPassword}
              onChange={handleChange}
              className="input-field"
            />
            {validation && (
              <p className="validation-message">{validationMessages}</p>
            )}
            <button type="submit" className="login-btn">
              Регистрирай се
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;