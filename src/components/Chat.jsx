import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api/chatApi';
import './Chat.css';

function Chat() {
    // 状態管理
    const [messages, setMessages] = useState([]); // メッセージ履歴
    const [inputMessage, setInputMessage] = useState(''); // 入力中のメッセージ
    const [isLoading, setIsLoading] = useState(false); // ローディング状態
    const [conversationId, setConversationId] = useState(''); // 会話ID
    const [selectedTopic, setSelectedTopic] = useState('general'); // 選択されたトピック

    // トピックの選択肢
    const topics = [
        { id: 'general', label: '一般' },
        { id: 'tech', label: '技術' },
        { id: 'business', label: 'ビジネス' },
        { id: 'other', label: 'その他' }
    ];

    // メッセージ表示エリアの参照
    const messagesEndRef = useRef(null);

    // メッセージが追加されたときに自動スクロール
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // メッセージを送信する関数
    const sendMessage = async () => {
        const message = inputMessage.trim();
        if (!message || isLoading) return;

        // 入力欄をクリア
        setInputMessage('');
        // ローディング状態を開始
        setIsLoading(true);

        // ユーザーメッセージを追加
        const userMessage = { role: 'user', content: message };
        setMessages(prev => [...prev, userMessage]);

        try {
            // APIを呼び出してメッセージを送信
            const data = await sendChatMessage(message, conversationId, selectedTopic);

            // アシスタントのメッセージを追加
            setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);

            // 会話IDを更新
            setConversationId(data.conversation_id);

        } catch (error) {
            console.error('エラー詳細:', error);
            setMessages(prev => [...prev, { role: 'error', content: `メッセージの送信に失敗しました: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Enterキーでメッセージを送信
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                チャット
            </div>
            <div className="chat-topic">
                <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    disabled={isLoading}
                >
                    {topics.map(topic => (
                        <option key={topic.id} value={topic.id}>
                            {topic.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.role}-message`}>
                        {message.content}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="メッセージを入力..."
                    disabled={isLoading}
                />
                <button onClick={sendMessage} disabled={isLoading}>
                    {isLoading ? '送信中...' : '送信'}
                </button>
            </div>
        </div>
    );
}

export default Chat;
