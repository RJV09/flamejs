const chalk = require('chalk');

module.exports = class Logger {
    static log(content, type = 'log') {
        const watermark = `[${chalk.hex('#FF6F61')('FLAME 5.0')}] ||•`;
        const timestamp = chalk.gray(`[${new Date().toISOString()}]`);
        
        const baseLog = (level, color) => {
            return console.log(
                `${timestamp} ${watermark} ${chalk.bold.hex('#3B3B3B')('>>>')} ${chalk[color](`[${level}]`)} ${content}`
            );
        };

        switch (type) {
            case 'log': {
                return baseLog('Info', 'green');
            }
            case 'warn': {
                return baseLog('Warn', 'yellow');
            }
            case 'error': {
                return baseLog('Error', 'red');
            }
            case 'debug': {
                return baseLog('Debug', 'magenta');
            }
            case 'event': {
                return baseLog('Event', 'cyan');
            }
            case 'cmd': {
                return baseLog('Cmd', 'green');
            }
            case 'ready': {
                return baseLog('Ready', 'blue');
            }
            case 'shard': {
                return baseLog('Shard', 'white');
            }
        }
    }

    static error(content) {
        return this.log(content, 'error');
    }

    static warn(content) {
        return this.log(content, 'warn');
    }

    static debug(content) {
        return this.log(content, 'debug');
    }

    static cmd(content) {
        return this.log(content, 'cmd');
    }

    static event(content) {
        return this.log(content, 'event');
    }

    static ready(content) {
        return this.log(content, 'ready');
    }

    static shard(content) {
        return this.log(content, 'shard');
    }
};
