import { NavbarInitialComponent } from "../components/navbar_initial_component";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Col,
  OverlayTrigger,
  Tooltip,
  Modal,
  Button,
} from "react-bootstrap";
import Swal from "sweetalert2";
import "../css/sign_pages_style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { Hourglass } from "react-loader-spinner";

export function SignIn() {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
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
  const [errors, setErrors] = useState({}); // Estado para almacenar errores

  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false);

  const URL_BACKEND = "https://tickethub-back.onrender.com";

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

  const openCamera = async () => {
    try {
      if (!cameraPermissionGranted) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(mediaStream);
        setCameraPermissionGranted(true);
      }
      setCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const takePhoto = () => {
    const video = document.getElementById("camera-preview");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const imageFile = new File([blob], "photo.png", { type: "image/png" });
      setCapturedPhoto(imageFile);
      setPhotoTaken(true);
      setCameraActive(false); // Stop the camera after taking the photo
      // Update the preview source
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result);
      };
      reader.readAsDataURL(imageFile);
    }, "image/png");
  };

  const handleTakeSelfie = async () => {
    await openCamera();
    setShowModal(true);
  };

  useEffect(() => {
    if (cameraActive && stream) {
      const video = document.getElementById("camera-preview");
      video.srcObject = stream;
      video.play();
    } else if (!cameraActive && stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [cameraActive, stream]);

  const handleRetakeSelfie = async () => {
    setCapturedPhoto(null);
    setPhotoTaken(false);
    setPreviewSrc(null);
    setShowModal(false);
    setCameraPermissionGranted(false);
    setCameraActive(true); // Cambio a true para activar la cámara nuevamente
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
    console.log("Selfie saved:", previewSrc);
    setShowModal(false);
  };

  const handleRegisterClick = async (event) => {
    event.preventDefault();

    setLoading(true);
    setLoadingMessage("Registrando...");

    // Agregar el retraso de 10 segundos antes de continuar con el registro
    await new Promise((resolve) => setTimeout(resolve, 7000));

    const data = new FormData();
    data.append("first_name", formData.firstName);
    data.append("last_name", formData.lastName);
    data.append("identification_number", formData.identificationNumber);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("photo", capturedPhoto);

    try {
      const response = await fetch(`${URL_BACKEND}/users/`, {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        console.log("User registered successfully.");

        const responseData = await response.json();
        console.log(responseData);
        console.log(responseData.first_name);
        sessionStorage.setItem("user_nombre", responseData.first_name);
        sessionStorage.setItem("user_apellido", responseData.last_name);
        sessionStorage.setItem("user_correo", responseData.email);
        sessionStorage.setItem("user_foto", responseData.photo);
        sessionStorage.setItem("user_id", responseData.id);
        navigate("/user");
        Swal.fire({
          icon: "success",
          title: "Succesfully registered",
          text: "Welcome aboard!",
        });
      } else {
        const errorData = await response.json();
        if ("detail" in errorData) {
          Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: errorData.detail[0],
          });
        } else {
          setErrors(errorData); // Guardar los errores en el estado
        }
      }
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    setLoadingMessage("Iniciando sesión...");

    await new Promise((resolve) => setTimeout(resolve, 7000));

    const data = new FormData();
    data.append("email", formDataLogin.emaillogin);
    data.append("password", formDataLogin.password);

    try {
      const response = await fetch(`${URL_BACKEND}/users/login/`, {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const responseData = await response.json();
        const userPhoto = responseData.user.photo;
 
        sessionStorage.setItem("user_nombre", responseData.user.first_name);
        sessionStorage.setItem("user_apellido", responseData.user.last_name);
        sessionStorage.setItem("user_correo", responseData.user.email);
        sessionStorage.setItem("user_foto", userPhoto);
        sessionStorage.setItem("user_id", responseData.user.id);

        navigate("/user");
        Swal.fire({
          icon: "success",
          title: "Login succesful",
          text: "Welcome back!",
        });
      } else {
        console.error("Failed to login user:", response);
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Error login user:", error);
    } finally {
      setLoading(false);
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
      {loading ? ( // Renderiza la pantalla de carga si loading es true
        <div
          className="d-flex justify-content-center align-items-center vh-100"
          style={{
            backgroundColor: "#f3f4f6",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Hourglass
            height="150"
            width="150"
            radius="9"
            colors={["#6366F1", "#9333EA"]}
            ariaLabel="hourglass-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />

          <h1>{loadingMessage}</h1>
        </div>
      ) : (
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
                      required
                    />
                    {errors.firstName && (
                      <div className="error-api">{errors.firstName[0]}</div>
                    )}
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      onChange={handleInputChange}
                      required
                    />
                    {errors.lastName && (
                      <div className="error-api">{errors.lastName[0]}</div>
                    )}
                    <input
                      type="text"
                      name="identificationNumber"
                      placeholder="Identification number"
                      onChange={handleInputChange}
                      required
                    />
                    {errors.identification_number && (
                      <div className="error-api">
                        {errors.identification_number[0]}
                      </div>
                    )}
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleInputChange}
                      required
                    />
                    {errors.email && (
                      <div className="error-api">{errors.email[0]}</div>
                    )}
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={handleInputChange}
                      required
                    />
                    {errors.password && (
                      <div className="error-api">{errors.password[0]}</div>
                    )}
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
                    {errors.photo && (
                      <div className="error-api">{errors.photo[0]}</div>
                    )}
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
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={handleInputLoginChange}
                      required
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
              <Modal.Title>Take a Selfie</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {cameraActive ? (
                <div>
                  <video id="camera-preview" style={{ width: "100%" }}></video>
                  <Button variant="primary" onClick={takePhoto}>
                    Take Photo
                  </Button>
                </div>
              ) : (
                <img
                  src={previewSrc}
                  alt="Selfie Preview"
                  className="selfie-preview-modal"
                />
              )}
            </Modal.Body>
            <Modal.Footer>
              {photoTaken ? (
                <>
                  <Button variant="secondary" onClick={handleRetakeSelfie}>
                    Retake
                  </Button>
                  <Button variant="primary" onClick={handleSaveSelfie}>
                    Save
                  </Button>
                </>
              ) : (
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              )}
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
}
