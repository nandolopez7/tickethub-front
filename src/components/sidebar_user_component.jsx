import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {Button, Modal} from 'react-bootstrap';
import styled from "styled-components";
import { FiMenu, FiX } from "react-icons/fi";

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? "0" : "-300px")};
  height: 100%;
  width: 300px;
  background: linear-gradient(to right, #6366f1, #9333ea);
  transition: left 0.3s ease-in-out;
  z-index: 1000;
`;

const SidebarToggle = styled.div`
  position: fixed;
  top: 15px;
  left: ${({ isOpen }) => (isOpen ? "315px" : "15px")};
  z-index: 1100;
  cursor: pointer;
  transition: left 0.3s ease-in-out;

  @media (min-width: 768px) {
    left: ${({ isOpen }) => (isOpen ? "265px" : "15px")};
  }
`;

const Menu = styled.ul`
  list-style: none;
  padding: 20px;
  margin: 0;
`;

const MenuItem = styled.li`
  margin-left: 15px;
  margin: 20px;
  padding: 15px 20px;
  color: ${({ active }) => (active ? "#000" : "#fff")};
  background: ${({ active }) => (active ? "#fff" : "transparent")};
  cursor: pointer;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background: #fff;
    color: #000;
  }
`;

export function SidebarUser({ onToggle, isOpen }) {
  const [modalShowSignOut, setModalShowSignOut] = useState(false);
  const [activeItem, setActiveItem] = useState("profile");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Obtener la ruta actual y establecer el activeItem en consecuencia
    const pathname = location.pathname;
    if (pathname === "/user") {
      setActiveItem("profile");
    } else if (pathname === "/buy-event") {
      setActiveItem("events");
    } else {
      setActiveItem(null); // Aquí puedes manejar otros casos si es necesario
    }
  }, [location.pathname]);

  const handleToggle = () => {
    onToggle(!isOpen);
  };

  const handleItemClick = (item, route) => {
    setActiveItem(item);
    navigate(route);
  };

  const handleShowModalSignOut = () => {
    setModalShowSignOut(true);
  }
  const handleCloseModalSignOut = () => {
    setModalShowSignOut(false);
  }

  const handleConfirmSignOut = () => {
    setActiveItem("signout");
    navigate("/sign-in");
    setModalShowSignOut(false);
  };

  return (
    <>
      <SidebarToggle onClick={handleToggle} isOpen={isOpen}>
        {isOpen ? (
          <FiX size={30} color="#000" />
        ) : (
          <FiMenu size={30} color="#000" />
        )}
      </SidebarToggle>
      <SidebarContainer isOpen={isOpen}>
        <Menu>
          <MenuItem
            active={activeItem === "profile"}
            onClick={() => handleItemClick("profile", "/user")}
          >
            Profile
          </MenuItem>
          <MenuItem
            active={activeItem === "events"}
            onClick={() => handleItemClick("events", "/buy-event")}
          >
            Events
          </MenuItem>
          <MenuItem
            active={activeItem === "myevents"}
            onClick={() => handleItemClick("myevents", "/myevents")}
          >
            Your events
          </MenuItem>
          <MenuItem
            active={activeItem === "chat"}
            onClick={() => handleItemClick("chat", "/chat")}
          >
            TicketChat
          </MenuItem>
          <MenuItem
            active={activeItem === "signout"}
            onClick={handleShowModalSignOut}
          >
            Sign Out
          </MenuItem>
        </Menu>
      </SidebarContainer>

      <Modal
        show={modalShowSignOut}
        onHide={handleCloseModalSignOut}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton style={{ background: "linear-gradient(to right, #6366F1, #9333EA)", color:"white"}}>
          <Modal.Title id="contained-modal-title-vcenter">
            Sign out
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you sure you want to leave?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleCloseModalSignOut}>
            Close
          </Button>
          <Button variant="outline-success" onClick={handleConfirmSignOut}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
