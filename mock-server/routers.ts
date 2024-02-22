import express from 'express';
import postAccessTokensRoute from './postAccessTokensRoute';
import loginTokensRoute from './postLoginTokensRoute';

const v2Router = express.Router();
loginTokensRoute(v2Router);
postAccessTokensRoute(v2Router);

export default v2Router;
