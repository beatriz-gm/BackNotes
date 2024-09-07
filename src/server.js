require("express-async-errors");
require("dotenv/config");
const migrationsRun = require("./database/sqlite/migrations")
const express = require("express");
const cors = require("cors");
const uploadConfig = require("./configs/upload");
const routes = require("./routes");
const AppError = require("./utils/AppError");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);
migrationsRun();

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
