const commandTemplates = {

    compress: (input, output, crf = 28) =>
        ['-i', input, '-vcodec', 'libx264', '-crf', String(crf), output],

    resize: (input, output, width, height) =>
        ['-i', input, '-vf', `scale=${width}:${height},setsar=1`, output],

    changeAspectRatio: (input, output, width, height) =>
        ['-i', input, '-vf', `scale=${width}:${height},setsar=1`, output],

    extractAudio: (input, output) =>
        ['-i', input, '-q:a', '0', '-map', 'a', output],

    // ✅ Cutting and trimming
    cutByTime: (input, output, start, duration) =>
        ['-ss', String(start), '-i', input, '-t', String(duration), '-c:v', 'copy', '-c:a', 'copy', output],

    trimExact: (input, output, start, end) =>
        ['-i', input, '-vf', `trim=start=${start}:end=${end},setpts=PTS-STARTPTS`,
            '-af', `atrim=start=${start}:end=${end},asetpts=PTS-STARTPTS`, output],

    // ✅ Audio controls
    increaseVolume: (input, output, factor = 2.0) =>
        ['-i', input, '-filter:a', `volume=${factor}`, output],

    decreaseVolume: (input, output, factor = 0.5) =>
        ['-i', input, '-filter:a', `volume=${factor}`, output],

    // ✅ Color and tone adjustments
    adjustSaturation: (input, output, saturation = 1.5, gamma = 1.0) =>
        ['-i', input, '-vf', `eq=saturation=${saturation}:gamma=${gamma}`, output],

    adjustHue: (input, output, hue = 0.5, saturation = 1.0) =>
        ['-i', input, '-vf', `hue=h=${hue}:s=${saturation}`, output],

    // ✅ Overlay & merging
    overlayImage: (input, overlay, output, x = 0, y = 0) =>
        ['-i', input, '-i', overlay, '-filter_complex', `overlay=${x}:${y}`, '-codec:a', 'copy', output],

    mergeTopBottom: (top, bottom, output) =>
        ['-i', top, '-i', bottom, '-filter_complex',
            '[0:v]pad=iw:ih*2[top];[top][1:v]overlay=0:ih', '-c:v', 'libx264', output],

    // ✅ Transitions
    crossfade: (video1, video2, output, duration = 1, offset = 4) =>
        ['-i', video1, '-i', video2, '-filter_complex',
            `[0][1]xfade=transition=fade:duration=${duration}:offset=${offset}`, output],

    // ✅ Subtitles and captions
    burnSrt: (input, output, srtFile) =>
        ['-i', input, '-vf', `subtitles=${srtFile}`, '-c:a', 'copy', output],

    burnSrtStyled: (input, output, srtFile, fontSize = 30, color = '&H00FFFF&') =>
        ['-i', input, '-vf',
            `subtitles=${srtFile}:force_style='Fontsize=${fontSize},PrimaryColour=${color},OutlineColour=&H000000&'`,
            '-c:a', 'copy', output],

    burnAss: (input, output, assFile) =>
        ['-i', input, '-vf', `ass=${assFile}`, '-c:a', 'copy', output],

    drawTextCaption: (input, output, text, font, size = 48, color = 'white') =>
        ['-i', input, '-vf',
            `drawtext=text='${text}':fontfile='${font}':fontsize=${size}:fontcolor=${color}:x=(w-text_w)/2:y=h-100:box=1:boxcolor=black@0.5`,
            '-c:a', 'copy', output],

    animateText: (input, output, text, font, size = 48, color = 'white') =>
        ['-i', input, '-vf',
            `drawtext=text='${text}':fontfile='${font}':fontsize=${size}:fontcolor=${color}:x=(w-text_w)/2:y=h-100-(t*50):box=1:boxcolor=black@0.4`,
            '-c:a', 'copy', output],

    // ✅ Stabilization (since your build supports vidstab)
    stabilizePass1: (input) =>
        ['-i', input, '-vf', 'vidstabdetect=shakiness=10:accuracy=15', '-f', 'null', '-'],

    stabilizePass2: (input, output) =>
        ['-i', input, '-vf', 'vidstabtransform=smoothing=30', output],

    // ✅ GPU acceleration (optional)
    gpuEncode: (input, output, codec = 'h264_nvenc') =>
        ['-hwaccel', 'cuda', '-i', input, '-c:v', codec, '-preset', 'fast', output],


    changeBitrate: (input, output, bitrate = '2M') =>
        ['-i', input, '-b:v', bitrate, output]
};

module.exports = commandTemplates; 