const { spawn } = require('node:child_process')
const filters = require('./filterBuilder');
const { exitCode } = require('node:process');
function runAIChain(input, output, aiFilters) {
    //this method changes the code into the resizeFilter(args) to be built into native command by filterBuilder function
    let unknownCommand = false;
    const built = aiFilters.map(f => {
        if (f.command == "no command found") {
            unknownCommand = true;
            console.log("oops we dont have this feature developed yet please raise a support ticket to handle this request");
        }
        else { filters[f.command](...f.args); }
    });

    const ffArgs = ['-i', input, ...filters.buildFilters(built), output];
    const process = spawn('ffmpeg', ffArgs);
    process.on('close', exitCode => console.log(`process exited with code ${exitCode}`))
}
runAIChain('codeMate.mp4', 'output.mp4',
    [{ command: 'resizeFilter', args: [1280, 720] },
    { command: 'adjustSaturationFilter', args: [7] },
    { command: 'increaseVolumeFilter', args: [1.5] }]);
