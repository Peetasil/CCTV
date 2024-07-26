export default defineWebSocketHandler({
    open(peer) {
        console.log(`[ws] open ${peer}`);
        peer.subscribe("event");
    },
    async message(peer, message) {
        console.log(`[ws] message ${peer}`);

        peer.send(JSON.parse(message));
        peer.publish("event", JSON.parse(message));
    },
    close(peer, details) {
        console.log(`[ws] close ${peer}`);
    },
    error(peer, error) {
        console.log(`[ws] error ${peer}`, error);
    },
    upgrade(req) {
        return {
            headers: {
                "x-powered-by": "cross-ws",
            },
        };
    },
});
