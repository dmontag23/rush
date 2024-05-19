import "dotenv/config";

import {startBlobServer} from "./blobServer";
import {startMockServer} from "./server";

startBlobServer();
startMockServer();
