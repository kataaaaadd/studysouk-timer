/**
 * StudySouk Timer - Room Realtime Synchronization Engine
 * Powered by MQTT over WebSockets + BroadcastChannel fallback.
 * Enables zero-backend, instant multi-user synchronization across Discord Voice Channel activities.
 */

class RoomSyncEngine {
    constructor() {
        this.client = null;
        this.broadcastChannel = null;
        this.isConnected = false;
        this.listeners = new Map(); // eventName -> Array<callback>
        
        // Identity & Room
        this.clientId = "user_" + Math.random().toString(36).substring(2, 9);
        this.currentUser = {
            id: this.clientId,
            name: "Étudiant StudySouk",
            avatar: "assets/avatars/default.svg",
            level: 1,
            rank: "Apprenti",
            focusMinutes: 0
        };

        // Derive room ID from Discord URL parameters (instance_id or channel_id or room)
        const params = new URLSearchParams(window.location.search);
        this.roomId = params.get("instance_id") || params.get("channel_id") || params.get("room") || "studysouk-main-hall";
        this.baseTopic = `studysouk/activity/${this.roomId}`;

        // Connected users roster
        this.roster = new Map(); // clientId -> { user, lastSeen }
        this.heartbeatTimer = null;
        this.cleanRosterTimer = null;

        this.initBroadcastChannel();
        this.initMQTT();
        this.startHeartbeat();
    }

    setUser(user) {
        if (!user) return;
        this.currentUser = {
            ...this.currentUser,
            ...user
        };
        this.broadcastPresence();
    }

    joinRoom(newRoomId) {
        if (!newRoomId || newRoomId.trim() === "" || newRoomId.trim() === this.roomId) return;
        const cleanId = newRoomId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
        if (!cleanId) return;

        // Unsubscribe old
        if (this.client && this.client.connected) {
            this.client.unsubscribe(`${this.baseTopic}/#`);
        }
        if (this.broadcastChannel) {
            try { this.broadcastChannel.close(); } catch(e) {}
        }

        this.roomId = cleanId;
        this.baseTopic = `studysouk/activity/${this.roomId}`;
        this.roster.clear();

        // Subscribe new
        if (this.client && this.client.connected) {
            this.client.subscribe(`${this.baseTopic}/#`, { qos: 0 });
        }
        this.initBroadcastChannel();
        this.broadcastPresence();
        this.emit("room_changed", { roomId: this.roomId });
    }

    // --- EVENT SYSTEM ---
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    emit(event, data) {
        const cbs = this.listeners.get(event);
        if (cbs) {
            cbs.forEach(cb => {
                try {
                    cb(data);
                } catch (e) {
                    console.error(`[RoomSync] Error in listener for ${event}:`, e);
                }
            });
        }
    }

    // --- BROADCAST CHANNEL (Same-machine multi-tab fallback) ---
    initBroadcastChannel() {
        try {
            if ("BroadcastChannel" in window) {
                this.broadcastChannel = new BroadcastChannel(`studysouk_${this.roomId}`);
                this.broadcastChannel.onmessage = (event) => {
                    const { topic, payload, senderId } = event.data || {};
                    if (senderId && senderId !== this.clientId) {
                        this.handleIncomingMessage(topic, payload);
                    }
                };
            }
        } catch (e) {
            console.warn("[RoomSync] BroadcastChannel init warning:", e);
        }
    }

    // --- MQTT OVER WEBSOCKETS ---
    initMQTT() {
        if (!window.mqtt) {
            console.warn("[RoomSync] MQTT.js not loaded. Falling back to BroadcastChannel only.");
            return;
        }

        // Reliable public secure WebSockets MQTT broker (EMQX / Mosquitto)
        const brokerUrl = "wss://broker.emqx.io:8084/mqtt";
        const options = {
            clientId: `ss_${this.clientId}_${Math.floor(Math.random() * 1000)}`,
            clean: true,
            connectTimeout: 5000,
            reconnectPeriod: 4000,
            keepalive: 30
        };

        try {
            this.client = window.mqtt.connect(brokerUrl, options);

            this.client.on("connect", () => {
                this.isConnected = true;
                console.log(`%c[RoomSync] Connected to Discord Activity Room: ${this.roomId}`, "color: #D4AF37; font-weight: bold;");
                
                // Subscribe to all room subtopics
                const subTopic = `${this.baseTopic}/#`;
                this.client.subscribe(subTopic, { qos: 0 }, (err) => {
                    if (err) console.warn("[RoomSync] Subscription error:", err);
                });

                this.emit("connection_status", { status: "connected", roomId: this.roomId });
                this.broadcastPresence();
            });

            this.client.on("message", (topic, message) => {
                try {
                    const raw = message.toString();
                    const parsed = JSON.parse(raw);
                    if (parsed.senderId && parsed.senderId === this.clientId) {
                        return; // Ignore self echoes
                    }
                    this.handleIncomingMessage(topic, parsed.payload);
                } catch (err) {
                    console.error("[RoomSync] Failed to parse message:", err);
                }
            });

            this.client.on("close", () => {
                this.isConnected = false;
                this.emit("connection_status", { status: "disconnected", roomId: this.roomId });
            });

            this.client.on("error", (err) => {
                console.warn("[RoomSync] Broker notice:", err?.message || err);
            });
        } catch (e) {
            console.error("[RoomSync] MQTT connection error:", e);
        }
    }

    // --- DISPATCHER ---
    handleIncomingMessage(topic, payload) {
        if (!topic || !payload) return;
        const subtopic = topic.replace(`${this.baseTopic}/`, "").toLowerCase();

        switch (subtopic) {
            case "presence":
                this.handleRemotePresence(payload);
                break;
            case "pomodoro":
                this.emit("pomodoro_sync", payload);
                break;
            case "reaction":
                this.emit("reaction_received", payload);
                break;
            case "duel":
                this.emit("duel_message", payload);
                break;
            case "whiteboard":
                this.emit("whiteboard_message", payload);
                break;
            default:
                this.emit(subtopic, payload);
                break;
        }
    }

    // --- BROADCAST WRAPPER ---
    send(subtopic, payload) {
        const fullTopic = `${this.baseTopic}/${subtopic}`;
        const packet = {
            senderId: this.clientId,
            timestamp: Date.now(),
            payload
        };
        const messageStr = JSON.stringify(packet);

        // 1. Send via MQTT if connected
        if (this.client && this.client.connected) {
            this.client.publish(fullTopic, messageStr, { qos: 0 });
        }

        // 2. Send via BroadcastChannel (local browser tabs)
        if (this.broadcastChannel) {
            try {
                this.broadcastChannel.postMessage({
                    topic: fullTopic,
                    senderId: this.clientId,
                    payload
                });
            } catch (e) {
                // Ignore BC closed
            }
        }
    }

    // --- PRESENCE & ROSTER ---
    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            this.broadcastPresence();
        }, 6000);

        this.cleanRosterTimer = setInterval(() => {
            const now = Date.now();
            let changed = false;
            for (const [id, member] of this.roster.entries()) {
                if (now - member.lastSeen > 16000) { // Timeout after 16s
                    this.roster.delete(id);
                    changed = true;
                }
            }
            if (changed) {
                this.emitRosterUpdate();
            }
        }, 5000);
    }

    broadcastPresence() {
        const payload = {
            user: this.currentUser,
            status: "studying",
            timestamp: Date.now()
        };
        this.send("presence", payload);

        // Ensure self is in roster
        this.roster.set(this.clientId, {
            user: this.currentUser,
            lastSeen: Date.now(),
            isSelf: true
        });
        this.emitRosterUpdate();
    }

    handleRemotePresence(payload) {
        if (!payload || !payload.user || !payload.user.id) return;
        const memberId = payload.user.id;
        if (memberId === this.clientId) return;

        const isNew = !this.roster.has(memberId);
        this.roster.set(memberId, {
            user: payload.user,
            lastSeen: Date.now(),
            isSelf: false
        });

        if (isNew) {
            this.emit("user_joined", payload.user);
        }
        this.emitRosterUpdate();
    }

    emitRosterUpdate() {
        const users = Array.from(this.roster.values()).map(m => ({
            ...m.user,
            isSelf: !!m.isSelf
        }));
        this.emit("roster_update", {
            count: users.length,
            users: users
        });
    }

    getConnectedCount() {
        return Math.max(1, this.roster.size);
    }

    // --- SPECIFIC SYNC HELPERS ---
    syncPomodoro(action, timerData) {
        this.send("pomodoro", {
            action, // 'start' | 'pause' | 'reset' | 'mode' | 'sync'
            ...timerData,
            author: this.currentUser
        });
    }

    sendReaction(emojiKey) {
        this.send("reaction", {
            emojiKey: emojiKey,
            emoji: emojiKey,
            author: this.currentUser
        });
    }

    sendDuel(action, data) {
        this.send("duel", {
            action,
            ...data,
            author: this.currentUser
        });
    }

    sendWhiteboard(action, data) {
        this.send("whiteboard", {
            action,
            ...data,
            author: this.currentUser
        });
    }
}

// Global Export
window.RoomSyncEngine = RoomSyncEngine;
