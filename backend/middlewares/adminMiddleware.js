exports.adminOnly = (req, res, next) => {
  console.log("Auth Role:", req.user.role);
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};
