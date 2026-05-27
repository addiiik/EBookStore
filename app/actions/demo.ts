'use server';

import { clearUserData, createUser, removeUser } from "./user";
import { createUserSession, getCurrentSession, removeUserSession } from "./auth";

export async function startDemo() {
  const userCreation = await createUser();
  if (!userCreation.success) return { success: false, message: `User creation failed` };

  const session = await createUserSession(userCreation.uid);
  if (!session.success) return { success: false, message: 'Session creation failed' };

  return { success: true, message: `Demo started successfully` };
}

export async function exitDemo() {
  const userRemoval = await removeUser();
  if (!userRemoval.success) return { success: false, message: `User removal failed` };
 
  const session = await removeUserSession();
  if (!session.success) return { success: false, message: 'Session cleanup failed' };
 
  return { success: true, message: 'Demo exited successfully' };
}

export async function restartDemo() {
  const oldSession = await removeUserSession();
  if (!oldSession.success) return { success: false, message: `Session cleanup failed` };

  const userCreation = await createUser();
  if (!userCreation.success) return { success: false, message: `User creation failed` };

  const session = await createUserSession(userCreation.uid);
  if (!session.success) return { success: false, message: 'Session creation failed' };

  return { success: true, message: `Demo restarted successfully` };
}

export async function resetDemo() {
  const uid = await getCurrentSession();
  if (!uid) return { success: false, message: 'No active session found' };
 
  const clear = await clearUserData(uid);
  if (!clear.success) return { success: false, message: 'Data cleanup failed' };
 
  return { success: true, message: `Demo reset successfully` };
}