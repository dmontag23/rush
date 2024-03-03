import {Server} from "http";
import {AddressInfo} from "net";

import express from "express";
import v2Router from "./routers";

// app needs to be exported for netlify
export const app = express();
let server: Server;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/api/v2", v2Router);

const port = process.env.PORT || 3000;

export const listen = async () =>
  await new Promise<void>(
    resolve =>
      (server = app.listen(port, () => {
        const serverAddress = server.address() as AddressInfo;
        console.log(`Running mock server on port '${serverAddress.port}'...`);
        server.timeout = 5000;
        resolve();
      }))
  );

export const close = async () =>
  await new Promise<void>(resolve =>
    server.close(() => {
      console.log("Closed mock server.");
      resolve();
    })
  );
