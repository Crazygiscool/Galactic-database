import app from "./app";

// Use default port 3001 if not specified
const port = Number(process.env["PORT"]) || 3001;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
