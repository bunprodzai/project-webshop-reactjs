import { useState, useRef, useEffect } from "react"
import { Button, Input, Badge, Avatar, Typography, Space, Spin } from "antd"
import {
  MessageOutlined,
  SendOutlined,
  MinusOutlined,
  CloseOutlined,
  UserOutlined,
  RobotOutlined,
} from "@ant-design/icons"
import { chatBot } from '../../services/client/chatBotServies';
import parse from "html-react-parser"

const { Text } = Typography

const LOCAL_STORAGE_KEY = "chatbot_messages"

const ChatBotAi = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Load tin nhắn từ localStorage khi mở app
  useEffect(() => {
    const storedMessages = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages))
    } else {
      // Nếu chưa có thì set tin nhắn mặc định
      setMessages([
        {
          id: 1,
          text: "Xin chào! Tôi có thể giúp gì cho bạn?",
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    }
  }, [])

  // Lưu tin nhắn vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages))
    }
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
      inputRef.current?.focus();
      scrollToBottom();
    }
  }, [isOpen])

  const addResponseMessage = (reply) => {
    const botResponse = {
      id: Date.now() + 1,
      text: reply,
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, botResponse])
    setIsLoading(false)

    if (!isOpen) {
      setUnreadCount((prev) => prev + 1)
    }
  }

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return

    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    const messageToSend = inputValue
    setInputValue("")
    setIsLoading(true)

    try {
      const res = await chatBot({ message: messageToSend })
      addResponseMessage(res.reply)
    } catch (error) {
      console.error("Error calling chatBot API:", error)
      addResponseMessage("Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Style như code gốc
  const chatButtonStyle = {
    position: "fixed",
    bottom: "100px",
    right: "24px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    zIndex: 9999,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  }

  const chatBoxStyle = {
    position: "fixed",
    bottom: "100px",
    right: "24px",
    width: "380px",
    maxWidth: "calc(100vw - 48px)",
    zIndex: 9999,
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    backgroundColor: "#fff",
  }

  const headerStyle = {
    background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
    color: "white",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    userSelect: "none",
  }

  const messagesContainerStyle = {
    height: "400px",
    overflowY: "auto",
    padding: "16px",
    backgroundColor: "#fafafa",
  }

  const inputContainerStyle = {
    padding: "16px",
    borderTop: "1px solid #f0f0f0",
    backgroundColor: "#fff",
  }

  return (
    <>
      {!isOpen && (
        <Badge count={unreadCount} offset={[-8, 8]}>
          <Button
            type="primary"
            icon={<MessageOutlined />}
            style={chatButtonStyle}
            onClick={() => setIsOpen(true)}
            size="large"
          />
        </Badge>
      )}

      {isOpen && (
        <div style={chatBoxStyle}>
          <div style={headerStyle} onClick={() => setIsMinimized(!isMinimized)}>
            <Space align="center">
              <MessageOutlined />
              <Text style={{ color: "white", fontWeight: 500 }}>Hỗ trợ AI</Text>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#52c41a",
                  borderRadius: "50%",
                  animation: "pulse 2s infinite",
                }}
              />
            </Space>
            <Space>
              <Button
                type="text"
                icon={<MinusOutlined />}
                size="small"
                style={{ color: "white" }}
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMinimized(!isMinimized)
                }}
              />
              <Button
                type="text"
                icon={<CloseOutlined />}
                size="small"
                style={{ color: "white" }}
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(false)
                  setIsMinimized(false)
                }}
              />
            </Space>
          </div>

          {!isMinimized && (
            <>
              <div style={messagesContainerStyle}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: "flex",
                      justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        maxWidth: message.sender === "user" ? "80%" : "100%",
                        flexDirection: message.sender === "user" ? "row-reverse" : "row",
                        gap: "8px",
                      }}
                    >
                      <Avatar
                        size="small"
                        icon={message.sender === "user" ? <UserOutlined /> : <RobotOutlined />}
                        style={{
                          backgroundColor: message.sender === "user" ? "#1890ff" : "#f0f0f0",
                          color: message.sender === "user" ? "white" : "#666",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            padding: "12px",
                            borderRadius: "12px",
                            backgroundColor: message.sender === "user" ? "#1890ff" : "#fff",
                            color: message.sender === "user" ? "white" : "#333",
                            border: message.sender === "bot" ? "1px solid #f0f0f0" : "none",
                            wordBreak: "break-word",
                          }}
                        >
                          {parse(message.text || "")}
                        </div>
                        <Text type="secondary" style={{ fontSize: "12px", marginTop: "4px", display: "block" }}>
                          {formatTime(message.timestamp)}
                        </Text>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <Avatar
                        size="small"
                        icon={<RobotOutlined />}
                        style={{ backgroundColor: "#f0f0f0", color: "#666" }}
                      />
                      <div
                        style={{
                          padding: "8px 12px",
                          borderRadius: "12px",
                          backgroundColor: "#fff",
                          border: "1px solid #f0f0f0",
                        }}
                      >
                        <Spin size="small" />
                        <Text style={{ marginLeft: "8px", fontSize: "14px", color: "#666" }}>Đang trả lời...</Text>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div style={inputContainerStyle}>
                <Input.Group compact>
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    style={{ width: "calc(100% - 40px)" }}
                    maxLength={500}
                    disabled={isLoading}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    disabled={inputValue.trim() === "" || isLoading}
                    style={{ width: "40px" }}
                  />
                </Input.Group>
              </div>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  )
}

export default ChatBotAi
