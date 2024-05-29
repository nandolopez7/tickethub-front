import { NavbarInitialComponent } from "../components/navbar_initial_component";
import { Container, Row, Card } from "react-bootstrap";
import "../css/about_page_style.css"
import Footer  from "../components/footer_initial_component";
export function About() {
  return (
    <>
      <NavbarInitialComponent />
      <Container
        fluid
        className="container-about"
      >
        <Row className="row-about">
          <Card className="card-about">
            <Card.Body>
            <Card.Title><h1>About Us</h1></Card.Title>
              <p>
                TicketHub is a leading online platform for buying
                tickets to events, concerts, and more. Our mission is to make it
                easy for people to discover and attend the events they love.
              </p>
              <p>
                We were founded in 2020 with the goal of revolutionizing the
                ticketing industry. Since then, we've grown to become one of the
                most trusted and reliable ticketing platforms in the world.
              </p>
              <p>
                Our team is passionate about creating a seamless and enjoyable
                experience for both event organizers and attendees. We're
                constantly innovating and improving our platform to ensure that
                everyone who uses TicketHub has a great time.
              </p>
              <p>
                Whether you're looking to buy tickets to your favorite concert or
                sport event, TicketHub is the platform for
                you. We're here to help you connect with the people and
                experiences that matter most.
              </p>
            </Card.Body>
          </Card>
        </Row>
      </Container>
      <Footer className="footer-about"/>
    </>
  );
}
