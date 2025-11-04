const filterDefinitions = require('./filterDefinitions');
class FilterBuilder {
    constructor() {
        this.filters = [];
    }
    add(filtername, ...args) {
        const fn = filterDefinitions[filtername];
        if (!fn) {
            console.log('command not found');
            throw new Error('the presented filter command is not found');
        }
        const filter = fn(...args);
        this.filters.push(filter);
        return this; //new thing this makes it chaining
    }
    build(inputFiles = ["input.mp4"], output = "output.mp4") {
        console.log('build invoked');
        console.log(this.filters);
        let cmd = "";
        for (const input of inputFiles)
            cmd += ` -i ${input}`;

    }


}
new FilterBuilder().add('overlayImage', [20, 30, 32, 33]).add('resize', [20, 30]).build();