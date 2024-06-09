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

/* Aqu va la API KEY */

export function ChatBot() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hola, bienvenido a NutriChat, ¿me podrias dar tu nombre?",
      sender: "ChatGPT",
    },
  ]);

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
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage]; //Old messages + new messages

    //Update messahes state
    setMessages(newMessages);

    //Set a typing indicator from ChatGPT
    setTyping(true);
    //Process message to chatGPT
    await processMessageToChatGPT(newMessages);
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

    // role: "user" -> message from user
    // role: "assistan" -> message from ChatGPT
    // role: "system" -> initial message defining HOW chat will talk

    const systemMessage = {
      role: "system",
      content: `Eres un nutriologo experto, y solo puedes responder preguntas de esa area (preguntas fuera de este 
         tema debes decir que no estas relacionado a ellos), después de recibir el nombre del usuario, vas 
         a preguntar las siguientes cosas y esperar a que te responda pregunta por pregunta. Las preguntas son: 
         ¿Cual es tu edad?, ¿Cual es tu peso actual?, ¿Cual es tu altura?, ¿Cual es tu sexo?, 
         ¿Que tipo de actividad fisica realizas, si realizas?, 
         con base a esas respuestas vas a calcular el imc y brindarle al usuario un plan alimenticio con base a 
         para que quiere el plan, también debes considerar alergias a medicamentos y alimentos, 
         y si sufre de alguna condicion médica crónica, además, considerar sus preferencias alimenticias como si es vegano, 
         vegetariano u omnívoro, intolerante a la lactosa y otra información que consideres necesaria, para que 
         le brindes mejores recomendaciones al usuario que se alineen con sus elecciones dietéticas.
         
         Para afinar el plan aplimentecio que proporcionarás al usuario, debes tener en cuenta la región o
         lugar en el que vive el usuario. Así podras recomendarle alimentos que si esten a su alcance.

         Recuerda al final, generar el plan alimenticio detallado.

         Dado que las respuestas las das en una aplicación wed desarrollada en React, cuando te soliciten una tabla 
         que contenga información requerida por el usuario, o cuando genres el plan alimenticio, debes generarlo con HTML 
         para que se vea bonita y sea clara para el usuario. En general, para acentos, negrillas, etc, debes usar formato para HTML.
         
         Recuerda ser siempre amigable y tambien hacer chistes de vez en cuando para hacer más amena la conversación.

         Una vez hayas generado el plan nutricional, debes recordarle al usuario que puede dar click al boton de abajo para descargar el chat como pdf y guardar el plan que le acabas de dar.
         `,
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...apiMessages, //[message1, message2, message3...]
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);

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
      })
      .catch((error) => {
        console.error("Error al procesar la respuesta de la API:", error);
      });
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
                <TypingIndicator content="NutriChat está escribiendo" />
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
