import React from "react";
import "../css/event_page_style.css";

export function CardEvent({ title, date, location, category, imageUrl }) {
  return (
    <div className="card-event">
      <img className="img-event" src={imageUrl} alt={title} />
      <div className="content-event">
        <h2>{title}</h2>
        <div className="info-event">
          <span>{date}</span>
          <span>|</span>
          <span>{location}</span>
        </div>
        <span>Categoria: {category}</span>
      </div>
    </div>
  );
}
