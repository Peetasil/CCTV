import { io } from "~/server/plugins/socket.io";

export default defineEventHandler(async (event) => {
    const req = await readBody(event);

    //timestamp
    //waterLevelM
    //alertLevel

    
    io.emit("hello", req);
});
