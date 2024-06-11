import React, { useState, useEffect, useRef } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { SidebarUser } from "../components/sidebar_user_component";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { Container, Button, Modal } from "react-bootstrap";
import "../App.css";
import "../css/chat_style.css";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
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

/* Aqu va la API KEY */
const API_KEY = process.env.CHAT_API;

export function ChatBot() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message:
        "Hola, bienvenido a Tickethub chatbot, ¿me podrias dar tu nombre?",
      sender: "ChatGPT",
    },
  ]);
  // eslint-disable-next-line
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [eventsback, setEvents] = useState([]);
  const URL_BACKEND = "http://127.0.0.1:8000";

  const handlePrint = () => {
    window.print();
  };
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${URL_BACKEND}/events/`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
          setVisibleEvents(data);
        } else {
          console.error("Failed:", response.statusText);
          // Maneja los errores aquí
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    console.log(eventsback);
    console.log(API_KEY);
  }, [eventsback]);

  const chatRef = useRef(); // Agrega esta línea para referenciar el contenedor del chat

  const generatePDF = async () => {
    // Referencia al contenedor del chat
    const originalHeight = chatRef.current.style.height;
    const originalOverflow = chatRef.current.style.overflow;

    // Ajustar estilos para captura
    chatRef.current.style.height = "auto";
    chatRef.current.style.overflow = "visible";

    await html2canvas(chatRef.current, { scrollY: -window.scrollY }).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();

        // Asegúrate de que la imagen se ajuste al ancho de la página
        const imgWidth = 190; // Ancho de la imagen en mm
        const pageHeight = 290; // Alto de la página en mm
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Bucle para agregar nuevas páginas si es necesario
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("chat.pdf");
      }
    );

    // Restaurar estilos
    chatRef.current.style.height = originalHeight;
    chatRef.current.style.overflow = originalOverflow;
  };


  useEffect(() => {
    // Mostrar el modal al cargar la página
    handleShow();
  }, []);


  const handleSend = async (message) => {
    const findEventByName = (eventName) => {
      return eventsback.find(
        (event) => event.name.toLowerCase() === eventName.toLowerCase()
      );
    };

    // Función para calcular el total de boletas
    const calculateTotal = (price, quantity) => {
      return price * quantity;
    };

    // Si no es un mensaje sobre el precio, procesar como mensaje normal
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage]; //Old messages + new messages

    //Update messages state
    setMessages(newMessages);

    //Set a typing indicator from ChatGPT
    setTyping(true);
    //Process message to chatGPT
    await processMessageToChatGPT(newMessages);

    if (message.toLowerCase().startsWith("precio del evento")) {
      const parts = message.toLowerCase().split("boletas");
      const eventName = parts[0].substring(18).trim(); // Obtener el nombre del evento eliminando "precio del evento" y espacios adicionales // Unir todas las partes restantes para obtener el nombre completo del evento
      const event = findEventByName(eventName); // Buscar el evento por su nombre

      if (event) {
        const quantity = parseFloat(parts[parts.length - 1]); // Obtener la cantidad de boletas del último elemento de "parts"
        if (!isNaN(quantity)) {
          const total = calculateTotal(event.price, quantity); // Calcular el precio total multiplicando el precio del evento por la cantidad de boletas
          const response = `El precio total por ${quantity} boletas para el evento "${eventName}" es: ${total}, ya que cada boleta cuesta "${event.price}" `;
          const botMessage = {
            message: response,
            sender: "ChatGPT",
            direction: "incoming",
          };
          setMessages([...messages, botMessage]);
          return; // Salir de la función después de manejar este caso
        } else {
          const response = "La cantidad de boletas no es un número válido.";
          const botMessage = {
            message: response,
            sender: "ChatGPT",
            direction: "incoming",
          };
          setMessages([...messages, botMessage]);
          return; // Salir de la función después de manejar este caso
        }
      } else {
        const response = `No se encontró ningún evento con el nombre "${eventName}".`;
        const botMessage = {
          message: response,
          sender: "ChatGPT",
          direction: "incoming",
        };
        setMessages([...messages, botMessage]);
        return; // Salir de la función después de manejar este caso
      }
    }

    if (message.toLowerCase().startsWith("evento")) {
      var eventName = " ";
      // Si el mensaje del usuario no es una solicitud de cálculo de precio, buscar el evento por nombre
      const parts = message.toLowerCase().split(":"); // Dividir el mensaje por ":"
      if (parts.length === 2) {
        // Verificar si se dividieron en dos partes
        const command = parts[0].trim(); // Obtener el comando sin espacios adicionales
        eventName = parts[1].trim(); // Obtener el nombre del evento sin espacios adicionales
        if (command === "evento") {
          // Verificar si el comando es "evento"
          console.log("Nombre del evento:", eventName);
          // Aquí puedes hacer lo que necesites con el nombre del evento
        } else {
          console.log("Comando inválido:", command);
        }
      } else {
        console.log("Formato de mensaje incorrecto");
      }

      const event = findEventByName(eventName);
      if (event) {
        // Si se encuentra el evento, construir la respuesta con detalles del evento
        const response = `Te puedo proporcionar información sobre el evento "${event.name}". Este evento está programado para el ${event.description} en ${event.place}. Su precio es: ${event.price}`;
        const botMessage = {
          message: response,
          sender: "ChatGPT",
          direction: "incoming",
        };
        setMessages([...newMessages, botMessage]);
      } else {
        // Si no se encuentra el evento, responder que no se encontró información
        const response = `Lo siento, no encontré información sobre el evento "${message}".`;
        const botMessage = {
          message: response,
          sender: "ChatGPT",
          direction: "incoming",
        };
        setMessages([...newMessages, botMessage]);
      }
    }
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system",
      content: `Eres un experto en moda, eventos y entretenimiento. Puedes responder cualquier pregunta sobre asistenci a un evento, sobre outfits, recomendaciones de ropa, itinerarios para un evento, etc, tu espectro de respuestas es muy amplio.
  
     después de recibir el nombre del usuario, vas a decir las siguientes cosas, dile que es un gusto tenerlo ahí, que si desea conocer información sobre un evento debe escribir "evento: proporcionar el nombre del evento, y si quiere saber el precio de un evento debe seguir la siguiente
      estructura en su mensaje "precio del evento: nombre del evento boletas num boletas`,
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestBody),
        }
      );

      const data = await response.json();

      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        const chatGPTMessage = data.choices[0].message.content;

        if (chatGPTMessage) {
          setMessages([
            ...chatMessages,
            {
              message: chatGPTMessage,
              sender: "ChatGPT",
            },
          ]);
        } else {
          console.error("El contenido del mensaje de ChatGPT es undefined.");
        }
      } else {
        console.error(
          "La estructura de la respuesta de la API no es la esperada:",
          data
        );
      }

      setTyping(false);
    } catch (error) {
      console.error("Error al procesar la respuesta de la API:", error);
    }
  }

  return (
    <>
      <Container fluid>
        <SidebarUser isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
        <MainContent isOpen={isSidebarOpen}>
        <div
            style={{
              position: "relative",
              margin: "0 auto",
              marginTop: "1em",
              maxWidth: "100%",
              height: "700px",
              width: "70vw", // Porcentaje del ancho de la ventana
              overflowX: "hidden", // Para evitar que el contenido se desborde en pantallas pequeñas
            }}
            ref={chatRef}
          >
            <MainContainer
              style={{
                borderRadius: "10px",
              }}
            >
              <ChatContainer>
                <MessageList
                  typingIndicator={
                    typing ? (
                      <TypingIndicator content="TicketChat está escribiendo" />
                    ) : null
                  }
                  scrollBehavior="smooth"
                  ref={chatRef}
                >
                  {messages.map((message, i) => {
                    const isChatGPT = message.sender === "ChatGPT";
                    const messageClass = isChatGPT
                      ? "cs-message--incoming"
                      : "cs-message--outgoing";
                    return (
                      <Message
                        key={i}
                        model={{
                          message: message.message,
                          sentTime: "just now",
                          sender: message.sender,
                          direction: isChatGPT ? "incoming" : "outgoing",
                          className: messageClass,
                        }}
                      />
                    );
                  })}
                </MessageList>

                <MessageInput
                  placeholder="Escribe tu mensaje aquí"
                  onSend={handleSend}
                />
              </ChatContainer>
            </MainContainer>
          </div>
        </MainContent>
      </Container>

      <Button
        style={{ width: "20rem", marginTop: "1em" }}
        variant="outline-primary"
        size="lg"
        onClick={handlePrint}
      >
        Descargar Chat como PDF
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title>
            Condiciones de Uso del Chatbot de Nutrición:
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            textAlign: "justify",
          }}
        >
          Bienvenido/a al Chatbot de Nutrición. Antes de utilizar nuestros
          servicios, te pedimos que leas detenidamente las siguientes
          condiciones.
          <br />
          Al acceder y utilizar este chatbot, aceptas cumplir con los términos
          establecidos a continuación:
          <br />
          <b>Propósito Informativo:</b> El chatbot de nutrición proporciona
          información general sobre temas relacionados con la nutrición y el
          bienestar. La información proporcionada no sustituye el consejo
          profesional individualizado y está destinada únicamente con fines
          informativos.
          <br />
          <b>Variedad de Usuarios:</b> Reconocemos que cada persona es única, y
          la información proporcionada por el chatbot puede no ser aplicable a
          todas las situaciones o a cada individuo. La orientación ofrecida se
          basa en datos generales y no tiene en cuenta circunstancias personales
          específicas.
          <br />
          <b>Consulta Profesional:</b> Se recomienda encarecidamente que
          consultes con un profesional de la salud, como un nutricionista o
          médico, antes de realizar cambios significativos en tu dieta o estilo
          de vida. El chatbot no puede reemplazar la evaluación personalizada de
          un profesional de la salud.
          <br />
          <b>Limitaciones Tecnológicas:</b> El chatbot utiliza inteligencia
          artificial para proporcionar respuestas, y aunque se esfuerza por
          ofrecer información precisa y actualizada, puede haber limitaciones en
          su capacidad para comprender situaciones complejas o proporcionar
          respuestas específicas en todos los casos.
          <br />
          <b>Confidencialidad:</b> La información proporcionada en el chatbot se
          maneja de manera confidencial, según nuestra política de privacidad.
          Sin embargo, ten en cuenta que la seguridad de la información a través
          de internet no puede garantizarse al 100%.
          <br />
          <b>Responsabilidad del Usuario:</b> El usuario asume la
          responsabilidad de cualquier acción que realice como resultado de la
          información proporcionada por el chatbot. Ni el chatbot ni sus
          creadores serán responsables de cualquier consecuencia derivada de las
          decisiones tomadas basándose en la información proporcionada.
          <br />
          Al utilizar este chatbot, aceptas estas condiciones de uso. Si no
          estás de acuerdo con alguna parte de estas condiciones, te
          recomendamos que no utilices el servicio. Estas condiciones pueden
          actualizarse ocasionalmente, y te recomendamos que las revises
          periódicamente. ¡Gracias por utilizar nuestro Chatbot de Nutrición!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
