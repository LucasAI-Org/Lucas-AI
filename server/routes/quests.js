const express = require("express");
const { db } = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");
const {
  calculateLevel,
  getRandomDailyQuests,
  getRandomWeeklyQuests,
} = require("../utils/helpers");
const router = express.Router();

router.get("/:careerId", verifyToken, async (req, res) => {
  try {
    const careerId = req.params.careerId;

    const questsSnapshot = await db()
      .collection("quests")
      .where("careerId", "==", careerId)
      .get();
    const quests = questsSnapshot.docs.map((doc) => doc.data());

    res.json({
      success: true,
      data: quests,
    });
  } catch (error) {
    console.error("Quests fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quests",
    });
  }
});

router.get("/user/current", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const userDoc = await db().collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = userDoc.data();
    const questIds = userData.currentQuests || [];

    if (questIds.length === 0) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const questsSnapshot = await db()
      .collection("quests")
      .where("id", "in", questIds)
      .get();
    const quests = questsSnapshot.docs.map((doc) => doc.data());

    res.json({
      success: true,
      data: quests,
    });
  } catch (error) {
    console.error("Current quests fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch current quests",
    });
  }
});

router.post("/complete/:questId", verifyToken, async (req, res) => {
  try {
    const questId = req.params.questId;
    const userId = req.user.uid;

    const userDoc = await db().collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = userDoc.data();

    if (!userData.currentQuests.includes(questId)) {
      return res.status(400).json({
        success: false,
        message: "Quest not assigned to user",
      });
    }

    const questDoc = await db().collection("quests").doc(questId).get();
    if (!questDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Quest not found",
      });
    }

    const questData = questDoc.data();

    const newXP = userData.xp + questData.xpReward;
    const newLevel = calculateLevel(newXP);
    const updatedQuestsCompleted = [...userData.questsCompleted, questId];
    const updatedCurrentQuests = userData.currentQuests.filter(
      (id) => id !== questId
    );

    const updateData = {
      xp: newXP,
      level: newLevel,
      questsCompleted: updatedQuestsCompleted,
      currentQuests: updatedCurrentQuests,
      updatedAt: new Date().toISOString(),
    };

    await db().collection("users").doc(userId).update(updateData);

    await assignReplacementQuest(userId, userData.careerPath, questData.type);

    res.json({
      success: true,
      message: "Quest completed successfully",
      data: {
        xpGained: questData.xpReward,
        newXP: newXP,
        newLevel: newLevel,
        levelUp: newLevel > userData.level,
      },
    });
  } catch (error) {
    console.error("Quest completion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete quest",
    });
  }
});

router.post("/skip/:questId", verifyToken, async (req, res) => {
  try {
    const questId = req.params.questId;
    const userId = req.user.uid;

    const userDoc = await db().collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = userDoc.data();

    if (!userData.currentQuests.includes(questId)) {
      return res.status(400).json({
        success: false,
        message: "Quest not assigned to user",
      });
    }

    const questDoc = await db().collection("quests").doc(questId).get();
    if (!questDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Quest not found",
      });
    }

    const questData = questDoc.data();

    const newXP = Math.max(0, userData.xp + questData.xpPenalty);
    const newLevel = calculateLevel(newXP);
    const updatedCurrentQuests = userData.currentQuests.filter(
      (id) => id !== questId
    );

    const updateData = {
      xp: newXP,
      level: newLevel,
      currentQuests: updatedCurrentQuests,
      updatedAt: new Date().toISOString(),
    };

    await db().collection("users").doc(userId).update(updateData);

    await assignReplacementQuest(userId, userData.careerPath, questData.type);

    res.json({
      success: true,
      message: "Quest skipped",
      data: {
        xpLost: Math.abs(questData.xpPenalty),
        newXP: newXP,
        newLevel: newLevel,
      },
    });
  } catch (error) {
    console.error("Quest skip error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to skip quest",
    });
  }
});

const assignReplacementQuest = async (userId, careerPath, questType) => {
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

  const userDoc = await db().collection("users").doc(userId).get();
  const userData = userDoc.data();
  const unavailableQuests = [
    ...userData.currentQuests,
    ...userData.questsCompleted,
  ];

  const availableQuests = quests.filter(
    (q) => q.type === questType && !unavailableQuests.includes(q.id)
  );

  if (availableQuests.length > 0) {
    const randomQuest =
      availableQuests[Math.floor(Math.random() * availableQuests.length)];

    await db()
      .collection("users")
      .doc(userId)
      .update({
        currentQuests: [...userData.currentQuests, randomQuest.id],
      });
  }
};

module.exports = router;
