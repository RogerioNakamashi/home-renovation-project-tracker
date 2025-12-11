"use client";

import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { useState } from "react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isOwnMessage: boolean;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
}

function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  return (
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }) +
    " at " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function MessageList({
  messages,
  currentUserId,
  onSendMessage,
}: MessageListProps) {
  const [newMessage, setNewMessage] = useState("");

  // Defensive: dedupe messages by `id` and ensure stable ordering by timestamp
  // to avoid React's "Encountered two children with the same key" warning
  // when upstream state updates race (optimistic + server updates).
  const messagesById = new Map<string, Message>();
  for (const m of messages) {
    // prefer server-confirmed messages over optimistic ones if ids collide
    messagesById.set(m.id, m);
  }
  const messagesToRender = Array.from(messagesById.values()).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: 1,
        borderColor: "divider",
      }}
      elevation={1}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="body1" sx={{ fontWeight: 400 }}>
          Messages
        </Typography>
      </Box>

      {/* Messages Container */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messagesToRender.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: message.isOwnMessage ? "flex-end" : "flex-start",
              gap: 0.5,
            }}
          >
            {/* Sender name for other's messages */}
            {!message.isOwnMessage && (
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", ml: 1 }}
              >
                {message.senderName}
              </Typography>
            )}

            {/* Message bubble */}
            <Box
              sx={{
                maxWidth: "70%",
                p: 2,
                borderRadius: 4,
                bgcolor: message.isOwnMessage ? "primary.50" : "grey.100",
              }}
            >
              <Typography variant="body1" sx={{ color: "text.primary" }}>
                {message.content}
              </Typography>
            </Box>

            {/* Timestamp */}
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                px: 1,
              }}
            >
              {formatMessageTime(message.timestamp)}
            </Typography>
          </Box>
        ))}

        {messagesToRender.length === 0 && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        )}
      </Box>

      {/* Input Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          display: "flex",
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "background.paper",
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={!newMessage.trim()}
          sx={{ minWidth: 100 }}
        >
          <SendIcon sx={{ mr: 1, fontSize: 18 }} />
          Send
        </Button>
      </Box>
    </Paper>
  );
}
