import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const GEMINI_API_KEY = 'AIzaSyATlMq9S66FLRuQTuixmB7CXHMDnK2SAs0';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function DadiChatBot({ showOnHomepage = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Namaste! I am Dadi, your caring medical assistant. I can help you with:\n\n• Medicine reminders\n• Health queries and advice\n• Home remedies\n• When to see a doctor\n\nHow can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [reminders, setReminders] = useState([]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const { t } = useLanguage();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    loadReminders();
  }, [user]);

  const loadReminders = () => {
    const mockReminders = [
      {
        id: 1,
        medicine: 'Paracetamol 500mg',
        time: '08:00 AM',
        frequency: 'twice daily',
        active: true
      },
      {
        id: 2,
        medicine: 'Vitamin D3',
        time: '09:00 AM',
        frequency: 'once daily',
        active: true
      }
    ];
    setReminders(mockReminders);
  };

  const callDadiAPI = async (userMessage) => {
    try {
      const dadiPrompt = `
You are Dadi (Grandmother) - a warm, caring, and knowledgeable medical assistant with years of traditional and modern healthcare wisdom.

PERSONALITY:
- Speak like a caring grandmother - warm, gentle, and reassuring
- Use simple, easy-to-understand language
- Show empathy and concern
- Provide practical advice based on both traditional wisdom and modern medicine
- Be culturally sensitive to Indian context

CAPABILITIES:
1. Medical Queries: Answer health-related questions with care and wisdom
2. Home Remedies: Suggest safe, traditional remedies for minor ailments
3. Medicine Reminders: Help users set up and manage medicine schedules
4. Health Guidance: Advise when to see a doctor vs. home care
5. Symptom Assessment: Evaluate severity and provide appropriate guidance

INSTRUCTIONS:
- Always prioritize user safety
- For serious symptoms, urgently recommend seeing a doctor
- Provide practical home remedies for minor issues
- If user asks about medicine reminders, offer to help set them up
- Be concise but caring in responses
- Include a caring message or blessing when appropriate

User Message: ${userMessage}

Respond as Dadi would - with wisdom, care, and practical advice.
      `;

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: dadiPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return (
        data.candidates[0]?.content?.parts[0]?.text ||
        'Beta, I am having trouble understanding. Please ask me again, and Dadi will help you.'
      );
    } catch (error) {
      console.error('Dadi API Error:', error);
      return 'Beta, I am feeling a bit tired right now. Please try asking Dadi again in a moment.';
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    setIsLoading(true);

    const newUserMessage = {
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const botResponse = await callDadiAPI(userMessage);
      const newBotMessage = {
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'bot',
        content: 'Beta, Dadi is having some difficulty. Please consult a doctor if you need immediate help.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const speakText = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Your browser does not support text-to-speech.');
    }
  };

  const startVoiceInput = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const startNewConversation = () => {
    setMessages([
      {
        type: 'bot',
        content: 'Namaste! I am Dadi, your caring medical assistant. I can help you with:\n\n• Medicine reminders\n• Health queries and advice\n• Home remedies\n• When to see a doctor\n\nHow can I help you today?',
        timestamp: new Date(),
      },
    ]);
  };

  const toggleReminder = (id) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, active: !reminder.active } : reminder
      )
    );
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  return (
    <div className={`chatbot-container ${showOnHomepage ? 'homepage-chatbot' : ''}`}>
      <button
        className="chatbot-toggle dadi-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title={user ? `${user.name}, Dadi is here to help` : 'Dadi - Your Medical Assistant'}
      >
        {isOpen ? (
          <ion-icon name="close-outline"></ion-icon>
        ) : (
          <div className="chatbot-icon">
            <ion-icon name="heart-outline"></ion-icon>
            <div className="pulse-ring"></div>
          </div>
        )}
      </button>

      {isOpen && (
        <div className={`chatbot-modal dadi-modal ${showOnHomepage ? 'homepage-modal' : ''}`}>
          <div className="chatbot-header dadi-header">
            <h3>
              <ion-icon name="heart-outline"></ion-icon> Dadi - Your Medical Assistant
              {user && <span className="user-greeting">- {user.name}</span>}
            </h3>
            <div className="chatbot-header-actions">
              <button
                className="header-action-btn"
                onClick={() => setShowReminders(!showReminders)}
                title="Medicine Reminders"
              >
                <ion-icon name="alarm-outline"></ion-icon>
              </button>
              <button
                className="header-action-btn"
                onClick={startNewConversation}
                title="New Conversation"
              >
                <ion-icon name="refresh-outline"></ion-icon>
              </button>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>

          {!showReminders ? (
            <>
              <div className="chatbot-messages">
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.type}`}>
                    <div className="message-content">{message.content}</div>
                    {message.type === 'bot' && (
                      <div className="message-actions">
                        <button
                          className="speak-btn"
                          onClick={() => speakText(message.content)}
                          disabled={isSpeaking}
                          title="Listen to Dadi"
                        >
                          <ion-icon
                            name={isSpeaking ? 'stop-outline' : 'volume-high-outline'}
                          ></ion-icon>
                          {isSpeaking ? 'Stop' : 'Listen'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="typing-indicator">
                    <span>Dadi is thinking...</span>
                    <div className="typing-dots">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chatbot-input">
                <div className="input-group">
                  {recognitionRef.current && (
                    <button
                      className={`voice-input-btn ${isListening ? 'listening' : ''}`}
                      onClick={isListening ? stopVoiceInput : startVoiceInput}
                      title={isListening ? 'Stop listening' : 'Voice input'}
                    >
                      {isListening && <div className="voice-pulse"></div>}
                      <ion-icon name={isListening ? 'mic' : 'mic-outline'}></ion-icon>
                    </button>
                  )}
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      user
                        ? `${user.name}, ask Dadi anything...`
                        : 'Ask Dadi about your health...'
                    }
                    rows="1"
                    disabled={isLoading}
                  />
                  <button
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isLoading}
                    title="Send"
                  >
                    <ion-icon name="send-outline"></ion-icon>
                  </button>
                </div>
              </div>

              <div className="dadi-disclaimer">
                <ion-icon name="heart-circle-outline"></ion-icon>
                <p>Dadi provides guidance based on experience and knowledge, but always consult a doctor for medical advice.</p>
              </div>
            </>
          ) : (
            <div className="reminders-section">
              <div className="reminders-header">
                <h4>
                  <ion-icon name="alarm-outline"></ion-icon>
                  Medicine Reminders
                </h4>
                <button className="add-reminder-btn" onClick={() => alert('Add reminder feature coming soon!')}>
                  <ion-icon name="add-outline"></ion-icon>
                  Add Reminder
                </button>
              </div>

              <div className="reminders-list">
                {reminders.length > 0 ? (
                  reminders.map((reminder) => (
                    <div key={reminder.id} className={`reminder-card ${reminder.active ? '' : 'inactive'}`}>
                      <div className="reminder-icon">
                        <ion-icon name="medical-outline"></ion-icon>
                      </div>
                      <div className="reminder-info">
                        <h5>{reminder.medicine}</h5>
                        <p className="reminder-time">{reminder.time} - {reminder.frequency}</p>
                      </div>
                      <div className="reminder-actions">
                        <button
                          className={`toggle-btn ${reminder.active ? 'active' : ''}`}
                          onClick={() => toggleReminder(reminder.id)}
                          title={reminder.active ? 'Disable' : 'Enable'}
                        >
                          <ion-icon name={reminder.active ? 'checkmark-outline' : 'close-outline'}></ion-icon>
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteReminder(reminder.id)}
                          title="Delete"
                        >
                          <ion-icon name="trash-outline"></ion-icon>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-reminders">
                    <ion-icon name="alarm-outline"></ion-icon>
                    <h4>No Reminders Set</h4>
                    <p>Add medicine reminders to stay on track with your health</p>
                  </div>
                )}
              </div>

              <button className="back-to-chat-btn" onClick={() => setShowReminders(false)}>
                <ion-icon name="arrow-back-outline"></ion-icon>
                Back to Chat with Dadi
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DadiChatBot;
