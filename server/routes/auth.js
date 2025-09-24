const express = require("express");
const { db, auth } = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");
const { userRegistrationSchema } = require("../validation/schemas");
const router = express.Router();

router.post("/register", verifyToken, async (req, res) => {
  try {
    const { error, value } = userRegistrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.details,
      });
    }

    const { name, skills, careerPath } = value;
    const userId = req.user.uid;

    const userDoc = await db().collection("users").doc(userId).get();
    if (userDoc.exists) {
      return res.status(409).json({
        success: false,
        message: "User already registered",
      });
    }

    const userData = {
      id: userId,
      email: req.user.email,
      name,
      skills,
      careerPath,
      xp: 0,
      level: 1,
      questsCompleted: [],
      currentQuests: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db().collection("users").doc(userId).set(userData);

    await assignInitialQuests(userId, careerPath);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userData,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userDoc = await db().collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    res.json({
      success: true,
      data: userDoc.data(),
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
});

const assignInitialQuests = async (userId, careerPath) => {
  const {
    getRandomDailyQuests,
    getRandomWeeklyQuests,
  } = require("../utils/helpers");

  const careerDoc = await db()
    .collection("careers")
    .where("title", "==", careerPath)
    .get();
  if (careerDoc.empty) return;

  const career = careerDoc.docs[0].data();
  const questIds = career.quests || [];

  const questsSnapshot = await db()
    .collection("quests")
    .where("id", "in", questIds)
    .get();
  const quests = questsSnapshot.docs.map((doc) => doc.data());

  const dailyQuests = getRandomDailyQuests(quests, 2);
  const weeklyQuests = getRandomWeeklyQuests(quests, 1);
  const initialQuests = [...dailyQuests, ...weeklyQuests].map((q) => q.id);

  await db().collection("users").doc(userId).update({
    currentQuests: initialQuests,
  });
};

module.exports = router;
