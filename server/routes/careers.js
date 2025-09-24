const express = require("express");
const { db } = require("../config/firebase");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const careersSnapshot = await db().collection("careers").get();
    const careers = careersSnapshot.docs.map((doc) => doc.data());

    res.json({
      success: true,
      data: careers,
    });
  } catch (error) {
    console.error("Careers fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch careers",
    });
  }
});

router.get("/:careerId", async (req, res) => {
  try {
    const careerId = req.params.careerId;

    const careerDoc = await db().collection("careers").doc(careerId).get();
    if (!careerDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    res.json({
      success: true,
      data: careerDoc.data(),
    });
  } catch (error) {
    console.error("Career fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch career",
    });
  }
});

module.exports = router;
