//class which is used to keep the definition of filter constant 
class Filter {
    constructor(name, type, cmd, args = []) {
        this.name = name;
        this.type = type;
        this.cmd = cmd;
        this.args = args;
    }
    build() {
        return this.cmd;
    }

}
module.exports = Filter;