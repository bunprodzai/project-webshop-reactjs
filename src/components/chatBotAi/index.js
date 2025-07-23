// import { Widget, addResponseMessage } from 'react-chat-widget';
// import 'react-chat-widget/lib/styles.css';
// import { chatBot } from '../../services/client/chatBotServies';

// export default function ChatBotAi() {

//   const handleNewUserMessage = async (newMessage) => {
//     const res = await chatBot({ message: newMessage });
//     addResponseMessage(res.reply);
//     // console.log(res);
    
//   };

//   return (
//     <>
//       <Widget
//         handleNewUserMessage={handleNewUserMessage}
//         title="Tư vấn thời trang"
//         subtitle="Chat với shop ngay!"
//       />
//     </>
//   );
// }

// import { useState } from "react";
// import {
//   MainContainer,
//   ChatContainer,
//   MessageList,
//   Message,
//   MessageInput,
//   TypingIndicator
// } from "@chatscope/chat-ui-kit-react";
// import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
// import { Button, Drawer } from "antd";
// import { MessageOutlined } from "@ant-design/icons";
// import { chatBot } from '../../services/client/chatBotServies';

// import "./ChatBotAi.scss"; // sẽ tạo file CSS nhỏ để nút nổi đẹp hơn

// export default function ChatBotAi() {
//   const [open, setOpen] = useState(false);             // control drawer
//   const [messages, setMessages] = useState([
//     { message: "Xin chào! Mình có thể giúp gì cho bạn?", direction: "incoming" }
//   ]);
//   const [isTyping, setIsTyping] = useState(false);

//   const handleSend = async (userMessage) => {
//     if (!userMessage.trim()) return;

//     setMessages(prev => [
//       ...prev,
//       { message: userMessage, direction: "outgoing" }
//     ]);

//     setIsTyping(true);
//     try {
//       const res = await chatBot({ message: userMessage });
//       setMessages(prev => [
//         ...prev,
//         { message: res.reply, direction: "incoming" }
//       ]);
//     } catch (error) {
//       setMessages(prev => [
//         ...prev,
//         { message: "Xin lỗi, có lỗi xảy ra.", direction: "incoming" }
//       ]);
//     }
//     setIsTyping(false);
//   };

//   return (
//     <>
//       {/* Floating button */}
//       <Button
//         type="primary"
//         shape="circle"
//         icon={<MessageOutlined />}
//         size="large"
//         className="chatbot-toggle-btn"
//         onClick={() => setOpen(true)}
//       />

//       {/* Drawer chứa Chatbot */}
//       <Drawer
//         title="Tư vấn thời trang"
//         placement="right"
//         width={350}
//         onClose={() => setOpen(false)}
//         open={open}
//       >
//         <div style={{ height: "400px", position: "relative" }}>
//           <MainContainer>
//             <ChatContainer>
//               <MessageList
//                 typingIndicator={isTyping ? <TypingIndicator content="Shop đang trả lời..." /> : null}
//               >
//                 {messages.map((m, i) => (
//                   <Message
//                     key={i}
//                     model={{
//                       message: m.message,
//                       sentTime: "just now",
//                       direction: m.direction
//                     }}
//                   />
//                 ))}
//               </MessageList>
//               <MessageInput placeholder="Nhắn tin cho shop..." onSend={handleSend} attachButton={false} />
//             </ChatContainer>
//           </MainContainer>
//         </div>
//       </Drawer>
//     </>
//   );
// }
