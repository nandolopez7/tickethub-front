import React, { useState, useEffect } from "react";

import { SidebarUser } from "../components/sidebar_user_component";
import {
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { CardEvent } from "../components/card_events_component";
import styled from "styled-components";


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
export function MyEvents() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  //eslint-disable-next-line
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [eventsback, setEvents] = useState([]);
  //eslint-disable-next-line
  const [selectedEvent, setSelectedEvent] = useState(null);
  //eslint-disable-next-line
  const [selectedEventId, setSelectedEventId] = useState(null);
  const URL_BACKEND = "http://127.0.0.1:8000";
  
  const userId = sessionStorage.getItem("user_id");

  useEffect(() => {
    // Verifica si se ha obtenido el ID de usuario
    if (!userId) {
      console.error("User ID not found in sessionStorage");
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${URL_BACKEND}/events/assistant_user_events/?user=${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
          setVisibleEvents(data);
        } else {
          console.error("Failed:", response.statusText);
          // Maneja los errores aquí
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchEvents();
  }, [userId]);

  useEffect(() => {
    console.log(eventsback);
  }, [eventsback]);
  //eslint-disable-next-line
  const handleShowMore = () => {
    setVisibleEvents((prevVisibleEvents) => prevVisibleEvents + 6);
  };
  //eslint-disable-next-line
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
              <h1>Events that you own</h1>
            </Col>
          </Row>
          <Row className="row-events">
            {visibleEvents.map((event, index) => (

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
              </Col>
            ))}
          </Row>
        </MainContent>
      </Container>
    </>
  );
}
