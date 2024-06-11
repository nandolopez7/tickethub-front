import axios from "axios";
import React, { useEffect, useState } from 'react';
import { NavbarInitialComponent } from "../components/navbar_initial_component";
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Button,
} from "react-bootstrap";
import { CardEvent } from "../components/card_events_component";
import Swal from "sweetalert2";


export function BrowseEvent() {
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
  // eslint-disable-next-line
  const [selectedEventId, setSelectedEventId] = useState(null);
  // eslint-disable-next-line
  const handleBuyTicketsClick = (eventData) => {
    console.log("Event ID:", eventData.id); // Imprimir el ID del evento
    setSelectedEventId(eventData.id); // Actualizar el estado con el ID del evento seleccionado
    setSelectedEvent(eventData);
  };
  // eslint-disable-next-line
  const handleConfirmPurchase = () => {
    const number = parseInt(document.getElementById("formQuantity").value);
    const cost = selectedEvent.price;
    const event = selectedEvent.id;
    const assistant = sessionStorage.getItem("user_id");

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

  // eslint-disable-next-line
  const handleQuantityChange = () => {
    const quantity = parseInt(document.getElementById("formQuantity").value);
    const cost = selectedEvent.price;
    const totalPrice = cost * quantity;
    document.getElementById("totalPrice").innerText = totalPrice;
    document.getElementById("totalPrice").value = totalPrice;
  };

  // eslint-disable-next-line
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };


  return (
    <>
      <NavbarInitialComponent />
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
              <Dropdown.Item onClick={() => setSelectedCategory("Exposicion")}>
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
              />           
            </Col>          
          ))}
        </Row>
        {/* Botón "Cargar más" */}
        {visibleEvents < filteredEvents.length && (
          <Row className="mt-3 text-center">
            <Col>
              <Button variant="dark" onClick={handleShowMore} style={{marginBottom:"20px"}}>
                Cargar más
              </Button>
            </Col>
          </Row>
        )}
      </Container>

    </>

    
  );
}
