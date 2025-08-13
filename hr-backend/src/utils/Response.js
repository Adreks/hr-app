// Egységes API válasz formátum (opcionális használat)
// Sikeres válasz: Response.success(res, data)
// Hibás válasz: Response.error(res, error)

class Response {
  static success(res, data, status = 200) {
    return res.status(status).json({ success: true, data });
  }
  static error(res, error, status = 500) {
    return res.status(status).json({ success: false, error });
  }
}

export default Response;
