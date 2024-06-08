import React from "react";
import "../css/event_page_style.css";

export function CardEvent({ title, date, location, category, imageUrl, price }) {
  // Truncar el título a 50 caracteres si es necesario
  const truncatedTitle = title.length > 50 ? title.substring(0, 50) + "..." : title;

  return (
    <div className="card-event">
      <img className="img-event" src={imageUrl} alt={title} />
      <div className="content-event">
      <h6 className="event-title">{truncatedTitle}</h6>
        <div className="info-event">
          <span>{date}</span>
          <span>|</span>
          <span>{location}</span>
        </div>
        <span>Categoria: {category}</span><br/>
        <div className="price-event">${price}</div>
      </div>
    </div>
  );
}
