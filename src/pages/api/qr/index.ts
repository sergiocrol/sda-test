import { QR } from "@/types/qr";
import query from "@/lib/db";
import { NextApiResponse, NextApiRequest } from "next/types";

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const {
        output,
        prompt,
        init_image,
        control_image,
        auto_hint,
        controlnet_conditioning_scale,
        controlnet_model,
        controlnet_type,
        enhance_prompt,
        guess_mode,
        guidance_scale,
        height,
        model_id,
        negative_prompt,
        num_inference_steps,
        safety_checker,
        samples,
        strength,
        width,
        base64,
        clip_skip,
        embeddings_model,
        lora_model,
        lora_strength,
        mask_image,
        multi_lingual,
        scheduler,
        seed,
        temp,
        tomesd,
        upscale,
        use_karras_sigmas,
        vae,
      } = req.body as QR;

      const insertQuery = `
      INSERT INTO qr_codes (
        output, 
        prompt, 
        init_image, 
        control_image, 
        negative_prompt, 
        controlnet_model, 
        controlnet_type, 
        model_id, 
        auto_hint, 
        guess_mode, 
        width, 
        height, 
        controlnet_conditioning_scale, 
        samples, 
        scheduler, 
        num_inference_steps, 
        safety_checker, 
        base64, 
        enhance_prompt, 
        guidance_scale, 
        strength, 
        use_karras_sigmas,
        mask_image,
        tomesd,
        vae,
        lora_strength,
        lora_model,
        embeddings_model,
        multi_lingual,
        seed,
        upscale,
        clip_skip,
        temp
      )
      VALUES (
        $1,
        $2,
        $3, 
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14,
        $15,
        $16,
        $17,
        $18,
        $19,
        $20,
        $21,
        $22,
        $23,
        $24,
        $25,
        $26,
        $27,
        $28,
        $29,
        $30,
        $31,
        $32,
        $33
      )
      RETURNING *
    `;

      const values = [
        output,
        prompt,
        init_image,
        control_image,
        negative_prompt,
        controlnet_model,
        controlnet_type,
        model_id,
        auto_hint,
        guess_mode,
        width,
        height,
        controlnet_conditioning_scale,
        samples,
        scheduler,
        num_inference_steps,
        safety_checker,
        base64,
        enhance_prompt,
        guidance_scale,
        strength,
        use_karras_sigmas,
        mask_image,
        tomesd,
        vae,
        lora_strength,
        lora_model,
        embeddings_model,
        multi_lingual,
        seed,
        upscale,
        clip_skip,
        temp,
      ];

      const result = await query(insertQuery, values);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  } else if (req.method === "GET") {
    try {
      const selectQuery = `
        SELECT id, output, prompt, init_image, control_image, controlnet_model, controlnet_type, model_id, width, height, controlnet_conditioning_scale, scheduler, num_inference_steps, guidance_scale, strength FROM qr_codes ORDER BY id DESC
      `;

      const result = await query(selectQuery);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}
