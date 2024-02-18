import express from 'express';
import {
  TodayTixAccessTokensReq,
  TodayTixAccessTokensRes,
  TodayTixLoginReq,
  TodayTixLoginRes
} from '../types/loginTokens';
import {TodayTixAPIError, TodayTixAPIRes} from '../types/base';

const v2Router = express.Router();

v2Router.post<
  '/loginTokens',
  {},
  TodayTixAPIRes<TodayTixLoginRes> | TodayTixAPIError,
  TodayTixLoginReq
>('/loginTokens', (req, res) => {
  if (req.body.email === 'good@gmail.com') {
    return res.status(201).json({code: 201, data: {}});
  }

  return res.status(400).json({
    code: 400,
    error: 'InvalidParameter',
    context: {
      parameterName: null,
      internalMessage: 'Please enter a valid email'
    },
    title: 'Error',
    message: 'Please enter a valid email'
  });
});

v2Router.post<
  '/accessTokens',
  {},
  TodayTixAPIRes<TodayTixAccessTokensRes> | TodayTixAPIError,
  TodayTixAccessTokensReq
>('/accessTokens', (req, res) => {
  if (req.body.code === 'good-code') {
    return res.status(201).json({
      code: 201,
      data: {
        _type: 'AccessToken',
        accessToken: 'access-token',
        tokenType: 'Bearer',
        scope: 'customer',
        refreshToken: 'refresh-token',
        expiresIn: 1800
      }
    });
  }

  return res.status(404).json({
    code: 404,
    error: 'MissingResource',
    context: null,
    title: 'MissingResource',
    message:
      'No login token found. Try logging in again or contact TodayTix Support if the issue persists.'
  });
});

export default v2Router;
