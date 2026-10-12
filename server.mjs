import "dotenv/config";
import app from "./app/app.index.mjs";

const start = () => {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`App is running on : ${port}`);
  });
};

start();
