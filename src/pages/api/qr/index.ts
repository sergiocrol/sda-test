import { QR, qrsRepo } from "@/lib/qrs-repo";
import query from "@/lib/db";
import { NextApiResponse, NextApiRequest } from "next/types";

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const qrRepo = qrsRepo;

  if (req.method === "POST") {
    try {
      const { id, output, prompt, init_image, control_image } = req.body as QR;

      const insertQuery = `
      INSERT INTO qr_codes (output, prompt, init_image, control_image)
      VALUES ($2, $3, $4, $5)
      RETURNING *
    `;

      const values = [id, output, prompt, init_image, control_image];

      const result = await query(insertQuery, values);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  } else if (req.method === "GET") {
    try {
      const selectQuery = `
        SELECT * FROM qr_codes
      `;

      const result = await query(selectQuery);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}
