import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

import { httpPostWebhook } from "@/server/routes/webhook/webhook.controller";
import onError from "@/server/middlewares/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(httpPostWebhook);

export default router.handler({ onError });
