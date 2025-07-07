// utils/sessionManager.js
const activeSessions = new Map(); // { mentorId: studentSocketId }
const waitingQueue = new Map(); // { mentorId: [studentSocketIds] }

const addToQueue = (mentorId, studentSocket) => {
  if (!waitingQueue.has(mentorId)) {
    waitingQueue.set(mentorId, []);
  }
  waitingQueue.get(mentorId).push(studentSocket);
};

const removeFromQueue = (mentorId, studentSocket) => {
  if (waitingQueue.has(mentorId)) {
    const queue = waitingQueue.get(mentorId).filter((s) => s !== studentSocket);
    waitingQueue.set(mentorId, queue);
  }
};

const nextInQueue = (mentorId) => {
  if (!waitingQueue.has(mentorId)) return null;
  return waitingQueue.get(mentorId).shift() || null;
};

const isMentorBusy = (mentorId) => activeSessions.has(mentorId);

const startSession = (mentorId, studentSocket) => {
  activeSessions.set(mentorId, studentSocket);
};

const endSession = (mentorId) => {
  activeSessions.delete(mentorId);
};

const getCurrentStudent = (mentorId) => activeSessions.get(mentorId);

module.exports = {
  addToQueue,
  removeFromQueue,
  nextInQueue,
  isMentorBusy,
  startSession,
  endSession,
  getCurrentStudent,
};
