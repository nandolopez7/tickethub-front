import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  return (
<footer style={footerStyle}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center" }}>
      <FontAwesomeIcon
        icon={faTicket}
        style={{ color: "#000000", marginRight: "0.5em", verticalAlign: "middle" }}
        size="xl"
      />
      <h5 style={{ margin: "0" }}>TicketHub</h5>
    </div>
    <p style={{ margin: "0" }}>&copy; 2024 TicketHub. All rights reserved.</p>
  </div>
</footer>
  );
}

const footerStyle = {
  backgroundColor: "#333",
  color: "#fff",
  textAlign: "center",
  padding: "1rem",
};

export default Footer;
