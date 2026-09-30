import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  getDocFromServer, 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ChatMessage, UserProfile, FeedbackPayload } from '../types';

// Initialize Firebase safely (prevent duplicate app init in HMR or reloads)
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(firebaseApp);

// Initialize Firestore targeting the provisioned database ID
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId)
  : getFirestore(firebaseApp);

// Connection test on boot as required by Firebase skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Firestore connected successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is offline or Firestore is unreachable.');
      return false;
    }
    // Expected if test doc does not exist, but connection handshake succeeded
    return true;
  }
}

// Kick off test connection
testFirestoreConnection();

export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// User Profile Firestore Persistence
export async function syncUserProfileToFirestore(
  uid: string, 
  profileData: Partial<UserProfile>
): Promise<void> {
  if (!uid) return;
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...profileData,
      uid,
      updatedAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('[Firebase] Could not sync user profile to Firestore:', err);
  }
}

export async function loadUserProfileFromFirestore(
  uid: string
): Promise<Partial<UserProfile> | null> {
  if (!uid) return null;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as Partial<UserProfile>;
    }
    return null;
  } catch (err) {
    console.warn('[Firebase] Could not load user profile from Firestore:', err);
    return null;
  }
}

// Chat Messages Firestore Persistence
export async function saveChatMessageToFirestore(
  uid: string, 
  message: ChatMessage
): Promise<void> {
  if (!uid || !message.id) return;
  try {
    // Sanitize message ID for Firestore path compliance
    const safeId = message.id.replace(/[^a-zA-Z0-9_-]/g, '_');
    const msgRef = doc(db, 'users', uid, 'messages', safeId);
    await setDoc(msgRef, {
      id: safeId,
      userId: uid,
      sender: message.sender,
      text: message.text || '',
      timestamp: message.timestamp || new Date().toISOString(),
      detectedLanguage: message.detectedLanguage || 'en',
      detectedLanguageName: message.detectedLanguageName || 'English',
      sources: message.sources || [],
      createdAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('[Firebase] Could not persist message to Firestore:', err);
  }
}

export async function loadChatMessagesFromFirestore(
  uid: string
): Promise<ChatMessage[]> {
  if (!uid) return [];
  try {
    const messagesCol = collection(db, 'users', uid, 'messages');
    const q = query(messagesCol, orderBy('timestamp', 'asc'), limit(50));
    const snap = await getDocs(q);
    const list: ChatMessage[] = [];
    snap.forEach((d) => {
      const data = d.data();
      list.push({
        id: data.id || d.id,
        sender: data.sender || 'assistant',
        text: data.text || '',
        timestamp: data.timestamp || new Date().toISOString(),
        detectedLanguage: data.detectedLanguage,
        detectedLanguageName: data.detectedLanguageName,
        sources: data.sources || []
      });
    });
    return list;
  } catch (err) {
    console.warn('[Firebase] Could not load messages from Firestore:', err);
    return [];
  }
}

// User Feedback Persistence to Firestore
export async function saveFeedbackToFirestore(
  feedback: FeedbackPayload, 
  uid?: string
): Promise<void> {
  try {
    const safeId = (feedback.messageId || `fb-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');
    const fbRef = doc(db, 'feedbacks', safeId);
    await setDoc(fbRef, {
      id: safeId,
      userId: uid || 'anonymous',
      messageId: feedback.messageId,
      query: feedback.query || '',
      responseSnippet: feedback.responseSnippet || '',
      isHelpful: !!feedback.isHelpful,
      rating: feedback.rating || (feedback.isHelpful ? 5 : 2),
      accuracyTag: feedback.accuracyTag || '',
      comment: feedback.comment || '',
      timestamp: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('[Firebase] Could not persist feedback to Firestore:', err);
  }
}
