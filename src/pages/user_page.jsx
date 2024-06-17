import React, { useState, useEffect } from "react";
import { SidebarUser } from "../components/sidebar_user_component";
import { Container, Row, Col, Image, Form } from "react-bootstrap";
import styled from "styled-components";
import "../css/user_page_style.css"

const MainContent = styled.div`
  padding: 20px;
  transition: margin-left 0.3s ease-in-out;
  @media (min-width: 768px) {
    margin-left: ${({ isOpen }) => (isOpen ? "280px" : "25px")};
  }
  @media (max-width: 767px) {
    margin-left: ${({ isOpen }) => (isOpen ? "0" : "0")};
    margin-top: ${({ isOpen }) => (isOpen ? "25px" : "25px")};
  }
`;

export function UserProfile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

    console.log(sessionStorage.getItem("user_foto"));

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
        <MainContent isOpen={isSidebarOpen} className="mainContent-user">
          <Row>
            <Col>
              {userData ? (
                <>
                  {/**{userData.foto}
                   * {userData.correo || "email"}
                   * {userData.nombre || "nombre"}
                   * {userData.apellido || "apellido"}
                   */}
                  <Container fluid >
                    <Row>
                      <h1 className="text-center">Profile information</h1>
                      <Col
                      className="col-izq-user"

                      >
                        <Image
                          src={"/pruebas/avatar.webp"}
                          style={{ width: "250px" }}
                          roundedCircle
                        />
                      </Col>
                      <Col
                      className="col-der-user"
                      >
                        <Form.Label column sm="2">
                          Email
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={userData.correo || "email"}
                          aria-label="Disabled input example"
                          disabled
                          readOnly
                        />
                        <Form.Label column sm="4" style={{ marginTop: "15px" }}>
                          First name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={userData.nombre || "nombre"}
                          aria-label="Disabled input example"
                          disabled
                          readOnly
                        />
                        <Form.Label column sm="4" style={{ marginTop: "15px" }}>
                          Last name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={userData.apellido || "apellido"}
                          aria-label="Disabled input example"
                          disabled
                          readOnly
                        />
                      </Col>
                    </Row>
                  </Container>
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
