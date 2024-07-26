<template>
    <div>
        <div class="flex justify-center text-black font-semibold text-4xl mt-5">
            <div class="text-orange-500">
                ==========================================&nbsp;&nbsp;
            </div>
            <p>Station Detail</p>
            <div class="text-orange-500">
                &nbsp;&nbsp;==========================================
            </div>
        </div>
        <div class="flex justify-center">
            <div class="border-2 bg-white border-black p-10 w-[1300px] rounded-xl py-8 mt-10">
                <div class="text-black font-bold text-4xl text-center my-2">
                    <p>{{ station.code }} - {{ station.name }}</p>
                </div>
                <div class=" text-black text-xl mb-5 ">
                    <div class="flex items-center justify-center gap-2">
                        <div>สถานะ </div> 
                        <div class="rounded-full block w-5 h-5" :class="{ 'bg-red-600': cameraStatus.alertLevel == 'DANGER', 'bg-orange-500': cameraStatus.alertLevel == 'WARNING', 'bg-green-400': cameraStatus.alertLevel == 'NORMAL'}"></div> 
                    </div>
                    <div class="text-sm text-center">เวลา {{ cameraStatus.timestamp }}</div>
                </div>
                
                <iframe src="https://live.server97.cloud/stream.html?src=poccam" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen frameborder="0" class="w-full h-[500px] mb-4"></iframe>
                <!-- <div class="flex justify-between">
                    <div>
                        <div>Play back</div>
                        <UPopover :popper="{ placement: 'bottom-start' }">
                            <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(date, 'd MMM, yyy')" />
                            <template #panel="{ close }">
                                <DatePicker v-model="date" is-required @close="close" />
                            </template>
                        </UPopover>
                    </div>
                    <div>
                        <div>Search</div>
                        <UPopover :popper="{ placement: 'bottom-start' }">
                            <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(date, 'd MMM, yyy')" />
                            <template #panel="{ close }">
                                <DatePicker v-model="date" is-required @close="close" />
                            </template>
                        </UPopover>
                    </div>
                    <div>
                        <div>Save</div>
                        <UPopover :popper="{ placement: 'bottom-start' }">
                            <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(date, 'd MMM, yyy')" />
                            <template #panel="{ close }">
                                <DatePicker v-model="date" is-required @close="close" />
                            </template>
                        </UPopover>
                    </div>
                </div> -->
             
                <div class="mt-10 text-black ">
                    <div><span class="text-black font-semibold  text-xl">ระดับน้ำปัจจุบัน :</span> {{ cameraStatus.waterLevelM }}</div>
                    <div><span class="text-black font-semibold  text-xl">ที่ตั้ง :</span> {{ station.location }}</div> 
                    <div><span class="text-black font-semibold  text-xl">ละติจูด :</span> {{ station.latitude }}</div> 
                    <div><span class="text-black font-semibold  text-xl">ลองจิจูด :</span> {{ station.longitude }}</div> 
                    <div><span class="text-black font-semibold  text-xl">สถานะ :</span> {{ station.status ? 'ออนไลน์' : 'ออฟไลน์' }}</div> 
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";
const date = ref(new Date());
const date2 = ref(new Date());
const date3 = ref(new Date());
const route = useRoute();
const station = ref<any>({
    status: ''
});
import { io } from "socket.io-client";
const socket = io();

const isConnected = ref(false);
const transport = ref("N/A");
const toast = useToast();
const cameraStatus = ref({
    waterLevelM: '0',
    timestamp: format(new Date(), 'yyyy-MM-dd HH:mm'),
    alertLevel: 'NORMAL'
});


const fetchStationData = async () => {
    try {
        const response = await $fetch(`/api/v1/stations/${route.params.id}`);
        station.value = response;
    } catch (error) {
        console.error("Error fetching station data:", error);
    }
};
onMounted(() => {
    fetchStationData();
});


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

    cameraStatus.value = value;

    if(value.alertLevel === 'DANGER'){
        toast.add({
            title: `แจ้งเตือนระดับ ${value.alertLevel}`,
            description: `ระดับน้ำสูง ${value.waterLevelM} เวลา ${value.timestamp}`,
            icon: "i-heroicons-exclamation-triangle-solid",
            timeout: 59000,
            color: "red"
        });
    }
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
