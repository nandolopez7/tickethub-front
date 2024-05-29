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

export function BrowseEvent() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleEvents, setVisibleEvents] = useState(6); // Controla cuántos eventos se muestran
  const URL_BACKEND = "http://127.0.0.1:8000";
  const [eventsback, setEvents] = useState([]);

  const events = [
    {
      title: "Concierto de Cepeda",
      date: "24 de Junio, 2024",
      location: "Madrid, España",
      category: "Concierto",
      imageUrl: "pruebas/cepeda.jpg",
    },
    {
      title: "FerxxoCalipsis",
      date: "15 de Julio, 2024",
      location: "Barcelona, España",
      category: "Concierto",
      imageUrl: "pruebas/ferxxo.jpg",
    },
    {
      title: "The Juanpis Live Show",
      date: "1 de Agosto, 2024",
      location: "Nueva Orleans, EE.UU.",
      category: "Comedia",
      imageUrl: "pruebas/juanpis.jpg",
    },
    {
      title: "Festival Cordillera",
      date: "12 de Septiembre, 2024",
      location: "Bogotá, Colombia",
      category: "Festival",
      imageUrl: "pruebas/cordillera.jpg",
    },
    {
      title: "Aurora",
      date: "9 de Agosto, 2024",
      location: "Bogotá, Colombia",
      category: "Concierto",
      imageUrl: "pruebas/aurora.jpg",
    },
    {
      title: "Bañomaria",
      date: "25 de Junio, 2024",
      location: "Bogotá, Colombia",
      category: "Concierto",
      imageUrl: "pruebas/bañomaria.jpg",
    },    {
        title: "Corona Sunset",
        date: "24 de Junio, 2024",
        location: "Santa Marta, Colombia",
        category: "Festival",
        imageUrl: "pruebas/corona.jpg",
      },
      {
        title: "Drunk Comedy",
        date: "15 de Julio, 2024",
        location: "Barcelona, España",
        category: "Comedia",
        imageUrl: "pruebas/drunk.jpg",
      },
      {
        title: "Expo Gabo",
        date: "1 de Agosto, 2024",
        location: "Nueva Orleans, EE.UU.",
        category: "Exposicion",
        imageUrl: "pruebas/gabo.jpg",
      },
      {
        title: "Millonarios F.C.",
        date: "12 de Septiembre, 2024",
        location: "Bogotá, Colombia",
        category: "Deportes",
        imageUrl: "pruebas/millos.png",
      },
      {
        title: "Olas Sonoras",
        date: "12 de Septiembre, 2024",
        location: "Bogotá, Colombia",
        category: "Festival",
        imageUrl: "pruebas/olas.jpg",
      },
      {
        title: "Vino al parque",
        date: "12 de Septiembre, 2024",
        location: "Bogotá, Colombia",
        category: "Festival",
        imageUrl: "pruebas/vino.jpg",
      },
  ];

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
          <Row className="justify-content-center mt-3 text-center">
            <Col>
              <Button variant="dark" onClick={handleShowMore}>
                Cargar más
              </Button>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}
