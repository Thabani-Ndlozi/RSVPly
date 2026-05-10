// src/hooks/useGuests.js
// Real-time subscription to the guests sub-collection for one event.

import { useState, useEffect } from "react";
import {
  db, collection, query, where, orderBy, onSnapshot,
} from "../lib/firebase.js";

/**
 * Returns { guests, loading }
 *   guests  — array of guest objects for the given eventId
 *   loading — true while the first snapshot is pending
 */
export function useGuests(eventId) {
  const [guests,  setGuests]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) { setGuests([]); setLoading(false); return; }

    const q = query(
      collection(db, "guests"),
      where("eventId", "==", eventId),
      orderBy("registeredAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setGuests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return unsub;
  }, [eventId]);

  return { guests, loading };
}
