import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

import { httpGenerateQrCode } from "@/server/routes/qrs/qrs.controller";
import onError from "@/server/middlewares/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(httpGenerateQrCode);

export default router.handler({ onError });
