import React, { useEffect, useState } from "react";
import "../css/admin_page_style.css";
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Button,
} from "react-bootstrap";
import { CardEvent } from "../components/card_events_component";

export function UserAdmin() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleEvents, setVisibleEvents] = useState(6); // Controla cuántos eventos se muestran
  const URL_BACKEND = "http://127.0.0.1:8000";
  const [eventsback, setEvents] = useState([]);

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

  const handleVerifyIdentity = (event) => {
    console.log("Verifying identity for event:", event);
    // Aquí puedes agregar la lógica para manejar la verificación de identidad
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "verify-identity":
        return (
          <Container fluid>
            {/* Dropdown para seleccionar la categoría */}
            <Row className="mt-3 text-center">
              <Col>
                <h1>Browse all available events</h1>
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
                  <div>
                    <CardEvent
                      title={event.name}
                      date={event.date}
                      location={event.place}
                      category={event.category}
                      imageUrl={event.file_cover}
                    />
                    <Button
                      variant="primary"
                      onClick={() => handleVerifyIdentity(event)}
                      style={{ marginTop: "10px" }}
                    >
                      Verify identity
                    </Button>
                  </div>
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
          </Container>
        );
      case "add-event":
        return <div>Add Event Content</div>;
      case "sign-out":
        return <div>Sign Out Content</div>;
      default:
        return <div>Please select an option from the sidebar.</div>;
    }
  };

  return (
    <>
      <div className="sidebar">
        <ul>
          <li>
            <a
              href="#verify-identity"
              onClick={() => setSelectedOption("verify-identity")}
            >
              Verify identity
            </a>
          </li>
          <li>
            <a href="#add-event" onClick={() => setSelectedOption("add-event")}>
              Add event
            </a>
          </li>
          <li>
            <a href="#sign-out" onClick={() => setSelectedOption("sign-out")}>
              Sign Out
            </a>
          </li>
        </ul>
      </div>
      <div className="content">{renderContent()}</div>
    </>
  );
}
