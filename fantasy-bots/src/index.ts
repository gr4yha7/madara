import "dotenv/config";
import app from "./app";

Error.stackTraceLimit = 3;

const port: any = process.env.PORT || 4422;

const server = app.listen(port, () => {
  console.info(`App running on Port: ${port}`);
});

process.on("uncaughtException", (err) => {
  console.warn("Uncaught Exception!! Shutting down process..");
  console.error(err.stack);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.warn("Unhandled Rejection!!", err);
  // process.exit(1);
});

export default server;