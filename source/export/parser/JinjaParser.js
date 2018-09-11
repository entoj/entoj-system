'use strict';

/**
 * Requirements
 * @ignore
 */
const Parser = require('../Parser.js').Parser;
const nunjucks = require('nunjucks');
const unique = require('lodash.uniq');
const TextNode = require('../ast/TextNode.js').TextNode;
const SetNode = require('../ast/SetNode.js').SetNode;
const IfNode = require('../ast/IfNode.js').IfNode;
const ElseIfNode = require('../ast/ElseIfNode.js').ElseIfNode;
const ForNode = require('../ast/ForNode.js').ForNode;
const VariableNode = require('../ast/VariableNode.js').VariableNode;
const ArgumentNode = require('../ast/ArgumentNode.js').ArgumentNode;
const ParameterNode = require('../ast/ParameterNode.js').ParameterNode;
const ExpressionNode = require('../ast/ExpressionNode.js').ExpressionNode;
const LiteralNode = require('../ast/LiteralNode.js').LiteralNode;
const OperandNode = require('../ast/OperandNode.js').OperandNode;
const BooleanOperandNode = require('../ast/BooleanOperandNode.js').BooleanOperandNode;
const ConditionNode = require('../ast/ConditionNode.js').ConditionNode;
const GroupNode = require('../ast/GroupNode.js').GroupNode;
const FilterNode = require('../ast/FilterNode.js').FilterNode;
const NodeList = require('../ast/NodeList.js').NodeList;
const MacroNode = require('../ast/MacroNode.js').MacroNode;
const CallNode = require('../ast/CallNode.js').CallNode;
const OutputNode = require('../ast/OutputNode.js').OutputNode;
const YieldNode = require('../ast/YieldNode.js').YieldNode;
const ComplexVariableNode = require('../ast/ComplexVariableNode.js').ComplexVariableNode;
const ArrayNode = require('../ast/ArrayNode.js').ArrayNode;
const BlockNode = require('../ast/BlockNode.js').BlockNode;
const TagNode = require('../ast/TagNode.js').TagNode;
const FunctionCallNode = require('../ast/FunctionCallNode.js').FunctionCallNode;
const activateEnvironment = require('../../utils/string.js').activateEnvironment;
const co = require('co');

/**
 * Jinja Template Parser
 */
class JinjaParser extends Parser {
    /**
     * @ignore
     */
    constructor(tags) {
        super();

        // Assign options
        this._tags = tags || [];
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: ['export.parser/JinjaParser.tags'] };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'export.parser/JinjaParser';
    }

    /**
     * @type {Array}
     */
    get tags() {
        return this._tags;
    }

    /**
     * var or var.property
     *
     * @protected
     * @param {export.ast.Node}
     */
<<<<<<< HEAD
    parseVariable(node)
    {
        const parse = (node, context) =>
        {
=======
    parseVariable(node) {
        const parse = (node) => {
>>>>>>> chore: reformat all source files
            const type = Object.getPrototypeOf(node).typename;
            const result = [];
            switch (type) {
                case 'Symbol':
                    if (context && context == 'LookupVal')
                    {
                        result.push('$' + node.value);
                    }
                    else
                    {
                        result.push(node.value);
                    }
                    break;

                case 'Literal':
                    result.push(node.value);
                    break;

                case 'LookupVal':
                    Array.prototype.push.apply(result, parse(node.target));
                    Array.prototype.push.apply(result, parse(node.val, type));
                    break;

                /* istanbul ignore next */
                default:
                    this.logger.error(
                        'parseVariable: Not Implemented',
                        type,
                        JSON.stringify(node, null, 4)
                    );
            }
            return result;
        };

        return new VariableNode({ fields: parse(node, true) });
    }

    /**
     * something|filter or something|filter(param)
     *
     * @protected
     * @param {export.ast.Node}
     */
    parseFilter(node) {
        const parse = (node) => {
            let result;
            const type = Object.getPrototypeOf(node).typename;
            if (type === 'Filter') {
                result = new FilterNode({
                    name: node.name.value,
                    value: parse(node.args.children[0])
                });
                if (node.args.children.length > 1) {
                    for (let i = 1; i < node.args.children.length; i++) {
                        result.arguments.push(
                            new ParameterNode({
                                value: this.parseExpression(node.args.children[i])
                            })
                        );
                    }
                }
            } else {
                result = this.parseNode(node);
            }
            return result;
        };

        return parse(node);
    }

    /**
     * (variable, 'literal', name=value)
     *
     * @protected
     * @param {export.ast.Node}
     */
    parseArguments(node) {
        const parse = (node, current) => {
            const type = Object.getPrototypeOf(node).typename;
            const result = current ? current : [];
            switch (type) {
                case 'NodeList':
                case 'KeywordArgs':
                    for (const child of node.children) {
                        parse(child, result);
                    }
                    break;

                case 'Pair':
                    if (node.key.value !== 'caller') {
                        result.push(
                            new ArgumentNode({
                                name: node.key.value,
                                value: this.parseExpression(node.value)
                            })
                        );
                    }
                    break;

                case 'Symbol':
                    result.push(new ArgumentNode({ value: this.parseVariable(node) }));
                    break;

                case 'Literal':
                    result.push(
                        new ArgumentNode({ value: new LiteralNode({ value: node.value }) })
                    );
                    break;

                case 'LookupVal':
                    result.push(new ArgumentNode({ value: this.parseExpression(node) }));
                    break;

                /* istanbul ignore next */
                default:
                    this.logger.error(
                        'parseArguments: Not Implemented',
                        type,
                        JSON.stringify(node, null, 4)
                    );
            }
            return result;
        };

        return parse(node);
    }

    /**
     * (variable, name='literal')
     *
     * @protected
     * @param {export.ast.Node}
     */
    parseParameters(node) {
        const parse = (node, current) => {
            const type = Object.getPrototypeOf(node).typename;
            const result = current ? current : [];
            switch (type) {
                case 'NodeList':
                case 'KeywordArgs':
                    for (const child of node.children) {
                        parse(child, result);
                    }
                    break;

                case 'Pair':
                    if (node.key.value !== 'caller') {
                        result.push(
                            new ParameterNode({
                                name: node.key.value,
                                value: this.parseExpression(node.value, 'parameter')
                            })
                        );
                    }
                    break;

                case 'Symbol':
                    result.push(new ParameterNode({ name: node.value }));
                    break;

                case 'LookupVal':
                    result.push(new ParameterNode({ value: this.parseExpression(node) }));
                    break;

                /* istanbul ignore next */
                default:
                    this.logger.error(
                        'parseParameters: Not Implemented',
                        type,
                        JSON.stringify(node, null, 4)
                    );
            }
            return result;
        };

        return parse(node);
    }

    /**
     * caller()
     */
    parseYield(node) {
        let result = false;
        const parse = (node) => {
            const type = Object.getPrototypeOf(node).typename;
            switch (type) {
                case 'NodeList':
                case 'KeywordArgs':
                    for (const child of node.children) {
                        parse(child);
                    }
                    break;

                case 'Pair':
                    if (node.key.value === 'caller' && node.value.body) {
                        result = [this.parseNode(node.value.body)];
                    }
                    break;
            }
        };

        parse(node);
        return result;
    }

    /**
     * This will only work for static json like structures
     *
     * @protected
     * @param {export.ast.Node}
     */
    parseComplexVariable(node) {
        const parse = (node, result) => {
            const type = Object.getPrototypeOf(node).typename;
            switch (type) {
                case 'NodeList':
                case 'Dict':
                    result = {};
                    for (const child of node.children) {
                        parse(child, result);
                    }
                    return result;

                case 'Array':
                    result = [];
                    for (const child of node.children) {
                        result.push(parse(child));
                    }
                    return result;

                case 'Symbol':
                    return new VariableNode({ fields: [node.value] });

                case 'Literal':
                    return node.value;

                case 'Pair':
                    if (result) {
                        result[node.key.value] = parse(node.value);
                    } else {
                        return parse(node.value);
                    }
                    break;

                case 'LookupVal':
                    return this.parseVariable(node);

                case 'Filter':
                    return this.parseFilter(node);

                /* istanbul ignore next */
                default:
                    this.logger.error(
                        'parseComplexVariable: Not Implemented',
                        type,
                        JSON.stringify(node, null, 4)
                    );
            }
            return undefined;
        };
        return new ComplexVariableNode({ value: parse(node) });
    }

    /**
     * 'literal' == variable or something|filter and (!model.copy)
     *
     * @protected
     * @param {export.ast.Node}
     */
    parseCondition(node) {
        const parse = (node, result) => {
            const type = Object.getPrototypeOf(node).typename;
            result = result || [];
            switch (type) {
                case 'Group':
                    const group = new GroupNode();
                    for (const child of node.children) {
                        group.children.push.apply(group.children, parse(child));
                    }
                    result.push(group);
                    break;

                case 'Literal':
                    result.push(new LiteralNode({ value: node.value }));
                    break;

                case 'LookupVal':
                    result.push(this.parseVariable(node));
                    break;

                case 'Symbol':
                    result.push(new VariableNode({ fields: [node.value] }));
                    break;

                case 'Compare':
                    parse(node.expr, result);
                    for (const op of node.ops) {
                        parse(op, result);
                    }
                    break;

                case 'Add':
                    parse(node.left, result);
                    result.push(new OperandNode({ value: '+' }));
                    parse(node.right, result);
                    break;

                case 'Sub':
                    parse(node.left, result);
                    result.push(new OperandNode({ value: '-' }));
                    parse(node.right, result);
                    break;

                case 'Mul':
                    parse(node.left, result);
                    result.push(new OperandNode({ value: '*' }));
                    parse(node.right, result);
                    break;

                case 'Mod':
                    parse(node.left, result);
                    result.push(new OperandNode({ value: '%' }));
                    parse(node.right, result);
                    break;

                case 'Div':
                    parse(node.left, result);
                    result.push(new OperandNode({ value: '/' }));
                    parse(node.right, result);
                    break;

                case 'CompareOperand':
                    result.push(new OperandNode({ value: node.type }));
                    parse(node.expr, result);
                    break;

                case 'Not':
                    result.push(new BooleanOperandNode({ value: 'not' }));
                    parse(node.target, result);
                    break;

                case 'Or':
                    parse(node.left, result);
                    result.push(new BooleanOperandNode({ value: 'or' }));
                    parse(node.right, result);
                    break;

                case 'And':
                    parse(node.left, result);
                    result.push(new BooleanOperandNode({ value: 'and' }));
                    parse(node.right, result);
                    break;

                case 'Filter':
                    result.push(this.parseFilter(node));
                    break;

                case 'FunCall':
                    result.push(
                        new FunctionCallNode({
                            name: node.name.value
                                ? new VariableNode({ fields: [node.name.value] })
                                : this.parseVariable(node.name),
                            arguments: this.parseArguments(node.args)
                        })
                    );
                    break;

                /* istanbul ignore next */
                default:
                    this.logger.error(
                        'parseCondition: Not Implemented',
                        type,
                        JSON.stringify(node, null, 4)
                    );
            }

            return result;
        };

        return new ConditionNode({ children: parse(node) });
    }

    /**
     * 'literal' + model.copy + (1 - 2)
     *
     * @protected
     * @param {export.ast.Node}
     */
    parseExpression(node) {
        const parse = (node, result) => {
            result = result || [];
            const type = Object.getPrototypeOf(node).typename;
            switch (type) {
                case 'Group':
                    const group = new GroupNode();
                    for (const child of node.children) {
                        group.children.push.apply(group.children, parse(child));
                    }
                    result.push(group);
                    break;

                case 'Add':
                    parse(node.left, result);
                    result.push(new OperandNode({ value: '+' }));
                    parse(node.right, result);
                    break;

                case 'Sub':
                    parse(node.left, result);
                    result.push(new OperandNode({ value: '-' }));
                    parse(node.right, result);
                    break;

                case 'Mul':
                    parse(node.left, result);
                    result.push(new OperandNode({ value: '*' }));
                    parse(node.right, result);
                    break;

                case 'Div':
                    parse(node.left, result);
                    result.push(new OperandNode({ value: '/' }));
                    parse(node.right, result);
                    break;

                case 'Mod':
                    parse(node.left, result);
                    result.push(new OperandNode({ value: '%' }));
                    parse(node.right, result);
                    break;

                case 'Not':
                    result.push(new BooleanOperandNode({ value: 'not' }));
                    parse(node.target, result);
                    break;

                case 'Or':
                    parse(node.left, result);
                    result.push(new BooleanOperandNode({ value: 'or' }));
                    parse(node.right, result);
                    break;

                case 'And':
                    parse(node.left, result);
                    result.push(new BooleanOperandNode({ value: 'and' }));
                    parse(node.right, result);
                    break;

                case 'Literal':
                    result.push(new LiteralNode({ value: node.value }));
                    break;

                case 'Symbol':
                case 'LookupVal':
                    result.push(this.parseVariable(node));
                    break;

                case 'Dict':
                case 'Array':
                    result.push(this.parseComplexVariable(node));
                    break;

                case 'Filter':
                    result.push(this.parseFilter(node));
                    break;

                case 'InlineIf':
                    result.push(
                        new IfNode({
                            condition: this.parseCondition(node.cond),
                            children: [new ExpressionNode({ children: parse(node.body) })],
                            elseChildren: [new ExpressionNode({ children: parse(node.else_) })]
                        })
                    );
                    break;

                case 'FunCall':
                    result.push(
                        new FunctionCallNode({
                            name: node.name.value
                                ? new VariableNode({ fields: [node.name.value] })
                                : this.parseVariable(node.name),
                            arguments: this.parseArguments(node.args)
                        })
                    );
                    break;

                /* istanbul ignore next */
                default:
                    this.logger.error(
                        'parseExpression: Not Implemented',
                        type,
                        JSON.stringify(node, null, 4)
                    );
            }
            return result;
        };

        return new ExpressionNode({ children: parse(node) });
    }

    /**
     * @protected
     * @param {export.ast.Node}
     */
    parseOutput(node) {
        const children = [];
        let types = [];
        for (const child of node.children) {
            const childNode = this.parseNode(child);
            types.push(childNode.type);
            children.push(childNode);
        }
        types = unique(types);

        // Only TextNode/CallNode(s)?
        if (types.length == 1 && ['TextNode', 'CallNode', 'YieldNode'].indexOf(types[0]) > -1) {
            return children.length > 1 ? new NodeList({ children: children }) : children[0];
        }

        // Just add the output
        return new OutputNode({ children: children });
    }

    /**
     * {% set var="" value="" %}
     *
     * @protected
     * @param {export.ast.Node}
     */
    parseSet(node) {
        const variable = this.parseVariable(node.targets[0]);
        const expression = this.parseExpression(node.value);
        return new SetNode({ variable: variable, value: expression });
    }

    /**
     * @protected
     * @param {export.ast.Node}
     */
    parseIf(node) {
        //console.log(JSON.stringify(node, null, 4));
        const condition = this.parseCondition(node.cond);
        const children = [];
        const elseChildren = [];
        const elseIfChildren = [];

        // if
        if (node.body) {
            for (const child of node.body.children) {
                children.push(this.parseNode(child));
            }
        }
        // add else & elseif
        if (node.else_) {
            const addElseNodes = (elseNode) => {
                // elseif
                if (elseNode && elseNode.cond) {
                    const nodeCondition = this.parseCondition(elseNode.cond);
                    const nodeChildren = [];
                    if (elseNode.body) {
                        for (const child of elseNode.body.children) {
                            nodeChildren.push(this.parseNode(child));
                        }
                    }
                    elseIfChildren.push(
                        new ElseIfNode({ condition: nodeCondition, children: nodeChildren })
                    );
                }
                // else
                else if (elseNode) {
                    for (const child of elseNode.children) {
                        elseChildren.push(this.parseNode(child));
                    }
                }
                // add more else nodes?
                if (elseNode && elseNode.else_) {
                    addElseNodes(elseNode.else_);
                }
            };
            addElseNodes(node.else_);
        }

        return new IfNode({
            condition: condition,
            children: children,
            elseChildren: elseChildren,
            elseIfChildren: elseIfChildren
        });
    }

<<<<<<< HEAD
    /**
     * @protected
     * @param {export.ast.Node}
     */
    parseInlineIf(node)
    {
        const condition = this.parseCondition(node.cond);
        const children = [];

        // if
        if (node.body)
        {
            const childNodes = Array.isArray(node.body.children) ? node.body.children : [node.body];
            for (const child of childNodes)
            {
                children.push(this.parseNode(child));
            }
        }

        return new IfNode({ condition: condition, children: children, elseChildren: [], elseIfChildren: [] });
    }


=======
>>>>>>> chore: reformat all source files
    /**
     * @protected
     * @param {export.ast.Node}
     */
    parseFor(node) {
        //console.log(JSON.stringify(node, null, 4));
        const value = this.parseVariable(node.arr);
        const children = [];
<<<<<<< HEAD
        const childNodes = Array.isArray(node.body.children) ? node.body.children : [node.body.children];
        for (const child of childNodes)
        {
=======
        for (const child of node.body.children) {
>>>>>>> chore: reformat all source files
            children.push(this.parseNode(child));
        }
        const keyName = node.name.children ? node.name.children[0].value : false;
        const valueName = node.name.children ? node.name.children[1].value : node.name.value;
        return new ForNode({
            keyName: keyName,
            valueName: valueName,
            value: value,
            children: children
        });
    }

    /**
     * @protected
     * @param {export.ast.Node}
     */
    parseMacroDefinition(node) {
        //console.log(JSON.stringify(node, null, 4));
        const children = [];
        const parameters = this.parseParameters(node.args);
        for (const child of node.body.children) {
            children.push(this.parseNode(child));
        }

        return new MacroNode({ name: node.name.value, parameters: parameters, children: children });
    }

    /**
     * @protected
     * @param {export.ast.Node}
     */
    parseCall(node) {
        if (node.name.value === 'caller') {
            return new YieldNode();
        }
        else
        {
            const nameNode = this.parseNode(node.name);
            if (nameNode.fields.length > 1)
            {
                return new FunctionCallNode(
                    {
                        name: nameNode,
                        arguments: this.parseArguments(node.args)
                    });
            }
            return new CallNode(
                {
                    name: nameNode.fields.join('.'),
                    arguments: this.parseArguments(node.args),
                    children: this.parseYield(node.args)
                });
        }
    }

    /**
     * @protected
     * @param {export.ast.Node}
     */
    parseTag(node) {
        const children = [];
        if (node.contentArgs && Array.isArray(node.contentArgs) && node.contentArgs.length) {
            for (const child of node.contentArgs[0].children) {
                children.push(this.parseNode(child));
            }
        }
        return new TagNode({
            name: node.extName.type,
            arguments: this.parseArguments(node.args),
            children: children
        });
    }

    /**
     * [...]
     *
     * @protected
     * @param {export.ast.Node}
     */
    parseArray(node) {
        const children = [];
        for (const child of node.children) {
            children.push(this.parseNode(child));
        }

        return new ArrayNode({ children: children });
    }

    /**
     * {% block content %}{% endblock %}
     *
     * @protected
     * @param {export.ast.Node}
     */
    parseBlock(node) {
        const children = [];
        if (node.body && node.body.children) {
            for (const child of node.body.children) {
                children.push(this.parseNode(child));
            }
        }

        return new BlockNode({ name: node.name.value, children: children });
    }

    /**
     * @protected
     * @param {export.ast.Node}
     */
    parseList(node) {
        const children = [];
        for (const child of node.children) {
            children.push(this.parseNode(child));
        }

        if (children.length > 1) {
            return new NodeList({ children: children });
        } else {
            return children[0];
        }
    }

    /**
     * @protected
     * @param {export.ast.Node}
     */
    parseNode(node, context) {
        /* eslint complexity: "off" */
        const type = Object.getPrototypeOf(node).typename;
        let result;
        switch (type) {
            case 'NodeList':
            case 'Root':
                result = this.parseList(node);
                break;

            case 'Output':
                result = this.parseOutput(node);
                break;

            case 'Group':
                result = this.parseExpression(node);
                break;

            case 'TemplateData':
                result = new TextNode({ value: node.value });
                break;

            case 'Literal':
                result = new LiteralNode({ value: node.value });
                break;

            case 'Set':
                result = this.parseSet(node);
                break;

            case 'If':
                result = this.parseIf(node);
                break;

            case 'For':
                result = this.parseFor(node);
                break;

            case 'Symbol':
            case 'LookupVal':
                result = this.parseVariable(node);
                break;

            case 'Macro':
                result = this.parseMacroDefinition(node);
                break;

            case 'FunCall':
                result = this.parseCall(node);
                break;

            case 'CallExtension':
                result = this.parseTag(node);
                break;

            case 'Filter':
                result = this.parseFilter(node);
                break;

            case 'Array':
                result = this.parseArray(node);
                break;

            case 'Dict':
                result = this.parseComplexVariable(node);
                break;

            case 'Block':
                result = this.parseBlock(node);
                break;

            case 'Add':
            case 'Sub':
            case 'Mul':
            case 'Div':
            case 'Mod':
                result = this.parseExpression(node);
                break;

            case 'InlineIf':
                result = this.parseInlineIf(node);
                break;

            /* istanbul ignore next */
            case 'Caller':
                break;

            /* istanbul ignore next */
            case 'Extends':
                break;

            /* istanbul ignore next */
            default:
                this.logger.error('parseNode: Not Implemented', type, node);
        }

        // return a node - always
        if (!result) {
            result = new TextNode({ value: '' });
        }
        return result;
    }

    /**
     * @inheritDoc
     */
    parseString(source, configuration) {
        let preparedSource = source || '';
        if (configuration) {
            preparedSource = activateEnvironment(
                preparedSource,
                configuration.buildConfiguration.environment
            );
        }
        const ast = nunjucks.parser.parse(preparedSource, this.tags);
        return Promise.resolve(this.parseNode(ast));
    }

    /**
     * @inheritDoc
     */
    parseTemplate(entity, configuration) {
        if (!entity || !configuration) {
            return Promise.resolve(false);
        }
        const scope = this;
        const promise = co(function*() {
            // Get template
            const template = entity.files.find(
                (file) => file.contentType == 'jinja' && file.basename == entity.id.idString + '.j2'
            );
            /* istanbul ignore next */
            if (!template || !template.contents) {
                scope.logger.warn(
                    'parseTemplate - could not find template for ' + entity.pathString
                );
                return false;
            }

            // Parse file
            const rootNode = yield scope.parseString(template.contents, configuration);
            /* istanbul ignore next */
            if (!rootNode) {
                scope.logger.warn('parseTemplate - could not find file');
                return false;
            }

            return rootNode;
        });
        return promise;
    }

    /**
     * @inheritDoc
     */
    parseMacro(name, configuration) {
        if (!name || !configuration) {
            return Promise.resolve(false);
        }
        const scope = this;
        const promise = co(function*() {
            // Find macro
            const macroConfiguration = yield configuration.getMacroConfiguration(name);
            if (!macroConfiguration) {
                scope.logger.warn('parseMacro - could not find macro configuration');
                return false;
            }

            // Parse file
            const rootNode = yield scope.parseString(
                macroConfiguration.macro.file.contents,
                configuration
            );
            /* istanbul ignore next */
            if (!rootNode) {
                scope.logger.warn('parseMacro - could not find file');
                return false;
            }

            // Find macro node
            const macroNode = rootNode.find('MacroNode', { name: name });
            /* istanbul ignore next */
            if (!macroNode) {
                scope.logger.warn('parseMacro - could not find macro node');
                return false;
            }

            return macroNode;
        });
        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.JinjaParser = JinjaParser;
