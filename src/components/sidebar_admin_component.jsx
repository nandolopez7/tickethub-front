import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

export function SidebarAdmin({ onToggle, isOpen }) {
  const [activeItem, setActiveItem] = useState("admin");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Obtener la ruta actual y establecer el activeItem en consecuencia
    const pathname = location.pathname;
    if (pathname === "/admin") {
      setActiveItem("admin");
    } else if (pathname === "/add-event") {
      setActiveItem("add");
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
            active={activeItem === "admin"}
            onClick={() => handleItemClick("admin", "/admin")}
          >
            Verify identity
          </MenuItem>
          <MenuItem
            active={activeItem === "add"}
            onClick={() => handleItemClick("add", "/add-event")}
          >
            Add Event
          </MenuItem>
          <MenuItem
            active={activeItem === "signout"}
            onClick={() => handleItemClick("signout", "/sign-in")}
          >
            Sign Out
          </MenuItem>
        </Menu>
      </SidebarContainer>
    </>
  );
}
