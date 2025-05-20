import React, { useEffect, useState } from 'react';

function App() {
  const [isBotReady, setIsBotReady] = useState(false);
  const [message, setMessage] = useState('');
  const [botReplies, setBotReplies] = useState([]); // لتخزين ردود البوت

  useEffect(() => {
    if (window.botpressWebChat && !window.botpressWebChat.isInitialized) {
      window.botpressWebChat.init({
        botId: 'support-bot',
        hostUrl: 'http://localhost:3000',
        messagingUrl: 'http://localhost:3000',
        clientId: 'support-bot',
        showPoweredBy: false,
        enableWelcomeMessage: false,
      });

      window.botpressWebChat.isInitialized = true;
      setIsBotReady(true);

      // الاستماع لردود البوت
      window.addEventListener('webchat:message', (event) => {
        const detail = event.detail;

        // الرد من البوت
        if (detail.direction === 'incoming' && detail.payload?.text) {
          setBotReplies((prev) => [...prev, detail.payload.text]);
        }
      });
    }
  }, []);

  const sendMessage = () => {
    if (!isBotReady) {
      alert('⏳ البوت مازال كيتجهز...');
      return;
    }

    if (message.trim() === '') {
      alert('⚠️ الرسالة فارغة!');
      return;
    }

    if (window.botpressWebChat && typeof window.botpressWebChat.sendEvent === 'function') {
      window.botpressWebChat.sendEvent({
        type: 'text',
        text: message,
        channel: 'web',
      });
      console.log('✅ تم إرسال الرسالة:', message);
    } else {
      console.warn('⚠️ Botpress Web Chat غير جاهز.');
    }

    setMessage('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🤖 مرحبا بك مع بوت الدعم</h1>

      <input
        type="text"
        placeholder="اكتب رسالتك هنا..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: '300px', padding: '8px' }}
      />
      <button onClick={sendMessage} style={{ marginLeft: 10, padding: '8px 12px' }}>
        إرسال
      </button>

      {!isBotReady && <p style={{ marginTop: 10 }}>جار تهيئة البوت، يرجى الانتظار...</p>}

      <div style={{ marginTop: 30 }}>
        <h3>📩 ردود البوت:</h3>
        {botReplies.length === 0 && <p>لم يصلك رد من البوت بعد.</p>}
        <ul>
          {botReplies.map((reply, idx) => (
            <li key={idx}>{reply}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
