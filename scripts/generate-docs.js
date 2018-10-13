'use strict';

/**
 * Requirements
 */
const DIContainer = require(__dirname + '/../source/utils/DIContainer.js').DIContainer;
const SystemModuleConfiguration = require(__dirname +
    '/../source/configuration/SystemModuleConfiguration.js').SystemModuleConfiguration;
const isPlainObject = require('lodash.isplainobject');
const fs = require('fs');
const jsdoc2md = require('jsdoc-to-markdown');

/**
 * Prepare
 */
const di = new DIContainer();
const moduleConfiguration = di.create(SystemModuleConfiguration);
const configurationSource = fs.readFileSync(
    __dirname + '/../source/configuration/SystemModuleConfiguration.js'
);
const docsSharedPath = '/Users/auth/Projects/Entoj/entoj.github.io/user/shared';

/**
 * Generate docs
 */
jsdoc2md.getJsdocData({ source: configurationSource }).then((jsdoc) => {
    const options = {};
    for (const documented of jsdoc) {
        if (
            documented.memberof != 'configuration.SystemModuleConfiguration' ||
            documented.scope != 'instance' ||
            documented.kind != 'member'
        ) {
            continue;
        }
        const config = moduleConfiguration.meta.get(documented.name);
        //console.log(documented.name, config);
        if (config && config.path) {
            const pathParts = config.path.split('.');
            let key = 'none';
            if (pathParts.length > 2) {
                key = pathParts[1];
            }
            options[key] = options[key] || '';
            options[key] += '\n';
            options[key] += '### ' + config.path + '\n';
            options[key] += '\n';
            if (documented.type.names) {
                options[key] += '* **Type:** `' + documented.type.names.join('|') + '`\n';
            }
            if (isPlainObject(config.defaultValue) || Array.isArray(config.defaultValue)) {
                options[key] += '* **Default:**\n';
                options[key] += '```javascript\n';
                options[key] += JSON.stringify(config.defaultValue, null, 4);
                options[key] += '```\n';
            } else {
                options[key] += '* **Default:** `' + config.defaultValue + '`\n';
            }
            options[key] += '\n';
            if (documented.description) {
                options[key] += documented.description;
                options[key] += '\n\n';
            }
        }
    }

    // Groups
    let allOptions = '';
    for (const key in options) {
        fs.writeFileSync(`${docsSharedPath}/SystemConfigurationOptions-${key}.md`, options[key]);
        allOptions += `{% include 'SystemConfigurationExample-${key}.md' %}\n`;

        let example = '';
        example += '```javascript\n';
        example += JSON.stringify(
            moduleConfiguration.getMetaAsObject(
                (path) => (path.length > 2 ? path[1] == key : key == 'none')
            ),
            null,
            4
        );
        example += '\n```\n';
        fs.writeFileSync(`${docsSharedPath}/SystemConfigurationExample-${key}.md`, example);
    }

    // All
    fs.writeFileSync(`${docsSharedPath}/SystemConfigurationOptions.md`, allOptions);
    let example = '';
    example += '```javascript\n';
    example += JSON.stringify(moduleConfiguration.getMetaAsObject(), null, 4);
    example += '\n```\n';
    fs.writeFileSync(docsSharedPath + '/SystemConfigurationExample.md', example);
});
