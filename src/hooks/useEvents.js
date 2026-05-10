// src/hooks/useEvents.js
// Real-time subscription to the current user's events collection.

import { useState, useEffect } from "react";
import {
  db, collection, query, where, orderBy, onSnapshot,
} from "../lib/firebase.js";

/**
 * Returns { events, loading }
 *   events  — array of event objects (with id field injected)
 *   loading — true while the first snapshot is pending
 */
export function useEvents(user) {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const q = query(
      collection(db, "events"),
      where("hostId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return unsub;
  }, [user]);

  return { events, loading };
}
