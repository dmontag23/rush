import express from 'express';
import {TodayTixLoginReq, TodayTixLoginRes} from './types/loginTokens';
import {TodayTixAPIError} from './types/base';

const v2Router = express.Router();

v2Router.post<
  '/loginTokens',
  {},
  TodayTixLoginRes | TodayTixAPIError,
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

export default v2Router;
