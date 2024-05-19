import { NavbarInitialComponent } from "../components/navbar_initial_component";
import { Container, Col, Row, Button, Carousel, Image } from "react-bootstrap";
import "../css/initial_page_style.css";
export function InitialPage() {
  return (
    <>
      <NavbarInitialComponent />
      <Container
        className="gradient-bg"
        fluid
        style={{
          color: "#ffffff",
        }}
      >
        <Row className="align-items-center">
          <Col xs={12} md={6} className="text-start padding-row">
            {/* La primera columna con contenido justificado a la izquierda */}
            <h2 style={{ marginBottom: "1rem" }}>
              Discover the best Music Events
            </h2>
            <h5 style={{ marginBottom: "1rem" }}>
              Find and buy tickets for the hottest concerts, festivals, and
              more.
            </h5>
            <Button
              variant="light"
              className="custom-button"
            >
              Find tickets
            </Button>
          </Col>
          <Col xs={12} md={6} className="text-center">
            {/* La segunda columna con contenido centrado */}
            <Carousel className="carousel-style">
              <Carousel.Item>
                <Image
                  rounded
                  className="d-block w-100"
                  src="events/top.webp"
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <Image
                  rounded
                  className="d-block w-100"
                  src="events/ana.webp"
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <Image
                  rounded
                  className="d-block w-100"
                  src="events/louis.webp"
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <Image
                  rounded
                  className="d-block w-100"
                  src="events/planca.webp"
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <Image
                  rounded
                  className="d-block w-100"
                  src="events/pride.webp"
                  alt="First slide"
                />
              </Carousel.Item>
            </Carousel>
          </Col>
        </Row>
      </Container>
    </>
  );
}
