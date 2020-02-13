import crypto from "crypto";

const { ALG, KEY } = process.env;

const algorithm: string = ALG;
const key: any = KEY;
const iv: any = crypto.randomBytes(16);

export function encrypt(text: string) {
 const cipher: crypto.Cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

export function decrypt(text: { iv: string, encryptedData: string }) {
 const ivFromBuffer: any = Buffer.from(text.iv, "hex");
 const encryptedText = Buffer.from(text.encryptedData, "hex");
 const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), ivFromBuffer);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}
