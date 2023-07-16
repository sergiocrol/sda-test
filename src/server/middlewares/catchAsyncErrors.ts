/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";

export default (fn: any) => {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};
