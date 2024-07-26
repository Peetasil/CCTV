<template>
    <!-- <div class="map-container">
        <LMap
            ref="map"
            :zoom="zoom"
            :center="center"
            @ready="mapInitialized"
        >
            <LTileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                layer-type="base"
                name="OpenStreetMap"
            />



            <LMarker :lat-lng="[station.latitude, station.longitude]" v-for="station in stations">
                <l-icon
                    :icon-size="dynamicSize"
                    icon-url="https://i.ibb.co/sQxTX9w/cctv-camera.png"
                />
                <LPopup class="font-bold">
                    <p>{{ station.code }} - {{ station.name }}</p>
                    <p>
                        ที่ตั้ง: {{ station.location }}
                    </p>
                    <p>ละติจูด: {{ station.latitude }}</p>
                    <p>ลองจิจูด: {{ station.longitude }}</p>
                    <p>สถานะ: {{ station.status ? 'ออนไลน์' : 'ออฟไลน์' }}</p>
                    <UButton class="ml-[120px]" :to="`stations/${station.code}`" color="white"
                        >View</UButton
                    >
                </LPopup>
            </LMarker>
        </LMap>
    </div> -->

    <div class="map-container">
        <div id="windy"></div>
    </div>
</template>

<script setup>
useHead({
    script: []
})

const dynamicSize = [38, 38];
onMounted(() => {
    fetchMap()
    initMap()
})

const stations = ref([]);
const fetchMap = async () => {
    const data = await $fetch("/api/v1/stations");
    stations.value = data.data;
};

const initMap = async () => {

    await loadWindyAPI();
    const windyAPI = getWindyAPI();
    const { map } = windyAPI;

    const MARKER_ICON_URL = 'https://i.ibb.co/sQxTX9w/cctv-camera.png'

    const CameraIcon = L.icon({
        iconUrl: MARKER_ICON_URL,
        iconSize: dynamicSize,
        iconAnchor: [12, 12],
        popupAnchor: [0, 0],
    });

    const markers = [];

    const updateIconStyle = () => {
        for (const marker of markers) {
            const icon = marker._icon;
            if (!icon) {
                continue;
            }
            const heading = icon.getAttribute('data-heading');
            if (icon.style.transform.indexOf('rotateZ') === -1) {
                icon.style.transform = `${
                    icon.style.transform
                } rotateZ(${heading || 0}deg)`;
                icon.style.transformOrigin = 'center';
            }
        }
    };

    try {
        let hue = 0;
        for (const station of stations.value) {
            hue = (hue + 60) % 360;
            const marker = L.marker([station.latitude, station.longitude], {
                icon: CameraIcon,
            }).addTo(map);
            markers.push(marker);
            marker._icon.setAttribute('data-heading', station.name);
            marker.bindPopup(`<div  class="font-bold flex flex-col">
                    <p class="!m-0 !mb-2">${station.code} - ${station.name}</p>
                    <p class="!m-0 !mb-2">
                        ที่ตั้ง: ${station.location }
                    </p>
                    <p class="!m-0">ละติจูด: ${ station.latitude }</p>
                    <p class="!m-0">ลองจิจูด: ${ station.longitude }</p>
                    <p class="!m-0 !mb-2">สถานะ: ${ station.status ? 'ออนไลน์' : 'ออฟไลน์' }</p>
                    <a class="self-center" href="stations/${station.code}" color="white">ดูรายละเอียด</a>
                </div>
            `)

            updateIconStyle();
        }
    } catch (error) {
        console.error(`Error querying boats: ${error.message}`);
    }
    map.on('zoom', updateIconStyle);
    map.on('zoomend', updateIconStyle);
    map.on('viewreset', updateIconStyle);
}

</script>

<style scoped>

#windy {
    width: 100%;
    height: 650px;
}

.map-container {
    display: flex;
    justify-content: center;
    padding: 2rem;
    margin: 0 auto;
    max-width: 1700px;
    width: 100%;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
}
</style>
