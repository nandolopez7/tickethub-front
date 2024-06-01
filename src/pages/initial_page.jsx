import { NavbarInitialComponent } from "../components/navbar_initial_component";
import Footer  from "../components/footer_initial_component";
import {
  Container,
  Col,
  Row,
  Button,
  Carousel,
  Image,
  Card,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faCalendar,
  faTicket,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import "../css/initial_page_style.css";
export function InitialPage() {
  const navigate = useNavigate();

  const handleEventClick = () => {
    navigate("/browse-event");
  };

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
            <h2 style={{ marginBottom: "1rem" }}>Discover the best Events</h2>
            <h5 style={{ marginBottom: "1rem" }}>
              Find and buy tickets for the hottest concerts, festivals, and
              more.
            </h5>
            <Button variant="light" className="custom-button" onClick={handleEventClick}>
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
      <Container
        fluid
        style={{
          backgroundColor: "#eee9",
        }}
      >
        <Row className="row-events-init">
          <h2>Hot stuff at your hand!</h2>
          <p>
            TicketHub is your one-stop destination for finding the hottest music
            events, concerts, shows, and more. Explore our curated selection and
            get your tickets today.
          </p>
          <Col xs={12} md={10} lg={8} xl={6} xxl={4} className="col-init">
            <Card className="card-init">
              <Card.Img variant="top" src="events/Festivales.jpg" />
              <Card.Body>
                <Card.Title> Music Festivals </Card.Title>
                <Card.Text>
                  Discover the biggest and best music festivals.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={10} lg={8} xl={6} xxl={4} className="col-init">
            <Card className="card-init">
              <Card.Img variant="top" src="events/Conciertos.jpg" />
              <Card.Body>
                <Card.Title> Concerts </Card.Title>
                <Card.Text>
                  Find tickets to the hottest concerts in town.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={10} lg={8} xl={6} xxl={4} className="col-init">
            <Card className="card-init">
              <Card.Img variant="top" src="events/Comedia.jpg" />
              <Card.Body>
                <Card.Title> Comedy Shows </Card.Title>
                <Card.Text>Laugh out loud at the best comedy shows.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={10} lg={8} xl={6} xxl={4} className="col-init">
            <Card className="card-init">
              <Card.Img variant="top" src="events/Deportes.jpg" />
              <Card.Body>
                <Card.Title> Sports Events </Card.Title>
                <Card.Text> Catch the biggest games and matches. </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={10} lg={8} xl={6} xxl={4} className="col-init">
            <Card className="card-init">
              <Card.Img variant="top" src="events/Familiares.jpg" />
              <Card.Body>
                <Card.Title> Family Events </Card.Title>
                <Card.Text> Find fun events for the whole family. </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={10} lg={8} xl={6} xxl={4} className="col-init">
            <Card className="card-init">
              <Card.Img variant="top" src="events/Teatro.jpg" />
              <Card.Body>
                <Card.Title> Theater </Card.Title>
                <Card.Text>
                  {" "}
                  Discover the latest theatrical productions.{" "}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Container
        fluid
        style={{
          backgroundColor: "#CECECE",
        }}
      >
        <div className="img-init-cont">
          <img className="img-init" src="aliados/cean.png" alt="" />
          <img className="img-init" src="aliados/cevp.png" alt="" />
          <img className="img-init" src="aliados/medplus.png" alt="" />
          <img className="img-init" src="aliados/royalCenter.png" alt="" />
          <img className="img-init" src="aliados/movistarar.png" alt="" />
        </div>
      </Container>
      <Container
        fluid
        style={{
          backgroundColor: "#eee9",
        }}
      >
        <Row className="text-center">
          <h2 style={{ marginTop: "20px" }}>Why Choose TicketHub?</h2>
          <Col xs={12} md={10} lg={8} xl={6} xxl={4} className="col-init">
            <Card className="card-init">
              <Card.Body>
                <FontAwesomeIcon
                  icon={faTicket}
                  size="2xl"
                  style={{ color: "#6366f1" }}
                />
                <Card.Title> Secure Ticketing </Card.Title>
                <Card.Text>
                  Our secure platform ensures your tickets are safe and easy to
                  manage.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={10} lg={8} xl={6} xxl={4} className="col-init">
            <Card className="card-init">
              <Card.Body>
                <FontAwesomeIcon
                  icon={faCalendar}
                  size="2xl"
                  style={{ color: "#6366f1" }}
                />
                <Card.Title> Comprehensive Calendar </Card.Title>
                <Card.Text>
                  Browse our extensive calendar of events to find the perfect
                  experience.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={10} lg={8} xl={6} xxl={4} className="col-init">
            <Card className="card-init">
              <Card.Body>
                <FontAwesomeIcon
                  icon={faWallet}
                  size="2xl"
                  style={{ color: "#6366f1" }}
                />
                <Card.Title> Easy Payments </Card.Title>
                <Card.Text>
                  Enjoy a seamless checkout process with multiple payment
                  options.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer/>
    </>
  );
}
