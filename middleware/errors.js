// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace for debugging

    // Respond with a status code and error message
    res.status(500).json({
        status: false,
        message: err.message || "Something went wrong!"
    });
});