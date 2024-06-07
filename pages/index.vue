<template>
    <div>
        <Leaflet />

        <p>Status: {{ isConnected ? "connected" : "disconnected" }}</p>
        <p>Transport: {{ transport }}</p>
    </div>
</template>

<script setup>
import { io } from "socket.io-client";
const socket = io();

const isConnected = ref(false);
const transport = ref("N/A");
const toast = useToast();

if (socket.connected) {
    onConnect();
}

function onConnect() {
    isConnected.value = true;
    transport.value = socket.io.engine.transport.name;

    socket.io.engine.on("upgrade", (rawTransport) => {
        transport.value = rawTransport.name;
    });
}

function onDisconnect() {
    isConnected.value = false;
    transport.value = "N/A";
}

socket.on("connect", onConnect);
socket.on("disconnect", onDisconnect);

socket.on("hello", (value) => {

    console.log(value)
    toast.add({
        title: `แจ้งเตือนระดับ ${value.alertLevel}`,
        description: `ระดับน้ำสูง ${value.waterLevelM} เวลา ${value.timestamp}`,
        icon: "i-heroicons-exclamation-triangle-solid",
        timeout: 0,
    });
});

onBeforeUnmount(() => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Kanit:wght@300&display=swap");

body {
    background-color: #f7fafc;
    font-family: "Kanit", sans-serif;
}
</style>
