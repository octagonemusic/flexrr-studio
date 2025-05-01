import mongoose from "mongoose";
import crypto from "crypto";

const encryptField = (value: string) => {
  if (!value) return;
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey)
    throw new Error("ENCRYPTION_KEY not defined in environment");

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey, "hex"),
    iv,
  );
  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

const decryptField = (value: string) => {
  if (!value) return;
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey)
    throw new Error("ENCRYPTION_KEY not defined in environment");

  const [ivHex, encryptedValue] = value.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey, "hex"),
    iv,
  );
  let decrypted = decipher.update(encryptedValue, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: String,
    accessToken: {
      type: String,
      select: false,
      set: encryptField,
      get: decryptField,
    },
    refreshToken: {
      type: String,
      select: false,
      set: encryptField,
      get: decryptField,
    },
    lastLogin: Date,
  },
  { timestamps: true },
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
