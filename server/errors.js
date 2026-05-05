export function fail(message, status = 502) {
  throw Object.assign(new Error(message), { status });
}

export function errorHandler(err, _req, res, _next) {
  const status = Number.isInteger(err.status) ? err.status : 500;
  res.status(status).json({ error: err.message });
}
