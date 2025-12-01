// App.js
import { useState } from "react";
import "./index.css";
import TranslatorApp from "./Components/TranslatorApp";
import Login from "./Components/Login"; // Import the new Login component


function App() {
    // State to track if the user is authenticated
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Function to update the authentication status
    const handleLogin = (status) => {
        setIsAuthenticated(status);
    };

    return (
        <>
            {/* Conditional Rendering based on isAuthenticated state */}
            {isAuthenticated ? (
                // If logged in, show the Translator App
                <TranslatorApp />
            ) : (
                // If not logged in, show the Login Page and pass the login handler
                <Login onLogin={handleLogin} />
            )}
        </>
    );
}

export default App;