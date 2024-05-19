import {BlobsServer} from "@netlify/blobs/server";

// Create a server by providing a local directory where all
// blobs and metadata should be persisted
const server = new BlobsServer({
  directory: process.env.NETLIFY_DATA_DIRECTORY ?? ".",
  port: Number(process.env.NETLIFY_SERVER_PORT),
  // TODO: If this runs locally on CI/CD, remove the token!!
  token: process.env.NETLIFY_API_KEY
});

export const startBlobServer = async () => {
  const {port} = await server.start();
  console.log(`Running blob server on port '${port}'...`);
};
