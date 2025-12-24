router.get("/", protect, async (req, res) => {
  const notifications = await Notification.find({
    userId: req.user._id,
  });
  res.json(notifications);
});
