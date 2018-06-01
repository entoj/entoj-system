'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const chalk = require('chalk');
const minimatch = require('minimatch');
const fs = require('fs');
const now = require('performance-now');


/**
 * @class
 * @memberOf utils
 * @extends {Base}
 */
class PerformanceMetricScope extends Base
{
    /**
     * @ignore
     */
    constructor(name, parent)
    {
        super();
        this._name = name || 'root';
        this._parent = parent;
        this._items = {};
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'utils/PerformanceMetricScope';
    }


    /**
     * @let {String}
     */
    get name()
    {
        return this._name;
    }


    /**
     * @let {PerformanceMetrics}
     */
    get parent()
    {
        return this._parent;
    }


    /**
     * @let {Map}
     */
    get items()
    {
        return this._items;
    }


    /**
     * Clears all recorded timers
     */
    clear()
    {
        this._items = {};
    }


    /**
     * Renders all recorded timers to the console
     */
    show(patterns)
    {
        // eslint-disable-next-line no-console
        console.log(chalk.bold('\n' + this.name + ' Timers:'));
        for (const name in this.items)
        {
            const item = this.items[name];
            let display = true;
            if (patterns)
            {
                display = false;
                for (const pattern of patterns)
                {
                    if (item.name.includes(pattern) || minimatch(item.name, pattern))
                    {
                        display = true;
                    }
                }
            }
            if (display)
            {
                // eslint-disable-next-line no-console
                console.log(chalk.yellow(' ' + item.name));
                // eslint-disable-next-line no-console
                console.log('  count: ' + item.count + ', average: ' + item.average.toFixed(2) + ', total: ' + item.total);
            }
        }
    }


    /**
     * Saves all recorded timers to a json file.
     * If the file exists the timers will be appended
     */
    save(filename, label)
    {
        let data = [];
        if (fs.existsSync(filename))
        {
            data = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }));
        }
        data.push(
            {
                date: Date.now(),
                label: label,
                timers: this.items
            });
        fs.writeFileSync(filename, JSON.stringify(data, null, 4), { encoding: 'utf8' });
    }


    /**
     * Starts a timer
     *
     * @param {String} name
     */
    start(name)
    {
        if (!this.items[name])
        {
            this.items[name] =
            {
                name: name,
                current: 0,
                count: 0,
                total: 0,
                min: Number.MAX_VALUE,
                max: 0,
                average: 0,
            };
        }
        this.stop(name);
        if (this.parent)
        {
            this.parent.start(name);
        }
        const item = this.items[name];
        item.current = now();
    }


    /**
     * Stops a timer
     *
     * @param {String} name
     */
    stop(name)
    {
        if (this.parent)
        {
            this.parent.stop(name);
        }
        const item = this.items[name];
        if (!item || item.current == 0)
        {
            return;
        }
        const time = (now() - item.current);
        item.total+= time;
        item.count++;
        item.current = 0;
        item.min = Math.min(item.min, time);
        item.max = Math.max(item.max, time);
        item.average = item.total / item.count;
    }
}


/**
 * @class
 * @memberOf utils
 * @extends {Base}
 */
class PerformanceMetrics extends Base
{
    /**
     * @ignore
     */
    constructor(name, parent)
    {
        super();
        this._current = new PerformanceMetricScope();
        this._enabled = false;
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'utils/PerformanceMetrics';
    }


    /**
     * @let {PerformanceMetricScope}
     */
    get current()
    {
        return this._current;
    }


    /**
     * @let {Boolean}
     */
    get enabled()
    {
        return this._enabled;
    }


    /**
     * Enables performance metrics
     */
    enable(name)
    {
        this._enabled = true;
    }


    /**
     * Enables performance metrics
     */
    disable()
    {
        this._enabled = false;
    }


    /**
     * Creates a new logging scope
     *
     * @param {String} name
     */
    pushScope(name)
    {
        if (!this.enabled)
        {
            return;
        }

        this._current = new PerformanceMetricScope(name, this._current);
    }


    /**
     * Removes the top most logging scope
     */
    popScope()
    {
        if (!this.enabled)
        {
            return;
        }

        this._current = this._current.parent;
    }


    /**
     * Renders all recorded timers to the console
     */
    show(patterns)
    {
        if (!this.enabled)
        {
            return;
        }
        this.current.show(patterns);
    }


    /**
     * Renders all recorded timers to the console
     */
    save(filename, label)
    {
        if (!this.enabled)
        {
            return;
        }
        this.current.save(filename, label);
    }


    /**
     * Starts a timer
     *
     * @param {String} name
     */
    start(name)
    {
        if (!this.enabled)
        {
            return;
        }

        this.current.start(name);
    }


    /**
     * Stops a timer
     *
     * @param {String} name
     */
    stop(name)
    {
        if (!this.enabled)
        {
            return;
        }

        this.current.stop(name);
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.PerformanceMetricScope = PerformanceMetricScope;
module.exports.PerformanceMetrics = PerformanceMetrics;
module.exports.metrics = new PerformanceMetrics();
module.exports.__metrics = new PerformanceMetrics();
