import { NextApiRequest, NextApiResponse } from "next";

export default async function onError(
  error: unknown,
  req: NextApiRequest,
  res: NextApiResponse,
  next?: () => void
) {
  res.status(500).end((error as unknown as Error).toString());
  next && next();
}
