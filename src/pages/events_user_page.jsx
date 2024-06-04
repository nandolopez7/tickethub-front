import React, { useState } from "react";
import { SidebarUser } from "../components/sidebar_user_component";
import { Container, Row } from "react-bootstrap";
import styled from "styled-components";

const MainContent = styled.div`
  margin-left: ${({ isOpen }) => (isOpen ? "280px" : "25px")};
  transition: margin-left 0.3s ease-in-out;
  padding: 20px;
`;

export function UserEvent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Container fluid>
        <SidebarUser isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
        <MainContent isOpen={isSidebarOpen}>
          <Row>
            <h1>Compra</h1>
          </Row>
        </MainContent>
      </Container>
    </>
  );
}
