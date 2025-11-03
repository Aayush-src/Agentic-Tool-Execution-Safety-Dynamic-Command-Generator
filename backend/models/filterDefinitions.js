const Filter = require('./filter');
export const filterDefinitions = {

    resize: (width, height) =>
        new Filter('video', `scale=${width}:${height},setsar=1`, { width, height }),

    crop: (w, h, x, y) =>
        new Filter('video', `crop=${w}:${h}:${x}:${y}`, { w, h, x, y }),

    rotate: (angle = 90) =>
        new Filter('video', `rotate=${angle}*PI/180`, { angle }),

    flip: () =>
        new Filter('video', `vflip`),

    mirror: () =>
        new Filter('video', `hflip`),

    speed: (factor = 1.25) =>
        new Filter('video', `setpts=${1 / factor}*PTS`, { factor }),

    reverse: () =>
        new Filter('video', `reverse`),

    fps: (fps = 30) =>
        new Filter('video', `fps=${fps}`, { fps }),

    pad: (width, height, x = "(ow-iw)/2", y = "(oh-ih)/2", color = "black") =>
        new Filter('video', `pad=${width}:${height}:${x}:${y}:${color}`, { width, height, color }),

    trim: (start, end) =>
        new Filter('video', `trim=start=${start}:end=${end},setpts=PTS-STARTPTS`, { start, end }),

    // 🎨 COLOR & EFFECTS
    brightness: (value = 0.1) =>
        new Filter('video', `eq=brightness=${value}`, { value }),

    contrast: (value = 1.5) =>
        new Filter('video', `eq=contrast=${value}`, { value }),

    saturation: (value = 1.5) =>
        new Filter('video', `eq=saturation=${value}`, { value }),

    hue: (saturation = 1.0, brightness = 0) =>
        new Filter('video', `hue=s=${saturation}:b=${brightness}`, { saturation, brightness }),

    gamma: (gamma = 1.2) =>
        new Filter('video', `eq=gamma=${gamma}`, { gamma }),

    exposure: (ev = 0.5) =>
        new Filter('video', `eq=brightness=${ev}`, { ev }),

    vignette: () =>
        new Filter('video', `vignette`),

    blur: (amount = 5) =>
        new Filter('video', `boxblur=${amount}`, { amount }),

    sharpen: (luma = 2.0) =>
        new Filter('video', `unsharp=luma_msize_x=7:luma_msize_y=7:luma_amount=${luma}`, { luma }),

    grayscale: () =>
        new Filter('video', `format=gray`),

    denoise: () =>
        new Filter('video', `hqdn3d`),

    // 📝 TEXT & OVERLAYS
    drawText: (text, fontFile, size = 48, color = 'white', x = "(w-text_w)/2", y = "h-100") =>
        new Filter(
            'video',
            `drawtext=text='${text}':fontfile='${fontFile}':fontsize=${size}:fontcolor=${color}:x=${x}:y=${y}:box=1:boxcolor=black@0.5`,
            { text, fontFile, size, color }
        ),

    animateText: (text, fontFile, size = 48, color = 'white') =>
        new Filter(
            'video',
            `drawtext=text='${text}':fontfile='${fontFile}':fontsize=${size}:fontcolor=${color}:x=(w-text_w)/2:y=h-100-(t*50):box=1:boxcolor=black@0.4`,
            { text, fontFile, size, color }
        ),

    overlayImage: (x = 0, y = 0) =>
        new Filter('complex', `[1:v]overlay=${x}:${y}`, { x, y }),

    watermark: (path, x = "W-w-10", y = "H-h-10") =>
        new Filter('complex', `[1:v]scale=100:-1[wm];[0:v][wm]overlay=${x}:${y}`, { path, x, y }),

    // 🔊 AUDIO FILTERS
    volume: (amount = 1.5) =>
        new Filter('audio', `volume=${amount}`, { amount }),

    fadeInAudio: (start = 0, duration = 2) =>
        new Filter('audio', `afade=t=in:st=${start}:d=${duration}`, { start, duration }),

    fadeOutAudio: (start = 0, duration = 2) =>
        new Filter('audio', `afade=t=out:st=${start}:d=${duration}`, { start, duration }),

    speedAudio: (factor = 1.25) =>
        new Filter('audio', `atempo=${factor}`, { factor }),

    equalizer: (freq = 1000, width = 2, gain = 2) =>
        new Filter('audio', `equalizer=f=${freq}:width_type=o:width=${width}:g=${gain}`, { freq, width, gain }),

    pan: (layout = "stereo|c0=0.5*c0+0.5*c1|c1=0.5*c0+0.5*c1") =>
        new Filter('audio', `pan=${layout}`, { layout }),

    mute: () =>
        new Filter('audio', `volume=0`),

    normalize: () =>
        new Filter('audio', `loudnorm`),

    // 🎬 TRANSITIONS (complex)
    crossfade: (video2Path, duration = 1, offset = 4) =>
        new Filter('complex', `[0][1]xfade=transition=fade:duration=${duration}:offset=${offset}`, { video2Path, duration, offset }),

    slideTransition: (video2Path, duration = 1, offset = 4) =>
        new Filter('complex', `[0][1]xfade=transition=slideleft:duration=${duration}:offset=${offset}`, { video2Path, duration, offset }),

    wipeTransition: (video2Path, duration = 1, offset = 4) =>
        new Filter('complex', `[0][1]xfade=transition=wiperight:duration=${duration}:offset=${offset}`, { video2Path, duration, offset }),
    concat: (n = 2) =>
        new Filter('complex', `concat=n=${n}:v=1:a=1`, { n }),
};
