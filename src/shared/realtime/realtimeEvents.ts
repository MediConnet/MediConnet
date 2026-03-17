export type RealtimeEventName =
  | "appointment:created"
  | "appointment:updated"
  | "review:new"
  | "order:updated"
  | "notification:new"
  | "connected"
  | "disconnected"
  | "error";

export type RealtimeEventDetail = {
  name: RealtimeEventName;
  payload?: unknown;
};

const REALTIME_EVENT_TYPE = "mediconnet:realtime";

export function emitRealtimeEvent(name: RealtimeEventName, payload?: unknown) {
  window.dispatchEvent(
    new CustomEvent<RealtimeEventDetail>(REALTIME_EVENT_TYPE, {
      detail: { name, payload },
    }),
  );
}

export function onRealtimeEvent(
  handler: (detail: RealtimeEventDetail) => void,
) {
  const listener = (event: Event) => {
    const ce = event as CustomEvent<RealtimeEventDetail>;
    if (!ce.detail?.name) return;
    handler(ce.detail);
  };
  window.addEventListener(REALTIME_EVENT_TYPE, listener);
  return () => window.removeEventListener(REALTIME_EVENT_TYPE, listener);
}

