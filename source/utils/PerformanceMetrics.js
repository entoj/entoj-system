'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const chalk = require('chalk');



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
     * @let {PerformanceMetrics}
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
    show()
    {
        /* eslint no-console:0 */
        console.log(chalk.bold('\n' + this.name + ' Timers:'));
        for (const name in this.items)
        {
            const item = this.items[name];
            console.log(chalk.yellow(' ' + item.name));
            console.log('  count: ' + item.count + ', total: ' + item.total + ', average: ' + item.average.toFixed(2));
        }
        /* eslint no-console:1 */
    }


    /**
     * Starts a timer
     *
     * @param {String} name
     */
    start(name)
    {
        if (this.parent)
        {
            this.parent.start(name);
        }
        if (!this.items[name])
        {
            this.items[name] =
            {
                name: name,
                current: 0,
                count: 0,
                total: 0,
                min: 0,
                max: 0,
                average: 0
            };
        }
        this.stop(name);
        const item = this.items[name];
        item.current = Date.now();
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
        const time = (Date.now() - item.current);
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
     *
     */
    pushScope(name)
    {
        this._current = new PerformanceMetricScope(name, this._current);
    }


    /**
     *
     */
    popScope()
    {
        this.show();
        this._current = this._current.parent;
    }


    /**
     * Renders all recorded timers to the console
     */
    show()
    {
        /* eslint no-console:0 */
        this._current.show();
        /* eslint no-console:1 */
    }


    /**
     * Starts a timer
     *
     * @param {String} name
     */
    start(name)
    {
        this._current.start(name);
    }


    /**
     * Stops a timer
     *
     * @param {String} name
     */
    stop(name)
    {
        this._current.stop(name);
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.PerformanceMetricScope = PerformanceMetricScope;
module.exports.PerformanceMetrics = PerformanceMetrics;
module.exports.metrics = new PerformanceMetrics();
