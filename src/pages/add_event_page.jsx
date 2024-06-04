import React, { useState } from "react";
import { SidebarAdmin } from "../components/sidebar_admin_component";
import { Container, Row } from "react-bootstrap";
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

export function AddEvent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Container fluid>
        <SidebarAdmin isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
        <MainContent isOpen={isSidebarOpen}>
          <Row>
            <h1>Add</h1>
          </Row>
        </MainContent>
      </Container>
    </>
  );
}
