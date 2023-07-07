import { QR, qrsRepo } from "@/lib/qrs-repo";
import { NextApiResponse, NextApiRequest } from "next/types";

export default function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const qrRepo = qrsRepo;

  if (req.method === "POST") {
    const QRData: QR = req.body;

    qrRepo.create(QRData);
    res.status(200).json({ id: QRData.id });
  } else if (req.method === "GET") {
    const listOfQR: QR[] = qrRepo.getAll();

    res.status(200).json({ qrs: listOfQR });
  }
}
