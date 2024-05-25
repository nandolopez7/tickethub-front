import { NavbarInitialComponent } from "../components/navbar_initial_component";
import React, { useState } from "react";
import { Container, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import "../css/sign_pages_style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
export function SignIn() {
  const [isActive, setIsActive] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);

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

  const handleSaveSelfie = () => {
    // Aquí puedes guardar la selfie, por ejemplo, enviándola a un servidor
    console.log("Selfie saved:", previewSrc);
  };

  const handleRegisterClick = () => {
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
              <form>
                <h1>Create Account</h1>
                <input type="text" placeholder="Name" />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <div className="register-buttons">
                  <button type="button">Sign Up</button>
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
              <form>
                <h1>Sign In</h1>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <a href="#">Forgot your password?</a>
                <button type="button">Sign In</button>
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
                    onClick={handleRegisterClick}
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
