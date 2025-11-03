const filterBuilder = {
    // 🎞️ VIDEO FILTERS
    resizeFilter: (width, height) => ({
        type: 'video',
        cmd: `scale=${width}:${height},setsar=1`
    }),

    changeAspectRatioFilter: (width, height) => ({
        type: 'video',
        cmd: `scale=${width}:${height},setsar=1`
    }),

    adjustSaturationFilter: (saturation = 1.5, gamma = 1.0) => ({
        type: 'video',
        cmd: `eq=saturation=${saturation}:gamma=${gamma}`
    }),

    adjustHueFilter: (hue = 0.5, saturation = 1.0) => ({
        type: 'video',
        cmd: `hue=h=${hue}:s=${saturation}`
    }),

    drawTextFilter: (text, font, size = 48, color = 'white') => ({
        type: 'video',
        cmd: `drawtext=text='${text}':fontfile='${font}':fontsize=${size}:fontcolor=${color}:x=(w-text_w)/2:y=h-100:box=1:boxcolor=black@0.5`
    }),

    animateTextFilter: (text, font, size = 48, color = 'white') => ({
        type: 'video',
        cmd: `drawtext=text='${text}':fontfile='${font}':fontsize=${size}:fontcolor=${color}:x=(w-text_w)/2:y=h-100-(t*50):box=1:boxcolor=black@0.4`
    }),

    burnSrtFilter: (srtFile) => ({
        type: 'video',
        cmd: `subtitles=${srtFile}`
    }),

    burnSrtStyledFilter: (srtFile, fontSize = 30, color = '&H00FFFF&') => ({
        type: 'video',
        cmd: `subtitles=${srtFile}:force_style='Fontsize=${fontSize},PrimaryColour=${color},OutlineColour=&H000000&'`
    }),

    burnAssFilter: (assFile) => ({
        type: 'video',
        cmd: `ass=${assFile}`
    }),

    stabilizeFilter: () => ({
        type: 'video',
        cmd: `vidstabtransform=smoothing=30`
    }),

    trimFilter: (start, end) => ({
        type: 'video',
        cmd: `trim=start=${start}:end=${end},setpts=PTS-STARTPTS`
    }),

    // 🔊 AUDIO FILTERS
    increaseVolumeFilter: (factor = 2.0) => ({
        type: 'audio',
        cmd: `volume=${factor}`
    }),

    decreaseVolumeFilter: (factor = 0.5) => ({
        type: 'audio',
        cmd: `volume=${factor}`
    }),

    audioTrimFilter: (start, end) => ({
        type: 'audio',
        cmd: `atrim=start=${start}:end=${end},asetpts=PTS-STARTPTS`
    }),

    overlayImageFilter: (overlayPath, x = 0, y = 0) => ({
        type: 'complex',
        cmd: `overlay=${x}:${y}`,
        extraInputs: [overlayPath]
    }),

    mergeTopBottomFilter: (bottomPath) => ({
        type: 'complex',
        cmd: `[0:v]pad=iw:ih*2[top];[top][1:v]overlay=0:ih`,
        extraInputs: [bottomPath]
    }),

    crossfadeFilter: (video2Path, duration = 1, offset = 4) => ({
        type: 'complex',
        cmd: `[0][1]xfade=transition=fade:duration=${duration}:offset=${offset}`,
        extraInputs: [video2Path]
    }),

    buildFilters(filters = []) {
        const videoFilters = filters.filter(f => f.type === 'video').map(f => f.cmd);
        const audioFilters = filters.filter(f => f.type === 'audio').map(f => f.cmd);
        const complexFilters = filters.filter(f => f.type === 'complex');

        const args = [];

        // Handle complex filters first
        if (complexFilters.length) {
            const inputArgs = complexFilters.flatMap(f => f.extraInputs?.map(i => ['-i', i]) || []);
            const complexCmd = complexFilters.map(f => f.cmd).join(',');
            args.push(...inputArgs.flat(), '-filter_complex', complexCmd);
            return args;
        }

        // Handle video + audio filters (normal case)
        if (videoFilters.length) args.push('-vf', videoFilters.join(','));
        if (audioFilters.length) args.push('-af', audioFilters.join(','));

        return args;
    }
};

module.exports = filterBuilder;
