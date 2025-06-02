import { db } from './firebase';
import {
  ref,
  onValue,
  update,
  get,
  query,
  orderByKey,
  limitToLast,
} from 'firebase/database';

export function listenRealtimeData(callback: (data: any) => void) {
  return onValue(ref(db, '/realtime_data'), (snapshot) => {
    callback(snapshot.val());
  });
}

export function listenSettings(callback: (data: any) => void) {
  return onValue(ref(db, '/settings'), (snapshot) => {
    callback(snapshot.val());
  });
}

export function updateSettings(newSettings: any) {
  return update(ref(db, '/settings'), newSettings);
}

export async function fetchHistory(limit = 50) {
  const q = query(ref(db, '/history'), orderByKey(), limitToLast(limit));
  const snap = await get(q);
  const data: any[] = [];
  snap.forEach((child) => {
    data.push({ ...child.val(), timestamp: child.key });
  });
  return data;
}
