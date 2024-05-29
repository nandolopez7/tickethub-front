import { NavbarInitialComponent } from "../components/navbar_initial_component";
import React, { useState } from "react";
import { Container, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import "../css/sign_pages_style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

export function SignIn() {
  const [isActive, setIsActive] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    identificationNumber: '',
    email: '',
    password: '',
  });

  const URL_BACKEND = 'http://127.0.0.1:8000'

  const [formDataLogin, setFormDataLogin] = useState({
    emaillogin: '',
    password: '',
  });

  const tooltipSelfie = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      This will be use to verify your identity when accessing to events. As soon
      as you click, selfie will be taken, be prepared!
    </Tooltip>
  );

  const handleTakeSelfie = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      video.srcObject = stream;
      video.play();

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataURL = canvas.toDataURL("image/jpeg");
        setPreviewSrc(dataURL);

        video.srcObject.getTracks().forEach((track) => track.stop());
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleRetakeSelfie = () => {
    setPreviewSrc(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputLoginChange = (event) => {
    const { name, value } = event.target;
    setFormDataLogin((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveSelfie = () => {
    // Aquí puedes guardar la selfie, por ejemplo, enviándola a un servidor
    console.log("Selfie saved:", previewSrc);
  };

  
  const handleRegisterClick = async (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append('first_name', formData.firstName);
    data.append('last_name', formData.lastName);
    data.append('identification_number', formData.identificationNumber);
    data.append('email', formData.email);
    data.append('password', formData.password);

    data.append('photo',previewSrc);

    // Mostrar las entradas de FormData en la consola
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(`${URL_BACKEND}/users/`, {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        console.log('User registered successfully.');
        // Maneja la respuesta exitosa aquí
      } else {
        console.error('Failed to register user:', response.statusText);
        // Maneja los errores aquí
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append('email', formDataLogin.emaillogin);
    data.append('password', formDataLogin.password);

    // Mostrar las entradas de FormData en la consola
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(`${URL_BACKEND}/users/login/`, {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        console.log('Login successfully.');
        // Maneja la respuesta exitosa aquí
      } else {
        console.error('Failed to login user:', response.statusText);
        // Maneja los errores aquí
      }
    } catch (error) {
      console.error('Error login user:', error);
    }
  };


  
  const handleCreateClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  return (
    <>
      <NavbarInitialComponent />
      <Container fluid>
        <Col className="col-sign">
          <div
            className={`sign-container ${isActive ? "active" : ""}`}
            id="container"
          >
            <div className="form-container sign-up">
              <form onSubmit={handleRegisterClick}>
                <h1>Create Account</h1>
                <input type="text" name="firstName" placeholder="First name" onChange={handleInputChange} />
                <input type="text" name="lastName" placeholder="Last name" onChange={handleInputChange} />
                <input type="text" name="identificationNumber" placeholder="Identification number" onChange={handleInputChange} />
                <input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleInputChange} />

                <div className="register-buttons">
                  <button  type="submit"> Sign Up</button>
                  <div className="selfie-container">
                    {previewSrc ? (
                      <img
                        src={previewSrc}
                        alt="Selfie Preview"
                        className="selfie-preview"
                      />
                    ) : (
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={tooltipSelfie}
                      >
                        <button
                          type="button"
                          className="button-selfie"
                          onClick={handleTakeSelfie}
                        >
                          Take a selfie
                          <FontAwesomeIcon
                            icon={faCamera}
                            className="icon-selfie"
                            size="lg"
                            style={{ margin: "0 5px" }}
                          />
                        </button>
                      </OverlayTrigger>
                    )}
                  </div>
                  {previewSrc && (
                    <div className="selfie-controls">
                      <button
                        className="button-selfie-control"
                        type="button"
                        onClick={handleRetakeSelfie}
                      >
                        Retake
                      </button>
                      <button
                        className="button-selfie-control"
                        type="button"
                        onClick={handleSaveSelfie}
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="form-container sign-in">
              <form onSubmit={handleLogin}>
                <h1>Sign In</h1>
                <input type="email" name="emaillogin" placeholder="Email" onChange={handleInputLoginChange} />
                <input type="password" name= "password" placeholder="Password" onChange={handleInputLoginChange} />
                <a href="#">Forgot your password?</a>
                
                <button type="submit" className="button-signIn">Sign In</button>
              </form>
            </div>
            <div className="toggle-container">
              <div className="toggle">
                <div className="toggle-panel toggle-left">
                  <h1>Already an user? </h1>
                  <p>Jump in to the greates shows by signing in!</p>
                  <button
                    className="hidden"
                    id="login"
                    onClick={handleLoginClick}
                  >
                    Sign In
                  </button>
                </div>
                <div className="toggle-panel toggle-right">
                  <h1>New here?</h1>
                  <p>Enroll into TicketHub for hottest concerts near!</p>
                  <button
                    className="hidden"
                    id="register"
                    onClick={handleCreateClick}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Container>

    </>
  );
}
