import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { api } from "../api/api_base";
import { SidebarAdmin } from "../components/sidebar_admin_component";
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Button,
  Modal,
  Form,
  OverlayTrigger ,
  Tooltip
} from "react-bootstrap";
import styled from "styled-components";
import { CardEvent } from "../components/card_events_component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const MainContent = styled.div`
  padding: 20px;
  transition: margin-left 0.3s ease-in-out;
  @media (min-width: 768px) {
    margin-left: ${({ isOpen }) => (isOpen ? "280px" : "25px")};
  }
  @media (max-width: 767px) {
    margin-left: ${({ isOpen }) => (isOpen ? "0" : "25px")};
  }
`;

export function UserAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleEvents, setVisibleEvents] = useState(6); // Controla cuántos eventos se muestran
  const URL_BACKEND = "http://127.0.0.1:8000";
  const [eventsback, setEvents] = useState([]);

  // Filtrar eventos según la categoría seleccionada
  const filteredEvents =
    selectedCategory === "All"
      ? eventsback
      : eventsback.filter((event) => event.category === selectedCategory);

  // Mostrar más eventos
  const handleShowMore = () => {
    setVisibleEvents((prevVisibleEvents) => prevVisibleEvents + 6); // Muestra 6 eventos adicionales
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${URL_BACKEND}/events/`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error("Failed:", response.statusText);
          // Maneja los errores aquí
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    console.log(eventsback);
  }, [eventsback]);


  {/*Verification process*/}
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [stream, setStream] = useState(null);
  const [verificationPhoto, setVerificationPhoto] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);

  const openCamera = async () => {
    try {
      if (!cameraPermissionGranted) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(mediaStream);
        setCameraPermissionGranted(true);
      }
      setCameraActive(!cameraActive);
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
      const imageFile = new File([blob], 'photo.png', { type: 'image/png' });
      setVerificationPhoto(imageFile); // Almacenar la foto capturada como un objeto de archivo
      setPhotoTaken(true);
      openCamera();
    }, 'image/png');
  };

  

  useEffect(() => {
    if (stream && cameraActive) {
      const video = document.getElementById("camera-preview");
      video.srcObject = stream;
    }
  }, [stream, cameraActive]);

  const [verificationModalOpen, setVerificationModalOpen] = useState(false);

  const openVerificationModal = (eventData) => {
    setSelectedEvent(eventData); // Actualizar el estado del evento seleccionado
    setVerificationModalOpen(true);
    setPhotoTaken(false);
    console.log(eventData.id)
    setSelectedEventId(eventData.id); // Actualizar el estado con el ID del evento seleccionado
  };

  const closeVerificationModal = () => {
    setVerificationModalOpen(false);
    setVerificationPhoto(null); // Limpiar la foto de verificación
    setPhotoTaken(false);
  };

  const handlePerformVerification = () => {
    const headers = {
      "Content-Type": "multipart/form-data",
    };

    console.log(selectedEventId)
    const user_photo = verificationPhoto
    const event= selectedEventId;

    const URL_BACKEND = "http://127.0.0.1:8000";

    
    //axios;
    api
      .post(
        `${URL_BACKEND}/events/validate_user_entry/`,
        { event, user_photo },
        { headers }
      )
      .then((response) => {
        console.log(response);
        console.log(response.data.id);
        // Cuando la solicitud es exitosa
        if (response.status === 200) {
          setSelectedEvent(null);
  
          Swal.fire({
            icon: "success",
            title: `Identity confirmed`,
            text: `We have successfully verified your identity with our records, enjoy the event!`,
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirigir a la página actual
              window.location.reload();
            }
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: "No hay más boletas",
            text: "Escoge otro evento",
            showConfirmButton: false,
            allowOutsideClick: false,
            showCancelButton: false,
            timer: 1800,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Identity denied",
          text: "Oops, it seems that your photo does not match with our records",
          showConfirmButton: false,
          allowOutsideClick: false,
          showCancelButton: false,
          timer: 1800,
        });
      });
  };



  return (
    <>
      <Container fluid>
        <SidebarAdmin isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
        <MainContent isOpen={isSidebarOpen}>
          <Row>
            <Row className="mt-3 text-center">
              <Col>
                <h1>Choose event to verify identity</h1>
                <DropdownButton
                  variant="outline-dark"
                  id="dropdown-basic-button"
                  title={`Filter: ${selectedCategory}`}
                >
                  <Dropdown.Item onClick={() => setSelectedCategory("All")}>
                    All
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setSelectedCategory("Concierto")}
                  >
                    Concierto
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedCategory("Comedia")}>
                    Comedia
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setSelectedCategory("Festival")}
                  >
                    Festival
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setSelectedCategory("Deportes")}
                  >
                    Deportes
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setSelectedCategory("Exposicion")}
                  >
                    Exposicion
                  </Dropdown.Item>
                </DropdownButton>
              </Col>
            </Row>
            {/* Mostrar eventos filtrados */}
            <Row className="row-events">
              {filteredEvents.slice(0, visibleEvents).map((event, index) => (
                <Col
                  key={index}
                  xs={12}
                  md={10}
                  lg={8}
                  xl={6}
                  xxl={4}
                  className="mb-4"
                >
                  <CardEvent
                    title={event.name}
                    date={event.date}
                    location={event.place}
                    category={event.category}
                    imageUrl={event.file_cover}
                    price={event.price}
                  />
                  <Button
                    style={{
                      marginTop: "10px",
                      backgroundColor: "#6366F1",
                      color: "#fff",
                      border: "none",
                    }}
                    onClick={() => openVerificationModal(event)}
                  >
                    Verify identity
                  </Button>
                </Col>
              ))}
            </Row>
            {/* Botón "Cargar más" */}
            {visibleEvents < filteredEvents.length && (
              <Row className="mt-3 text-center">
                <Col>
                  <Button
                    variant="dark"
                    onClick={handleShowMore}
                    style={{ marginBottom: "20px" }}
                  >
                    Cargar más
                  </Button>
                </Col>
              </Row>
            )}
          </Row>
        </MainContent>
      </Container>

      <Modal
        show={verificationModalOpen}
        onHide={closeVerificationModal}
        backdrop="static"
        keyboard={false}
        style={{ zIndex: 1300 }} 
      >
        <Modal.Header closeButton>
        <Modal.Title>Verify Identity for {selectedEvent && selectedEvent.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formSelfie" className="mb-3">
            <Form.Label>
              Take a Selfie
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="tooltip-info">
                    Al tomar una selfie, estás contribuyendo a mejorar la
                    seguridad y la experiencia de todos los asistentes al
                    evento. Utilizaremos esta imagen para verificar tu identidad
                    al momento de validar tu entrada. Este proceso nos ayuda a
                    garantizar que solo los compradores originales puedan
                    acceder al evento, lo que reduce significativamente la
                    posibilidad de reventa de entradas y garantiza una
                    experiencia más justa y segura para todos. ¡Gracias por tu
                    cooperación en mantener nuestros eventos seguros y
                    protegidos!
                  </Tooltip>
                }
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  style={{ cursor: "help" }}
                />
              </OverlayTrigger>
            </Form.Label>
            <Button
              variant="primary"
              onClick={openCamera}
              className="me-2 ms-2 btn-sm"
            >
              {cameraActive ? "Close Camera" : "Open Camera"}
            </Button>
            {cameraActive && cameraPermissionGranted && (
              <>
                <video
                  id="camera-preview"
                  autoPlay
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    height: "auto",
                    marginTop: "1rem",
                  }}
                  className="mb-2"
                ></video>
                <Button variant="success" onClick={takePhoto} className="me-2">
                  Take Photo
                </Button>
              </>
            )}
            {photoTaken && (
              <>
                <h2 className="mb-2">Photo Taken</h2>
                <img
                  src={URL.createObjectURL(verificationPhoto)}
                  alt="Captured"
                  style={{
                    maxWidth: "100%", // Asegura que la imagen no supere el ancho del contenedor
                    maxHeight: "100%", // Asegura que la imagen no supere la altura del contenedor
                    width: "auto", // Ajusta el ancho automáticamente
                    height: "auto", // Ajusta la altura automáticamente
                    marginTop: "1rem", // Agrega un margen superior para separar la imagen del resto del contenido
                  }}
                />
              </>
            )}
          </Form.Group>{" "}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeVerificationModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePerformVerification}>
            Perform Verification
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
