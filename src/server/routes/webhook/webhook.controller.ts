import catchAsyncErrors from "@/server/middlewares/catchAsyncErrors";
import { NextApiRequest, NextApiResponse } from "next";

export const httpPostWebhook = catchAsyncErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({});
  }
);
