import fs from "fs";
import qrList from "../data/qrs.json";

export interface QR {
  id: number;
  output: string[];
  prompt: string;
  init_image: string;
  control_image: string;
}

export interface QRsRepo {
  getAll: () => QR[];
  addQr: (qr: QR) => void;
}

let qrs: QR[] = qrList;

export const qrsRepo: QRsRepo = {
  getAll: () => qrs,
  addQr,
};

function addQr(qr: QR): void {
  qr.id = qrs.length ? Math.max(...qrs.map((qr) => qr.id)) + 1 : 1;

  qrs.push(qr);
  saveData();
}

function saveData(): void {
  const directoryPath = "../data";
  fs.mkdirSync(directoryPath, { recursive: true });

  const data = JSON.stringify(qrs, null, 4);
  fs.writeFile(`${directoryPath}/qrs.json`, data, (err) =>
    console.error("Error writing to file:", err)
  );
}
