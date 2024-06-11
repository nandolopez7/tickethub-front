import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import "../css/navbar_initial_component.css";

export function NavbarInitialComponent() {
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    navigate(path);
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="gradient-bg" sticky="top">
        <Container>
          <Navbar.Brand
            className="me-auto text-navbar"
            onClick={() => handleLinkClick("/")}
            style={{ cursor: "pointer" }}
          >
            TicketHub
          </Navbar.Brand>
          <Navbar.Toggle className="bg-body-tertiary" aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                className="text-navbar"
                onClick={() => handleLinkClick("/browse-event")}
              >
                Browse events
              </Nav.Link>
              <Nav.Link
                className="text-navbar"
                onClick={() => handleLinkClick("/contact")}
              >
                Contact
              </Nav.Link>
              <Nav.Link
                className="text-navbar"
                onClick={() => handleLinkClick("/about")}
              >
                About
              </Nav.Link>
              <Nav.Link
                className="text-navbar"
                onClick={() => handleLinkClick("/about")}
              >

              </Nav.Link>

            </Nav>
            <Nav className="ms-auto">
              <Nav.Link
                className="text-navbar"
                onClick={() => handleLinkClick("/sign-in")}
              >
                Sign In/Up
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
