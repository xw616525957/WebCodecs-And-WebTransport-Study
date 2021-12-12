import { FLVDemux, Events } from 'demuxer/dist/demuxer.flv.esm.js'

export default function () {
    const demux = new FLVDemux({
        debug: true
    })
    demux.on(Events.DEMUX_DATA, (e) => {
        console.log(e);
    
        // if (e.stream_type === 15) {
        //     console.log(e)
        // }
    })
    
    demux.on(Events.DONE, (e) => {
        // consumed & flushed all piped buffer.
    })
    
    fetch('https://pullws-live.baijiayun.com/mgclient/21112347614627-webrtc-mixstreams.flv').then(res => {
        let reader = res.body?.getReader()
        reader && process(reader)
    })
    
    async function process(reader: ReadableStreamDefaultReader<Uint8Array>) {
        let buffer = await reader.read()
        if (buffer) {
            // buffer -> video bytes ArrayBuffer
            demux.push(buffer, {
                // Support push part of the data for parsing
                // When done is set to true, if the data is decoded and there is no remaining data, the data is considered to have been pushed and Events.DONE will be emitted.
                // When done is set to false, Events.DONE will not be emit, waiting for subsequent data push
                done: false
            })
        }
        process(reader)
    }
}

/*
async function getTrack() {
    let mediastream = await navigator.mediaDevices.getUserMedia({video: true})
    return mediastream && mediastream.getVideoTracks()[0]
}

function handleChunk(chunk, metadata) {
    console.log(arguments)
}

// VideoEncoder
const init = {
    output: handleChunk,
    error: (e: Error) => {
        console.log(e.message);
    }
};

let config = {
    codec: 'vp8',
    width: 640,
    height: 480,
    bitrate: 2_000_000, // 2 Mbps
    framerate: 30,
};

let encoder = new VideoEncoder(init);
encoder.configure(config);

// VideoDecoder
function handleFrame (frame, metadata) {
    console.log('handleFrame')
}
const initDecoder = {
    output: handleFrame,
    error: (e) => {
      console.log(e.message);
    }
};
  
const configDecoder = {
    codec: 'vp8',
    codedWidth: 640,
    codedHeight: 480
};
  
let decoder = new VideoDecoder(initDecoder);
decoder.configure(configDecoder);

async function test () {
    let frame_counter = 0;
    const track = await getTrack();
    const mediaProcessor = new MediaStreamTrackProcessor(track);
    const reader = mediaProcessor.readable.getReader();
    while (true) {
        const result = await reader.read();
        if (result.done)
        break;
        let frame = result.value;
        if (encoder.encodeQueueSize > 2) {
            // Too many frames in flight, encoder is overwhelmed
            // let's drop this frame.
            frame.close();
        } else {
            frame_counter++;
            const insert_keyframe = (frame_counter % 150) == 0;
            encoder.encode(frame, { keyFrame: insert_keyframe });
            frame.close();
        }
    }
}
*/