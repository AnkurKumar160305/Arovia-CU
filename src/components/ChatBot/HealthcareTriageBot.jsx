import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const GEMINI_API_KEY = 'AIzaSyATlMq9S66FLRuQTuixmB7CXHMDnK2SAs0';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function HealthcareTriageBot({ showOnHomepage = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I\'m your Healthcare Triage Assistant. I can help assess your symptoms and provide guidance on whether you should:\n\n• Try home remedies\n• Schedule a doctor visit\n• Seek emergency care\n\nPlease describe your symptoms to get started.',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef(null);
  const { t } = useLanguage();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callGeminiAPI = async (userMessage) => {
    try {
      const triagePrompt = `
You are an AI Healthcare Triage Assistant. Your role is to analyze symptoms and provide guidance.

CRITICAL INSTRUCTIONS:
1. Analyze the symptoms provided by the user
2. List possible health conditions (clearly state these are possibilities, NOT diagnoses)
3. Provide a clear recommendation in one of these categories:
   - HOME REMEDY: Minor issues that can be treated at home
   - DOCTOR VISIT: Conditions requiring professional medical evaluation
   - EMERGENCY: Serious symptoms requiring immediate medical attention

4. For HOME REMEDY cases: Suggest specific remedies
5. For DOCTOR VISIT: Explain why professional evaluation is needed
6. For EMERGENCY: List red flag symptoms and urge immediate action

7. Always include a disclaimer that this is NOT a medical diagnosis
8. Be clear, concise, and compassionate
9. Focus on rural/remote area context where medical access may be limited

User Symptoms: ${userMessage}

Please provide:
1. Possible conditions (3-5 possibilities)
2. Severity assessment
3. Recommendation (HOME REMEDY / DOCTOR VISIT / EMERGENCY)
4. Specific guidance based on recommendation
5. Warning signs to watch for
      `;

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: triagePrompt }] }],
          generationConfig: {
            temperature: 0.4,
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
        'I apologize, but I\'m having trouble processing your request. Please try again or consult a healthcare professional directly.'
      );
    } catch (error) {
      console.error('Gemini API Error:', error);
      return 'I\'m experiencing technical difficulties. For your safety, please consult a healthcare professional directly if you have concerning symptoms.';
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
      const botResponse = await callGeminiAPI(userMessage);
      const newBotMessage = {
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'bot',
        content: 'I\'m having technical difficulties. Please consult a healthcare professional for medical advice.',
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
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Your browser does not support text-to-speech.');
    }
  };

  const startNewConsultation = () => {
    setMessages([
      {
        type: 'bot',
        content: 'Hello! I\'m your Healthcare Triage Assistant. I can help assess your symptoms and provide guidance on whether you should:\n\n• Try home remedies\n• Schedule a doctor visit\n• Seek emergency care\n\nPlease describe your symptoms to get started.',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className={`chatbot-container ${showOnHomepage ? 'homepage-chatbot' : ''}`}>
      <button
        className="chatbot-toggle triage-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title={user ? `${user.name}, Healthcare Triage Assistant` : 'Healthcare Triage Assistant'}
      >
        {isOpen ? (
          <ion-icon name="close-outline"></ion-icon>
        ) : (
          <div className="chatbot-icon">
            <ion-icon name="medical-outline"></ion-icon>
            <div className="pulse-ring"></div>
          </div>
        )}
      </button>

      {isOpen && (
        <div className={`chatbot-modal ${showOnHomepage ? 'homepage-modal' : ''}`}>
          <div className="chatbot-header triage-header">
            <h3>
              <ion-icon name="medical-outline"></ion-icon> Healthcare Triage
              {user && <span className="user-greeting">- {user.name}</span>}
            </h3>
            <div className="chatbot-header-actions">
              <button
                className="header-action-btn"
                onClick={startNewConsultation}
                title="New Consultation"
              >
                <ion-icon name="refresh-outline"></ion-icon>
              </button>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>

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
                      title="Listen"
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
                <span>Analyzing symptoms...</span>
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
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  user
                    ? `${user.name}, describe your symptoms here...`
                    : 'Describe your symptoms here...'
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

          <div className="triage-disclaimer">
            <ion-icon name="information-circle-outline"></ion-icon>
            <p>This tool provides guidance only. It is not a substitute for professional medical advice, diagnosis, or treatment.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default HealthcareTriageBot;
