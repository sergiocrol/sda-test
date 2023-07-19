import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

import { httpProcessingResult } from "@/server/routes/qrs/qrs.controller";
import onError from "@/server/middlewares/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(httpProcessingResult);

export default router.handler({ onError });
