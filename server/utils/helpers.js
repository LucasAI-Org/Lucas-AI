const calculateLevel = (xp) => {
  return Math.floor(xp / 100) + 1;
};

const calculateXPForNextLevel = (currentLevel) => {
  return currentLevel * 100;
};

const generateQuestId = () => {
  return "quest_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
};

const generateProjectId = () => {
  return (
    "project_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
  );
};

const getRandomDailyQuests = (quests, count = 2) => {
  const dailyQuests = quests.filter((q) => q.type === "daily");
  const shuffled = dailyQuests.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomWeeklyQuests = (quests, count = 1) => {
  const weeklyQuests = quests.filter((q) => q.type === "weekly");
  const shuffled = weeklyQuests.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

module.exports = {
  calculateLevel,
  calculateXPForNextLevel,
  generateQuestId,
  generateProjectId,
  getRandomDailyQuests,
  getRandomWeeklyQuests,
};
