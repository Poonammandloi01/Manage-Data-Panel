/**
 * Health check controller
 * Endpoint: GET /api/health
 */
export const getHealth = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "API is running"
  });
};
