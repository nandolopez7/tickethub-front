import React, { useState, useEffect } from "react";
import axios from "axios";
import { SidebarUser } from "../components/sidebar_user_component";
import {
  Container,
  Row,
  Col,
  Modal,
  Form,
  Dropdown,
  DropdownButton,
  Button,
} from "react-bootstrap";
import { CardEvent } from "../components/card_events_component";
import styled from "styled-components";
import Swal from "sweetalert2";

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

export function UserEvent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleEvents, setVisibleEvents] = useState(6); // Controla cuántos eventos se muestran
  const URL_BACKEND = "http://127.0.0.1:8000";
  const [eventsback, setEvents] = useState([]);

  const headers = {
    "Content-Type": "application/json",
  };

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

  const [selectedEvent, setSelectedEvent] = useState(null);
    //eslint-disable-next-line
  const [selectedEventId, setSelectedEventId] = useState(null);

  const handleBuyTicketsClick = (eventData) => {
    console.log("Event ID:", eventData.id); // Imprimir el ID del evento
    setSelectedEventId(eventData.id); // Actualizar el estado con el ID del evento seleccionado
    setSelectedEvent(eventData);
  };

  const handleConfirmPurchase = () => {
    const number = parseInt(document.getElementById("formQuantity").value);
    const cost = selectedEvent.price;
    /* const cost = 500; */
    const event = selectedEvent.id;
    const assistant = sessionStorage.getItem("user_id")

    /* const assistant = 27; */
    const name = document.getElementById("formName").value;
    const documentNumber = document.getElementById("formDocument").value;
    const totalPrice = cost * number;

    /* console.log(usuario); */
    console.log(number);
    console.log(cost);
    console.log(assistant);

    if (
      number <= 0 ||
      isNaN(totalPrice) ||
      name.trim() === "" ||
      documentNumber.trim() === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill all required fields and select at least one ticket.",
      });
      return;
    }

    axios
      .post(
        "http://127.0.0.1:8000/buy-ticket-event/",
        { number, cost, event, assistant },
        { headers }
      )
      .then((response) => {
        console.log(response);
        console.log(response.data.id);
        console.log(response.data.valid);
        // Cuando la solicitud es exitosa
        if (response.status === 201) {
          setSelectedEvent(null);

          Swal.fire({
            icon: "success",
            title: `Thank you, ${name}!`,
            text: `Your purchase has been confirmed. Total: $${totalPrice}`,
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
          title: "Something went wrong",
          text: "Please, try again",
          showConfirmButton: false,
          allowOutsideClick: false,
          showCancelButton: false,
          timer: 1800,
        });
      });
  };
  //eslint-disable-next-line
  const handleQuantityChange = () => {
    const quantity = parseInt(document.getElementById("formQuantity").value);
    const totalPrice = selectedEvent.price * quantity;
    document.getElementById("totalPrice").innerText = totalPrice;
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      <Container fluid>
        <SidebarUser isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
        <MainContent isOpen={isSidebarOpen}>
          <Row className="mt-3 text-center">
            <Col>
              <h1>Browse all available events to purchase</h1>
              <DropdownButton
                variant="outline-dark"
                id="dropdown-basic-button"
                title={`Filter: ${selectedCategory}`}
              >
                <Dropdown.Item onClick={() => setSelectedCategory("All")}>
                  All
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedCategory("Concierto")}>
                  Concierto
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedCategory("Comedia")}>
                  Comedia
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedCategory("Festival")}>
                  Festival
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedCategory("Deportes")}>
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
                  price= {event.price}
                />

                <Button
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#6366F1",
                    color: "#fff",
                    border: "none",
                  }}
                  onClick={() => handleBuyTicketsClick(event)}
                  className="btn-sm"
                >
                  Buy Tickets
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
        </MainContent>
      </Container>

      <Modal
        show={selectedEvent !== null}
        backdrop="static"
        keyboard={false}
        onHide={() => setSelectedEvent(null)}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>{selectedEvent && selectedEvent.name}</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              <h5>
                <b>Date:</b> {selectedEvent.date}
              </h5>
              <h5>
                <b>Price:</b> ${selectedEvent.price}
              </h5>
              <img
                src={selectedEvent.file_cover}
                alt={selectedEvent.name}
                style={{ width: "100%" }}
              />
            </div>
          )}
          <Form style={{ marginTop: "1rem" }}>
            <Form.Group controlId="formQuantity" className="mb-3">
              <Form.Label className="mb-2">Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter quantity"
              />
            </Form.Group>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label className="mb-2">Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" />
            </Form.Group>
            <Form.Group controlId="formDocument" className="mb-3">
              <Form.Label className="mb-2">Document Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your document number"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="warning" onClick={handleConfirmPurchase}>
            Confirm Purchase
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
