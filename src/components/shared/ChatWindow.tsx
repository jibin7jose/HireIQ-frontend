import React, { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Send, Loader2 } from 'lucide-react';
import { useSignalR } from '@/hooks/useSignalR';

interface Message {
  id: string;
  applicationId: string;
  senderUserId: string;
  senderName: string;
  receiverUserId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

interface ChatWindowProps {
  applicationId: string;
}

export default function ChatWindow({ applicationId }: ChatWindowProps) {
  const user = useAuthStore(state => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const connection = useSignalR();

  useEffect(() => {
    fetchMessages();
  }, [applicationId]);

  useEffect(() => {
    if (connection) {
      const handleReceiveMessage = (message: Message) => {
        if (message.applicationId === applicationId) {
          setMessages(prev => [...prev, message]);
          scrollToBottom();
        }
      };

      connection.on('ReceiveMessage', handleReceiveMessage);

      return () => {
        connection.off('ReceiveMessage', handleReceiveMessage);
      };
    }
  }, [connection, applicationId]);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${applicationId}`);
      setMessages(res.data);
      scrollToBottom();
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      const res = await api.post('/messages', {
        applicationId,
        content: newMessage
      });
      
      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
      scrollToBottom();
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-neutral-900 rounded-2xl border border-neutral-800">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
      <div className="p-4 border-b border-neutral-800 bg-neutral-950/50">
        <h3 className="font-bold text-white">Conversation</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-neutral-500 text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.senderUserId.toLowerCase() === user?.id?.toLowerCase() || 
                         msg.senderUserId.toLowerCase() === (user as any)?.userId?.toLowerCase();
            
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs text-neutral-400 font-medium">{isMe ? 'You' : msg.senderName}</span>
                  <span className="text-[10px] text-neutral-600">
                    {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div 
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-neutral-800 text-neutral-200 rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-neutral-950/50 border-t border-neutral-800">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 py-2 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
