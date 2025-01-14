import { getAnalytics, logEvent } from "firebase/analytics";
import { useEffect, useRef } from "react";
import app from "./firebase-config";

const googleAnalysisSwitch = true

export default function useGoogleAnalysis(name: string | undefined, event: any, shouldLogEvent = true) {
  const analytics = getAnalytics(app)
  const eventRef = useRef(event);
  useEffect(() => {
    if (shouldLogEvent) {
      eventRef.current = event;
    }
  }, [event, shouldLogEvent]);

  useEffect(() => {
    if (googleAnalysisSwitch && analytics && shouldLogEvent && event && Object.values(event)) {
      try {
        logEvent(analytics, name, event);
      } catch (e) {
        console.error(e)
      }
    }
  }, [name, eventRef, shouldLogEvent])
}