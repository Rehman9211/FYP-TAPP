"use client"

import { useState, useEffect, createContext, useContext } from "react"

// Icons as SVG components (Keep original icons for simplicity)
const ArrowLeftRight = (props) => (
  <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 3L4 7l4 4" />
    <path d="m4 7 16 0" />
    <path d="m16 21-4-4 4-4" />
    <path d="M20 17H4" />
  </svg>
)

const Copy = (props) => (
  <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

const Volume2 = (props) => (
  <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
)

const Mic = (props) => (
  <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
)

const MicOff = (props) => (
  <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="2" x2="22" y1="2" y2="22" />
    <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
    <path d="M5 10v2a7 7 0 0 0 12 5" />
    <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
)

const Loader2 = (props) => (
  <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spinner">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

// --- Toast Context and Components (Unchanged logic) ---
const ToastContext = createContext()

const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = (title, description, type = "info") => {
    const id = Date.now()
    const toast = { id, title, description, type }

    setToasts((prev) => [...prev, toast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

// Toast Container Component - Class names updated for luxurious styling
const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container-lux">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-lux toast-lux-${toast.type}`}>
          <div className="toast-content-lux">
            <h4>{toast.title}</h4>
            <p>{toast.description}</p>
          </div>
          <button onClick={() => removeToast(toast.id)} className="toast-close-lux">
            &times;
          </button>
        </div>
      ))}
    </div>
  )
}
// --- End Toast Components ---


// Extended language list
const languages = {
  ur: "Urdu",
  sd: "Sindhi",
};


// Main Translator Component
const TranslatorApp = () => {
  const [fromText, setFromText] = useState("")
  const [toText, setToText] = useState("")
  const [fromLang, setFromLang] = useState("en") // English
  const [toLang, setToLang] = useState("ur") // Urdu
  const [isTranslating, setIsTranslating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const { showToast } = useToast()

  // Language/Voice Initialization (Unchanged logic)
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    // Initialize speech recognition
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = fromLang

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setFromText(transcript)
        setIsListening(false)
        translateText(transcript, fromLang, toLang);
      }

      recognitionInstance.onerror = () => {
        setIsListening(false)
        showToast("Voice Recognition Error", "Could not recognize speech. Please try again.", "error")
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [fromLang, showToast])

  // Translation function (updated to accept text/langs for voice flow)
  const translateText = async (textToTranslate = fromText, from = fromLang, to = toLang) => {
    if (!textToTranslate.trim()) return

    setIsTranslating(true)
    try {
      // Using MyMemory API
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${from}|${to}`,
      )
      const data = await response.json()

      if (data.responseData && data.responseData.translatedText) {
        setToText(data.responseData.translatedText)
        showToast("Success", "Text translated successfully.", "success")
      } else {
        throw new Error("Translation failed")
      }
    } catch (error) {
      showToast("Translation Error", "Could not translate text. Please check your input/network.", "error")
    } finally {
      setIsTranslating(false)
    }
  }

  const swapLanguages = () => {
    setFromLang(toLang)
    setToLang(fromLang)
    setFromText(toText)
    setToText(fromText)
  }

  const copyToClipboard = async (text, type) => {
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      showToast("Copied!", `${type === "source" ? "Source" : "Translation"} text copied to clipboard.`, "success")
    } catch (error) {
      showToast("Copy Failed", "Could not copy text to clipboard.", "error")
    }
  }

  // Text-to-Speech with ElevenLabs (API key is publicly visible, this is for demonstration only)
  const speakText = async (text, lang) => {
    if (!text) return;

    // A working multilingual voice ID
    const voiceId = "2AHF0QIkypVYj1KcBztN"; 
    
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // WARNING: API Key is exposed! This is for demonstration only.
          "xi-api-key": "sk_bb0f41017b44dc0e2634f58c92dc0a7250e88215bef956c7"
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2", // Supports multiple languages
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) throw new Error("TTS request failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("TTS Error:", error);
      showToast("Voice Error", "Could not play audio. Please try again.", "error");
    }
  };


  const startListening = () => {
    if (recognition) {
      setFromText("") // Clear previous text on mic start
      setIsListening(true)
      recognition.lang = fromLang // Set the language for recognition
      recognition.start()
    } else {
      showToast("Voice Recognition Not Supported", "Your browser doesn't support voice recognition.", "error")
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }

  return (
    <div className="app-lux">
      <div className="container-lux">
        {/* Header */}
        <div className="header-lux">
          <h1>Universal Translator</h1>
          <p>Seamless translation with **Elite Voice Integration**</p>
        </div>

        {/* Main Translator Panel */}
        <div className="main-panel">
          {/* Language Selectors */}
          <div className="language-selector-lux">
            <div className="language-group-lux">
              <label htmlFor="from-lang-select">SOURCE</label>
              <select 
                id="from-lang-select"
                value={fromLang} 
                onChange={(e) => setFromLang(e.target.value)}
                className="select-lux"
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <button className="accent-button" onClick={swapLanguages} title="Swap Languages">
              <ArrowLeftRight className="icon-gold" />
            </button>

            <div className="language-group-lux">
              <label htmlFor="to-lang-select">TARGET</label>
              <select 
                id="to-lang-select"
                value={toLang} 
                onChange={(e) => setToLang(e.target.value)}
                className="select-lux"
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Text Areas */}
          <div className="text-areas-lux">
            {/* Source Text */}
            <div className="textarea-wrapper">
              <textarea
                value={fromText}
                onChange={(e) => setFromText(e.target.value)}
                placeholder="Enter text to translate..."
                className="textarea-lux"
              />
              <div className="textarea-buttons-lux">
                <button
                  className="icon-button-lux"
                  onClick={() => copyToClipboard(fromText, "source")}
                  disabled={!fromText}
                  title="Copy text"
                >
                  <Copy />
                </button>
                <button
                  className="icon-button-lux"
                  onClick={() => speakText(fromText, fromLang)}
                  disabled={!fromText}
                  title="Listen to text"
                >
                  <Volume2 />
                </button>
                <button
                  className={`icon-button-lux mic-button ${isListening ? "listening-active" : ""}`}
                  onClick={isListening ? stopListening : startListening}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <MicOff /> : <Mic />}
                </button>
              </div>
            </div>

            {/* Translation Text */}
            <div className="textarea-wrapper">
              <textarea
                value={toText}
                readOnly
                placeholder={isTranslating ? "Processing Translation..." : "Translation will appear here..."}
                className="textarea-lux readonly-lux"
              />
              <div className="textarea-buttons-lux">
                <button
                  className="icon-button-lux"
                  onClick={() => copyToClipboard(toText, "translation")}
                  disabled={!toText}
                  title="Copy translation"
                >
                  <Copy />
                </button>
                <button
                  className="icon-button-lux"
                  onClick={() => speakText(toText, toLang)}
                  disabled={!toText}
                  title="Listen to translation"
                >
                  <Volume2 />
                </button>
              </div>
            </div>
          </div>

          {/* Translate Button */}
          <div className="button-center-lux">
            <button 
                onClick={() => translateText(fromText, fromLang, toLang)} 
                disabled={!fromText.trim() || isTranslating} 
                className="translate-button-lux"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="spinner-gold" />
                  <span>TRANSLATING</span>
                </>
              ) : (
                "INITIATE TRANSLATION"
              )}
            </button>
          </div>

          {/* Voice Recognition Status */}
          {isListening && (
            <div className="listening-indicator-lux">
              <div className="listening-badge-lux">
                <div className="pulse-dot-lux"></div>
                Voice Active: Speak now...
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="features-lux">
          <div className="feature-lux">
            <div className="feature-icon-lux">
              <Volume2 />
            </div>
            <h3>Elite Text-to-Speech</h3>
            <p>High-quality voice output.</p>
          </div>
          <div className="feature-lux">
            <div className="feature-icon-lux">
              <Mic />
            </div>
            <h3>Integrated Voice Input</h3>
            <p>Seamless hands-free translation.</p>
          </div>
          <div className="feature-lux">
            <div className="feature-icon-lux">
              <Copy />
            </div>
            <h3>Precision Copy</h3>
            <p>Instant clipboard access.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-lux">
          <p>&copy; Universal Language Suite | Multilingual Support for all Global Dialects</p>
        </div>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  return (
    <ToastProvider>
      <TranslatorApp />
    </ToastProvider>
  )
}

export default App