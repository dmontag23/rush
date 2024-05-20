import {BlobsServer} from "@netlify/blobs/server";

// Create a server by providing a local directory where all
// blobs and metadata should be persisted
const server = new BlobsServer({
  directory: "./data",
  port: 1234,
  token: process.env.NETLIFY_API_KEY
});

export const startBlobServer = async () => {
  const {port} = await server.start();
  console.log(`Running blob server on port '${port}'...`);
};
