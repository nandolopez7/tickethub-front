import React from "react";
import { NavbarInitialComponent } from "../components/navbar_initial_component";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import Footer from "../components/footer_initial_component";
import "../css/contact_page_style.css"; // Asegúrate de tener un archivo CSS para estilizar el componente

export function Contact() {
  return (
    <>
      <NavbarInitialComponent />
      <Container fluid className="contact-container">
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="contact-card">
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-4 mb-md-0">
                    <Form>
                      <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter your name" />
                      </Form.Group>

                      <Form.Group controlId="formEmail" className="mt-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter your email" />
                      </Form.Group>

                      <Form.Group controlId="formMessage" className="mt-3">
                        <Form.Label>Message</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Enter your message" />
                      </Form.Group>

                      <Button variant="primary" type="submit" className="mt-3">
                        Submit
                      </Button>
                    </Form>
                  </Col>
                  <Col md={6} className="d-flex justify-content-center align-items-center">
                    <img
                      src="/contact-us.webp"
                      alt="Decorative"
                      className="img-fluid contact-image"
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}
