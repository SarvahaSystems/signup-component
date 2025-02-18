import React, { useEffect } from "react";
import JSConfetti from "js-confetti";

const Home: React.FC = () => {
    useEffect(() => {
        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti();
    }, []); // Runs only once when the component mounts

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                textAlign: "center",
            }}
        >
            <h1>Welcome to Home Page 🎉</h1>
        </div>
    );
};

export default Home;
