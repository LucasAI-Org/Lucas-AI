const express = require("express");
const { db } = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");
const { userUpdateSchema } = require("../validation/schemas");
const { calculateLevel } = require("../utils/helpers");
const router = express.Router();

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const userDoc = await db().collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: userDoc.data(),
    });
  } catch (error) {
    console.error("User fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { error, value } = userUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details
      });
    }

    const updateData = {
      ...value,
      updatedAt: new Date().toISOString()
    };

    await db().collection('users').doc(userId).update(updateData);

    if (value.careerPath) {
      await reassignQuestsForNewCareer(userId, value.careerPath);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

router.post('/:id/switch-career', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const { newCareerPath } = req.body;

    if (userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const userDoc = await db().collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();
    
    if (userData.level < 20) {
      return res.status(403).json({
        success: false,
        message: 'Career switch unlocked at level 20'
      });
    }

    const updateData = {
      careerPath: newCareerPath,
      xp: Math.floor(userData.xp * 0.5),
      questsCompleted: [],
      currentQuests: [],
      updatedAt: new Date().toISOString()
    };

    updateData.level = calculateLevel(updateData.xp);

    await db().collection('users').doc(userId).update(updateData);
    await reassignQuestsForNewCareer(userId, newCareerPath);

    res.json({
      success: true,
      message: 'Career switched successfully',
      data: updateData
    });

  } catch (error) {
    console.error('Career switch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to switch career'
    });
  }
});

const reassignQuestsForNewCareer = async (userId, careerPath) => {
  const { getRandomDailyQuests, getRandomWeeklyQuests } = require('../utils/helpers');
  
  const careerDoc = await db().collection('careers').where('title', '==', careerPath).get();
  if (careerDoc.empty) return;

  const career = careerDoc.docs[0].data();
  const questIds = career.quests || [];

  const questsSnapshot = await db().collection('quests').where('id', 'in', questIds).get();
  const quests = questsSnapshot.docs.map(doc => doc.data());

  const dailyQuests = getRandomDailyQuests(quests, 2);
  const weeklyQuests = getRandomWeeklyQuests(quests, 1);
  const newQuests = [...dailyQuests, ...weeklyQuests].map(q => q.id);

  await db().collection('users').doc(userId).update({
    currentQuests: newQuests
  });
};

module.exports = router;