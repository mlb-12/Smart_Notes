import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";

export const addXP = async (amount) => {
  if (!auth.currentUser) return;

  const userRef = doc(db, "users", auth.currentUser.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      email: auth.currentUser.email,
      xp: 0,
      level: 1,
      streak: 0,
      lastActive: null,
      dailyXP: 0,
      badges: [],
      createdAt: new Date()
    });
  }

  const userSnap = await getDoc(userRef);
  const data = userSnap.data();

  const today = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const newXP = (data.xp || 0) + amount;
  const newLevel = Math.floor(newXP / 100) + 1;

  let streak = data.streak || 0;
  if (data.lastActive !== today) {
    if (data.lastActive === yesterday.toDateString()) {
      streak += 1;
    } else {
      streak = 1;
    }
  }

  let dailyXP = data.dailyXP || 0;
  if (data.lastActive !== today) {
    dailyXP = amount;
  } else {
    dailyXP += amount;
  }

  let badges = data.badges || [];

  const badgeRules = [
    { key: "FIRST_NOTE", condition: newXP >= 10 },
    { key: "50_XP", condition: newXP >= 50 },
    { key: "100_XP", condition: newXP >= 100 },
    { key: "LEVEL_5", condition: newLevel >= 5 },
    { key: "LEVEL_10", condition: newLevel >= 10 }
  ];

  badgeRules.forEach(rule => {
    if (rule.condition && !badges.includes(rule.key)) {
      badges.push(rule.key);
    }
  });

  await updateDoc(userRef, {
    xp: newXP,
    level: newLevel,
    streak,
    dailyXP,
    badges,
    lastActive: today
  });

  return amount;
};
