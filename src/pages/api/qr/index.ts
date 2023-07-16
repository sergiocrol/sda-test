import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

import {
  httpGetAllQrs,
  httpPostQr,
  httpGenerateQr,
} from "@/server/routes/qrs/qrs.controller";
import onError from "@/server/middlewares/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(httpGetAllQrs);
router.post(httpPostQr);
router.post(httpGenerateQr);

export default router.handler({ onError });
