import { setHeaders, setResponseStatus } from "h3";
import type { H3Event } from "h3";

interface Client {
    id: string;
    event: H3Event;
}

export class Manager {
    private clients: Client[];

    constructor() {
        this.clients = [];
    }

    addClient({ id, event }: Client) {
        setHeaders(event, {
            "cache-control": "no-cache",
            connection: "keep-alive",
            "content-type": "text/event-stream",
        });
        setResponseStatus(event, 200);

        this.clients.push({ id, event });
        
    }

    getClients() {
        return this.clients;
    }
    removeClient(id: string) {

        console.log(this.clients);
        
        this.clients = this.clients.filter((c) => c.id !== id);

        console.log(this.clients);

    }

    broadcast(client: Client, eventName: string, data: Record<string, any>) {
        
        client.event.node.res.write(
            `id: ${client.id}\nevent: ${eventName}\ndata: ${JSON.stringify(
                data
            )}\n\n`
        );
    }

    broadcasts(eventName: string, data: Record<string, any>) {

        console.log(this.clients);
        
        this.clients.forEach((client) => {

            console.log(client);
            
            this.broadcast(client, eventName, data);
        }
            
        );
    }
}
