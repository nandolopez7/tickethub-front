import React, { useState, useEffect } from "react";
import { SidebarUser } from "../components/sidebar_user_component";
import { Container, Row, Col, Image, Form } from "react-bootstrap";
import styled from "styled-components";

const MainContent = styled.div`
  padding: 20px;
  transition: margin-left 0.3s ease-in-out;
  @media (min-width: 768px) {
    margin-left: ${({ isOpen }) => (isOpen ? "280px" : "25px")};
  }
  @media (max-width: 767px) {
    margin-left: ${({ isOpen }) => (isOpen ? "0" : "60px")};
  }
`;

export function UserProfile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    const user_nombre = sessionStorage.getItem("user_nombre");
    const user_apellido = sessionStorage.getItem("user_apellido");
    const user_correo = sessionStorage.getItem("user_correo");
    const user_foto = sessionStorage.getItem("user_foto");

    let parsedData = data ? JSON.parse(data) : {};

    // Agregar datos de sessionStorage al objeto userData
    parsedData = {
      ...parsedData,
      nombre: user_nombre,
      apellido: user_apellido,
      correo: user_correo,
      foto: user_foto,
    };

    setUserData(parsedData);
  }, []);


  return (
    <>
      <Container
        fluid
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SidebarUser isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
        <MainContent isOpen={isSidebarOpen}>
          <Row>
            <Col>
              {userData ? (
                <>
                  <Form
                    style={{
                      borderRadius: "15px",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                      padding: "25px",
                    }}
                  >
                    <Col xs={6} md={4}>
                      <Image
                        src={"/pruebas/olas.jpg"}
                        roundedCircle
                        style={{ width: "400px", height: "auto" }}
                      />
                    </Col>
                    <Form.Group
                      style={{
                        borderRadius: "15px",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                      }}
                      as={Row}
                      className="mb-3 mt-3"
                      controlId="formPlaintextEmail"
                    >
                      <Form.Label column sm="2">
                        Email
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          plaintext
                          readOnly
                          defaultValue={userData.correo || "email"}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group
                      style={{
                        borderRadius: "15px",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                      }}
                      as={Row}
                      className="mb-3 mt-3"
                      controlId="formPlaintextName"
                    >
                      <Form.Label column sm="2">
                        First name
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          plaintext
                          readOnly
                          defaultValue={userData.nombre || "nombre"}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group
                      style={{
                        borderRadius: "15px",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                      }}
                      as={Row}
                      className="mb-3 mt-3"
                      controlId="formPlaintextLast"
                    >
                      <Form.Label column sm="2">
                        Last name
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          plaintext
                          readOnly
                          defaultValue={userData.apellido || "apellido"}
                        />
                      </Col>
                    </Form.Group>
                  </Form>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </Col>
          </Row>
        </MainContent>
      </Container>
    </>
  );
}
