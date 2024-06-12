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
const API_KEY = process.env.REACT_APP_API_KEY;

export function ChatBot() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
    /* const findEventByName = (eventName) => {
      return eventsback.find(
        (event) => event.name.toLowerCase() === eventName.toLowerCase()
      );
    }; */

    const stringSimilarity = require('string-similarity'); // Importar la librería de similitud de cadenas

    const findEventByName = (eventName) => {
      // Convertir todos los nombres de eventos a minúsculas para hacer la comparación más consistente
      const eventNames = eventsback.map(event => event.name.toLowerCase());

      // Obtener la lista de similitud entre el nombre proporcionado y los nombres de eventos
      const matches = stringSimilarity.findBestMatch(eventName.toLowerCase(), eventNames);

      // Verificar si hay coincidencias por encima de un cierto umbral de similitud
      const bestMatch = matches.bestMatch;
      if (bestMatch.rating >= 0.6) { // Umbral de similitud del 60%
        // Devolver el evento correspondiente al mejor resultado de coincidencia
        const matchedEventIndex = eventNames.findIndex(name => name === bestMatch.target.toLowerCase());
        return eventsback[matchedEventIndex];
      } else {
        return null; // No se encontraron eventos similares por encima del umbral de similitud
      }
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


    
    if (message.toLowerCase().includes("evento") && message.toLowerCase().includes("boletas")) {
      const regex = /evento:\s*(.*),\s*boletas:\s*(\d+)/i;
      const match = message.match(regex);

      if (match) {
        // El nombre del evento está en el grupo 1 y el número de boletas está en el grupo 2
        const eventName = match[1];
        const numTickets = parseInt(match[2]);

        // Verificar si se obtuvieron tanto el nombre del evento como el número de boletas
        if (eventName && !isNaN(numTickets)) {
          const event = findEventByName(eventName);

          if (event){
            const total = calculateTotal(event.price, numTickets); 
            const response = `El precio total por ${numTickets} boletas para el evento "${eventName}" es: ${total}, ya que cada boleta cuesta "${event.price}", ¿Deseas algo más? `;
            const botMessage = {
              message: response,
              sender: "ChatGPT",
              direction: "incoming",
            };
            setMessages([...messages, botMessage]);
            return; // Salir de la función después de manejar este caso

          } else {
           
            const response = `No se encontró ningun evento, proporciona otra vez tu solicitud`;
            const botMessage = {
              message: response,
              sender: "ChatGPT",
              direction: "incoming",
            };
            setMessages([...messages, botMessage]);
            return; // Salir de la función después de manejar este caso
          }
      
      } else {

        const response = `El formato del mensaje es incorrecto. Por favor, asegúrate de incluir tanto el nombre del evento como la cantidad de boletas.`;
        const botMessage = {
          message: response,
          sender: "ChatGPT",
          direction: "incoming",
        };
        setMessages([...messages, botMessage]);
        return; // Salir de la función después de manejar este caso

      }
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
      content: ` Eres un experto en moda, eventos y entretenimiento. Tu objetivo es proporcionar información precisa y útil sobre asistencia a eventos, outfits, recomendaciones de vestimenta, itinerarios para eventos, y cualquier otra consulta relacionada con eventos y entretenimiento. Tu espectro de respuestas es muy amplio.
    Cuando recibas el nombre del usuario, sigue estos pasos:
    
    Dale la bienvenida al usuario mencionando su nombre y expresando que es un gusto tenerlo ahí.
    Proporciónale las instrucciones necesarias para obtener información específica, como sigue:

    Si tu consulta es para saber información sobre un determinado evento, marca 1. 
    
    Si tu consulta es para realizar la cotización de un evento, marca 2
    
    Si tu consulta es referente a la vestimenta y acciones de algun evento general, marca 3 
    
    Si tu solicitud es porque deseas asesoramiento porque deseas diseñar tu propio evento, marca 4
      
    Si tu consulta no se encuentra en estas áreas, contactatate directamente con soporte a esta dirección: http:localhost_3000. 

    Debe enviar un número, ya sea 1,2,3, o 4, si no envia esto, entonces decirle que no se puede proceder con la solicitud, que indique el número correspondiente a su solicitud.

    Si la respuesta es 1,  indicarle que por favor, proporcione el nombre del evento del que desea obtener información con la siguiente estructura: evento: nombre_evento.

    Si la respuesta es 2,  indicarle que por favor, proporcione el nombre del evento del que desea obtener la cotixación y la cantidad de boletas a comprar, indicar el mensaje como: evento: nombre_evento y boletas: num_boletas, si mo sigue esa estructura indicarle que no es posible ayudarle porque no cumple con los requisitos para realizar la consulta.

    Si la respuesta es 3, entonces le preguntarás cual es su consulta, de acuerdo a eso, te convertirás en in experto en moda y vestimenta, además de estar al tanto de todos los tipos de eventos, también se debe conocer artistas e influyentes de estos eventos reconocidos, podrás ser un asesor de imagém
    Si un usuario pregunta sobre qué tipo de eventos es mejor, o qué tipo de ropa usar para un evento o una situación específica, debes proporcionar retroalimentación detallada. Actúa como un asesor de imagen y eventos, brindando recomendaciones personalizadas y consejos sobre la mejor elección de eventos y outfits de acuerdo a la situación o al tipo de evento.

    Si la respuesta es 4. entonces serás un experto en la organización de eventos. Puedes responder preguntas sobre cómo resaltar un evento, mejorar el marketing de un evento, los pasos para hacer un evento exitoso, y cualquier otra consulta referente a la organización y creación de eventos.
    
    Tu función es ser lo más útil y amigable posible para mejorar la experiencia del usuario en Tickethub. 
    Cada vez que termine de brindar su indicación preguntarle si desea realizar otra consulta. 
    `,
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
        size="xl"
      >
        <Modal.Header
          style={{
            background: "linear-gradient(to right, #6366F1, #9333EA)",
            color: "white",
          }}
        >
          <Modal.Title>
            Condiciones de Uso del Chatbot de TicketHub:
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            textAlign: "justify",
          }}
        >
          Bienvenido a TicketHub. Estos Términos y Condiciones de Uso
          ("Términos") regulan el uso del chatbot ("Chatbot") disponible en
          nuestra aplicación, que ofrece asesoramiento sobre eventos. Al
          interactuar con el Chatbot, usted acepta cumplir con estos Términos.
          Si no está de acuerdo con estos Términos, por favor, no utilice el
          Chatbot. <br />
          <b>1. Descripción del Servicio:</b> El Chatbot de TicketHub está
          diseñado para proporcionar información y asesoramiento sobre eventos,
          incluyendo detalles sobre eventos futuros, recomendaciones basadas en
          preferencias del usuario, y asistencia con la compra de entradas. El
          Chatbot no ofrece asesoramiento financiero, legal ni de cualquier otro
          tipo profesional.
          <br />
          <b>2. Uso del Chatbot </b>
          <ul>
            <li>
              <b>2.1 Elegibilidad:</b> El uso del Chatbot está permitido
              únicamente a usuarios mayores de 18 años. Al utilizar el Chatbot,
              usted declara y garantiza que cumple con este requisito.
            </li>
            <li>
              <b>2.2 Cuenta de Usuario:</b> Para utilizar algunas funciones del
              Chatbot, es posible que deba crear una cuenta en TicketHub. Usted
              es responsable de mantener la confidencialidad de su cuenta y
              contraseña, y acepta notificar a TicketHub inmediatamente sobre
              cualquier uso no autorizado de su cuenta.
            </li>
            <li>
              <b>2.3 Conducta del Usuario:</b> Al utilizar el Chatbot, usted se
              compromete a: No utilizar el Chatbot para ningún propósito ilegal
              o no autorizado. No interferir ni interrumpir el funcionamiento
              del Chatbot. No transmitir ningún contenido que sea ilegal,
              ofensivo, difamatorio, o que infrinja los derechos de terceros.
            </li>
          </ul>
          <b>3. Limitación de Responsabilidad</b>
          <ul>
            <li>
              <b>3.1 Información del Chatbot:</b> El Chatbot proporciona
              información basada en datos disponibles y algoritmos de
              recomendación. Aunque TicketHub se esfuerza por garantizar la
              precisión de la información, no garantiza que toda la información
              proporcionada por el Chatbot sea completa, precisa o actualizada.
            </li>
            <li>
              <b>3.2 Limitación de Daños:</b> En ningún caso TicketHub será
              responsable por cualquier daño indirecto, incidental, especial,
              consecuente o punitivo, incluyendo pero no limitado a, pérdida de
              beneficios, datos, uso, fondo de comercio, o otras pérdidas
              intangibles resultantes del uso o la imposibilidad de uso del
              Chatbot.
            </li>
          </ul>
          <b>4. Modificaciones de los Términos:</b> TicketHub se reserva el
          derecho de modificar estos Términos en cualquier momento. Cualquier
          cambio será efectivo inmediatamente después de la publicación de los
          Términos revisados en nuestra aplicación. El uso continuado del
          Chatbot después de dichos cambios constituirá su aceptación de los
          nuevos Términos. <br />
          <b>5. Terminación: </b> TicketHub puede, a su discreción, suspender o
          terminar su acceso al Chatbot en cualquier momento, con o sin causa, y
          sin previo aviso. <br />
          <b>6. Privacidad:</b> El uso del Chatbot está sujeto a la Política de
          Privacidad de TicketHub, que describe cómo recopilamos, utilizamos y
          compartimos su información personal.
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: "#6366F1",
              color: "#fff",
              border: "none",
            }}
            onClick={handleClose}
          >
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
