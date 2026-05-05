"use client";

import { useState, useEffect, useCallback } from "react";
import { Message } from "@/types/message";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = useCallback(async () => {
    const response = await fetch("/api/admin/messages");
    const data = await response.json();
    setMessages(data);
  }, []);

  const markAsRead = useCallback(
    async (id: string) => {
      await fetch(`/api/admin/messages?id=${id}`, { method: "PUT" });
      fetchMessages();
    },
    [fetchMessages]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this message?")) return;
      await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      if (selected?.id === id) setSelected(null);
      fetchMessages();
    },
    [selected]
  );

  const handleSelect = useCallback(
    (msg: Message) => {
      setSelected(msg);
      if (!msg.read) markAsRead(msg.id);
    },
    [markAsRead]
  );

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page__title">
          Messages
          {unreadCount > 0 && (
            <span className="admin-page__badge">{unreadCount}</span>
          )}
        </h1>
      </div>

      {messages.length === 0 ? (
        <div className="glass admin-empty">
          <p className="admin-empty__text">No messages yet</p>
        </div>
      ) : (
        <div className="admin-messages">
          <div className="admin-messages__list">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleSelect(msg)}
                className={`admin-message-item glass ${
                  selected?.id === msg.id ? "admin-message-item--active" : ""
                } ${!msg.read ? "admin-message-item--unread" : ""}`}
              >
                <div className="admin-message-item__header">
                  <span className="admin-message-item__name">{msg.name}</span>
                  <time className="admin-message-item__time">
                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <p className="admin-message-item__email">{msg.email}</p>
                <p className="admin-message-item__preview">
                  {msg.message.slice(0, 80)}...
                </p>
              </button>
            ))}
          </div>

          {selected && (
            <div className="glass admin-message-detail">
              <div className="admin-message-detail__header">
                <div>
                  <h2 className="admin-message-detail__name">{selected.name}</h2>
                  <a
                    href={`mailto:${selected.email}`}
                    className="admin-message-detail__email"
                  >
                    {selected.email}
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="btn btn--danger btn--sm"
                >
                  Delete
                </button>
              </div>

              <time className="admin-message-detail__time">
                {new Date(selected.createdAt).toLocaleString()}
              </time>

              <div className="admin-message-detail__body">
                {selected.message}
              </div>

              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.name}`}
                className="btn btn--primary btn--mt"
              >
                Reply via Email
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
