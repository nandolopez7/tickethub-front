import React, { useState, useEffect, useRef } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import '../App.css';

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const API_KEY = "x";

export function ChatBot() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hola, bienvenido a Tickethub chatbot, ¿me podrias dar tu nombre?",
      sender: "ChatGPT",
    },
  ]);

  const [visibleEvents, setVisibleEvents] = useState([]);
  const [eventsback, setEvents] = useState([]);
  const URL_BACKEND = "http://127.0.0.1:8000";

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


/*   const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Función para buscar un evento por nombre en la lista de eventos
    const findEventByName = (eventName) => {
      const lowerCaseEventName = eventName.toLowerCase(); // Convertir el nombre del evento proporcionado a minúsculas
      eventsback.forEach((event) => {
        const lowerCaseEvent = event.name.toLowerCase(); // Convertir el nombre del evento actual a minúsculas
        if (lowerCaseEvent === lowerCaseEventName) {
          console.log("Se encontró un evento con el nombre:", event.name);
          // Aquí puedes devolver el evento o realizar alguna acción adicional
        }
      });
      
      return eventsback.find((event) => event.name.toLowerCase() === eventName.toLowerCase());
    };

    // Función para calcular el total de boletas
    const calculateTotal = (price, quantity) => {
      return price * quantity;
    };

    // Procesar el mensaje del usuario
        if (message.toLowerCase().startsWith("precio")) {
      // Si el mensaje del usuario indica que quiere calcular el precio total de las boletas
      const parts = message.toLowerCase().split(" ");
      const price = parseFloat(parts[1]);
      const quantity = parseFloat(parts[2]);
      if (!isNaN(price) && !isNaN(quantity)) {
        const total = calculateTotal(price, quantity);
        const response = `El precio total por ${quantity} boletas es: ${total}`;
        const botMessage = {
          message: response,
          sender: "bot",
          direction: "incoming",
        };
        setMessages([...newMessages, botMessage]); 

    if (message.toLowerCase().startsWith("precio")) {
      // Si el mensaje del usuario indica que quiere calcular el precio total de las boletas
      const parts = message.toLowerCase().split(" ");
      const price = parseFloat(parts[1]);
      const quantity = parseFloat(parts[2]);
      if (!isNaN(price) && !isNaN(quantity)) {
        const total = calculateTotal(price, quantity);
        const response = `El precio total por ${quantity} boletas es: ${total}`;
        const botMessage = {
          message: response,
          sender: "bot",
          direction: "incoming",
        };
        setMessages([...newMessages, botMessage]);
      } else {
        // Si el usuario no proporciona números válidos para el cálculo
        const response = "Por favor, proporciona números válidos para el cálculo del precio total.";
        const botMessage = {
          message: response,
          sender: "bot",
          direction: "incoming",
        };
        setMessages([...newMessages, botMessage]);
      }
    } else if (message.toLowerCase().startsWith("evento")){
      // Si el mensaje del usuario no es una solicitud de cálculo de precio, buscar el evento por nombre
      const event = findEventByName(message);
      if (event) {
        // Si se encuentra el evento, construir la respuesta con detalles del evento
        const response = `Te puedo proporcionar información sobre el evento "${event.name}". Este evento está programado para el ${event.description} en ${event.place}. Su precio es: ${event.price}`;
        const botMessage = {
          message: response,
          sender: "bot",
          direction: "incoming",
        };
        setMessages([...newMessages, botMessage]);
      } else {
        // Si no se encuentra el evento, responder que no se encontró información
        const response = `Lo siento, no encontré información sobre el evento "${message}".`;
        const botMessage = {
          message: response,
          sender: "bot",
          direction: "incoming",
        };
        setMessages([...newMessages, botMessage]);
      }
    } */


  const handleSend = async (message) => {

    const findEventByName = (eventName) => {
      return eventsback.find((event) => event.name.toLowerCase() === eventName.toLowerCase());
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
            sender: "bot",
            direction: "incoming",
          };
          setMessages([...messages, botMessage]);
          return; // Salir de la función después de manejar este caso
        } else {
          const response = "La cantidad de boletas no es un número válido.";
          const botMessage = {
            message: response,
            sender: "bot",
            direction: "incoming",
          };
          setMessages([...messages, botMessage]);
          return; // Salir de la función después de manejar este caso
        }
      } else {
        const response = `No se encontró ningún evento con el nombre "${eventName}".`;
        const botMessage = {
          message: response,
          sender: "bot",
          direction: "incoming",
        };
        setMessages([...messages, botMessage]);
        return; // Salir de la función después de manejar este caso
      } 
    }

    if (message.toLowerCase().startsWith("evento")){
      var eventName = " "
      // Si el mensaje del usuario no es una solicitud de cálculo de precio, buscar el evento por nombre
      const parts = message.toLowerCase().split(":"); // Dividir el mensaje por ":"
      if (parts.length === 2) { // Verificar si se dividieron en dos partes
        const command = parts[0].trim(); // Obtener el comando sin espacios adicionales
        eventName = parts[1].trim(); // Obtener el nombre del evento sin espacios adicionales
        if (command === "evento") { // Verificar si el comando es "evento"
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
          sender: "bot",
          direction: "incoming",
        };
        setMessages([...newMessages, botMessage]);
      } else {
        // Si no se encuentra el evento, responder que no se encontró información
        const response = `Lo siento, no encontré información sobre el evento "${message}".`;
        const botMessage = {
          message: response,
          sender: "bot",
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
      content: `Eres un experto en moda, eventos y entretenimiento.
      Si te hacen preguntas en otros campos, dirás que no tienes conocimiento sobre eso y que no es tu área, pero que estás aquí para responder cualquier pregunta relacionada con moda, eventos y entretenimiento.
     después de recibir el nombre del usuario, vas a decir las siguientes cosas, dile que es un gusto tenerlo ahí, que si desea conocer información sobre un evento debe escribir "evento: proporcionar el nombre del evento, y si quiere saber el precio de un evento debe seguir la siguiente
      estructura en su mensaje "precio del evento: nombre del evento boletas num boletas`,
    };
  
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...apiMessages,
      ],
    };
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody),
      });
    
      const data = await response.json();
    
      if (
        data.choices &&
        data.choices.length > 0 &&
        data.choices[0].message
      ) {
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
                <TypingIndicator content="Tickethub está escribiendo" />
                ) : null
            }
            >
            {messages.map((message, i) => {
                return (
                <Message
                    key={i}
                    model={message}
                    className={message.sender === "ChatGPT" ? "chat-gpt-message" : ""}
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

      <Button
        style={{ width: "20rem", marginTop: "1em" }}
        variant="outline-primary"
        size="lg"
        onClick={generatePDF}
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
            Condiciones de Uso del Chatbot:
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            textAlign: "justify",
          }}
        >
          Bienvenido/a al Chatbot de Tickethub. Antes de utilizar nuestros
          servicios, te pedimos que leas detenidamente las siguientes
          condiciones.
          <br />
          Al acceder y utilizar este chatbot, aceptas cumplir con los términos
          establecidos a continuación:
          <br />
          <b>Propósito Informativo:</b> El chatbot de eventos proporciona
          información general sobre temas relacionados a eventos y entretenimiento.
          La información proporcionada no es un asesor.
          <br />
          <b>Variedad de Usuarios:</b> Reconocemos que cada persona es única, y
          la información proporcionada por el chatbot puede no ser aplicable a
          todas las situaciones o a cada individuo. La orientación ofrecida se
          basa en datos generales y no tiene en cuenta circunstancias personales
          específicas.
          <br />
          <b>Limitaciones Tecnológicas:</b> El chatbot utiliza inteligencia
          artificial para proporcionar respuestas, y aunque se esfuerza por
          ofrecer información precisa y actualizada, puede haber limitaciones en
          su capacidad para comprender situaciones complejas o proporcionar
          respuestas específicas en todos los casos.
          <br />
          <b>Responsabilidad del Usuario:</b> El usuario asume la
          responsabilidad de cualquier acción que realice como resultado de la
          información proporcionada por el chatbot. Ni el chatbot ni sus
          creadores serán responsables de cualquier consecuencia derivada de las
          decisiones tomadas basándose en la información proporcionada.
          <br />
          Al utilizar este chatbot, aceptas estas condiciones de uso. ¡Gracias por utilizar nuestro Chatbot!
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
