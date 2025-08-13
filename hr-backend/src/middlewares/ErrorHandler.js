import { StatusCodes } from "http-status-codes";
import { logger } from "../utils/logger.js";
import Response from "../utils/Response.js";

export default (err, req, res, next) => {
  // Logolja a hibát (stack vagy body)
  logger.error(
    err.stack !== undefined ? err.stack : JSON.stringify(err.body || err)
  );

  // Válasz kód és üzenet
  const responseCode =
    err.status || err.responseCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const title = err.title || "global.error.internal";
  const body = err.message || err.body || "global.error.unexpected";

  res.status(responseCode).json(new Response(title, body));
};
