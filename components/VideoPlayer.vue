<template>
    <video ref="videoPlayer" class="video-js" controls preload="auto">
        <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
    </video>

</template>

<script setup>
import videojs from 'video.js';
import 'video.js/dist/video-js.css' // videoJs Quality levels **
//import 'video.js/dist/lang/th.js'



const props = defineProps(['options'])
const videoPlayer = ref()

onMounted(() => {
    initPlayer()
});     
const initPlayer = () => {
    const player = videojs(videoPlayer.value, props.options, () => {
        player.log('onPlayerReady', player);
    });
    

}

</script>

<style lang="scss" scoped>
.main-preview-player {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.video-js,
.playlist-container {
  position: relative;
  min-width: 300px;
  min-height: 150px;
  height: 0;
}

.video-js {
  flex: 3 1 70%;
}

.playlist-container {
  flex: 1 1 30%;
}

.vjs-playlist {
  margin: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.vjs-progress-control {
  display: none;
}
</style>