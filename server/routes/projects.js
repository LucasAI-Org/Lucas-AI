const express = require("express");
const { db } = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.get("/:careerId", verifyToken, async (req, res) => {
  try {
    const careerId = req.params.careerId;

    const userDoc = await db().collection("users").doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userLevel = userDoc.data().level;

    const projectsSnapshot = await db()
      .collection("projects")
      .where("careerId", "==", careerId)
      .get();
    const projects = projectsSnapshot.docs.map((doc) => {
      const project = doc.data();
      return {
        ...project,
        unlocked: userLevel >= project.unlockLevel,
      };
    });

    projects.sort((a, b) => a.unlockLevel - b.unlockLevel);

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Projects fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
});

router.get("/details/:projectId", verifyToken, async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const projectDoc = await db().collection("projects").doc(projectId).get();
    if (!projectDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const project = projectDoc.data();

    const userDoc = await db().collection("users").doc(req.user.uid).get();
    const userLevel = userDoc.data().level;

    if (userLevel < project.unlockLevel) {
      return res.status(403).json({
        success: false,
        message: `Project unlocks at level ${project.unlockLevel}`,
      });
    }

    res.json({
      success: true,
      data: {
        ...project,
        unlocked: true,
      },
    });
  } catch (error) {
    console.error("Project details fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project details",
    });
  }
});

module.exports = router;
