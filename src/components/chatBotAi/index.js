import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import { chatBot } from '../../services/client/chatBotServies';

export default function ChatBotAi() {

  const handleNewUserMessage = async (newMessage) => {
    const res = await chatBot({ message: newMessage });
    addResponseMessage(res.reply);
    // console.log(res);
    
  };

  return (
    <>
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Tư vấn thời trang"
        subtitle="Chat với shop ngay!"
      />
    </>
  );
}