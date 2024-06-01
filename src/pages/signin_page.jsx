import { NavbarInitialComponent } from "../components/navbar_initial_component";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Col,
  OverlayTrigger,
  Tooltip,
  Modal,
  Button,
} from "react-bootstrap";
import "../css/sign_pages_style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

export function SignIn() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    identificationNumber: "",
    email: "",
    password: "",
  });

  const URL_BACKEND = "http://127.0.0.1:8000";

  const [formDataLogin, setFormDataLogin] = useState({
    emaillogin: "",
    password: "",
  });

  const tooltipSelfie = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      This will be used to verify your identity when accessing to events. As
      soon as you click, a selfie will be taken, be prepared!
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
        setShowModal(true); // Mostrar el modal con la previsualización
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleRetakeSelfie = () => {
    setPreviewSrc(null);
    setShowModal(false); // Cerrar el modal
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
    setShowModal(false); // Cerrar el modal después de guardar
  };

  const handleRegisterClick = async (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append("first_name", formData.firstName);
    data.append("last_name", formData.lastName);
    data.append("identification_number", formData.identificationNumber);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("photo", previewSrc);

    try {
      const response = await fetch(`${URL_BACKEND}/users/`, {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        console.log("User registered successfully.");
        navigate("/user");
      } else {
        console.error("Failed to register user:", response.statusText);
        // Maneja los errores aquí
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append("email", formDataLogin.emaillogin);
    data.append("password", formDataLogin.password);

    try {
      const response = await fetch(`${URL_BACKEND}/users/login/`, {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        console.log("Login successfully.");
        navigate("/user");
        // Maneja la respuesta exitosa aquí
      } else {
        console.error("Failed to login user:", response.statusText);
        // Maneja los errores aquí
      }
    } catch (error) {
      console.error("Error login user:", error);
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
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="identificationNumber"
                  placeholder="Identification number"
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleInputChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleInputChange}
                />

                <div className="register-buttons">
                  <button type="submit"> Sign Up</button>
                  <div className="selfie-container">
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
                  </div>
                </div>
              </form>
            </div>
            <div className="form-container sign-in">
              <form onSubmit={handleLogin}>
                <h1>Sign In</h1>
                <input
                  type="email"
                  name="emaillogin"
                  placeholder="Email"
                  onChange={handleInputLoginChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleInputLoginChange}
                />
                {/*eslint-disable-next-line*/}
                <a href="#">Forgot your password?</a>

                <button type="submit" className="button-signIn">
                  Sign In
                </button>
              </form>
            </div>
            <div className="toggle-container">
              <div className="toggle">
                <div className="toggle-panel toggle-left">
                  <h1>Already an user? </h1>
                  <p>Jump in to the greatest shows by signing in!</p>
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
                  <p>
                    Enroll into TicketHub for the hottest concerts near you!
                  </p>
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

      {/* Modal para previsualización de la selfie */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Selfie Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={previewSrc}
            alt="Selfie Preview"
            className="selfie-preview-modal"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRetakeSelfie}>
            Retake
          </Button>
          <Button variant="primary" onClick={handleSaveSelfie}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
