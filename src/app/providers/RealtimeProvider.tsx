import { useEffect, useRef, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";
import { useAuthStore } from "../store/auth.store";
import { createSocketClient } from "../../shared/realtime/socket";
import { emitRealtimeEvent } from "../../shared/realtime/realtimeEvents";

const SOCKET_IO_PATH = "/socket.io";

export const RealtimeProvider = ({ children }: { children: ReactNode }) => {
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Disconnect if no token (logged out)
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Avoid reconnecting if we already have an active socket for same user
    if (socketRef.current?.connected) return;

    const socket = createSocketClient(token, SOCKET_IO_PATH);
    socketRef.current = socket;

    socket.on("connect", () => emitRealtimeEvent("connected"));
    socket.on("disconnect", () => emitRealtimeEvent("disconnected"));
    socket.on("connect_error", (err) =>
      emitRealtimeEvent("error", { message: err?.message || "connect_error" }),
    );

    const invalidateAppointments = () => {
      queryClient.invalidateQueries({ queryKey: ["doctors", "appointments", userId] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "dashboard", userId] });
      queryClient.invalidateQueries({ queryKey: ["clinics", "dashboard", userId] });
      // Components with local state can subscribe to this global event and refetch.
      emitRealtimeEvent("appointment:updated");
    };

    socket.on("appointment:created", (payload) => {
      emitRealtimeEvent("appointment:created", payload);
      invalidateAppointments();
    });

    socket.on("appointment:updated", (payload) => {
      emitRealtimeEvent("appointment:updated", payload);
      invalidateAppointments();
    });

    socket.on("review:new", (payload) => {
      emitRealtimeEvent("review:new", payload);
      queryClient.invalidateQueries({ queryKey: ["doctors", "reviews", userId] });
      queryClient.invalidateQueries({ queryKey: ["laboratory-panel-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["supply-panel-reviews"] });
      // Pharmacy reviews uses local state (hook subscribes to realtime events)
    });

    socket.on("order:updated", (payload) => {
      emitRealtimeEvent("order:updated", payload);
      queryClient.invalidateQueries({ queryKey: ["supplies", "dashboard", userId] });
      // Orders list is local state (OrdersSection subscribes to realtime events)
    });

    socket.on("notification:new", (payload) => {
      emitRealtimeEvent("notification:new", payload);
      // If/when notifications are moved to React Query, invalidate here.
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, userId, queryClient]);

  return <>{children}</>;
};

