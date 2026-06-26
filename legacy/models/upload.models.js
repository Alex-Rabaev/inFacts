import { db } from "../config/db.js";

export const uploadSingle = ({ key, mimetype, location, originalname }) => {
  return db("uploads").insert({ key, mimetype, location, originalname }, [
    "id",
    "key",
    "mimetype",
    "location",
    "originalname",
  ]);
};
