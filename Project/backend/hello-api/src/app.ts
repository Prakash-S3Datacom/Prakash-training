
import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        message: "Hello API is running successfully"
    });
});

app.get("/hello", (req, res) => {
    const name = req.query.name;

    if (name === undefined) {
        return res.status(200).json({
            message: "Hello, World!"
        });
    }

    if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({
            error: "Name must be a non-empty string"
        });
    }

    return res.status(200).json({
        message: `Hello, ${name.trim()}!`
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: "Endpoint not found"
    });
});

export default app;
