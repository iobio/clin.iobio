/* Copyright 2017-2020, Frameshift Labs, Inc., All rights reserved. */
/* File from: https://github.com/ErikGartner/dTree
 *
 */

// TODO: refactor code to adhere to linter
/*
eslint-disable
no-unused-vars,
no-var,
func-names,
no-redeclare,
no-plusplus,
eqeqeq
*/

import _ from 'lodash';
import * as d3 from 'd3';
import TreeBuilder from './builder';

const dTree = {

    VERSION: '/* @echo DTREE_VERSION */',

    init(data, options = {}) {
        const opts = _.defaultsDeep(options || {}, {
            target: '#graph',
            debug: false,
            width: 600,
            height: 600,
            linkWidth: 2,
            strokeWidth: 2,
            callbacks: {
                nodeClick(name, extra, id) {},
                nodeRenderer(name, x, y, height, width, extra, id, nodeClass, textClass, textRenderer) {
                    return TreeBuilder._nodeRenderer(
                        name, x, y, height, width, extra,
                        id, nodeClass, textClass, textRenderer,
                    );
                },
                nodeSize(nodes, width, textRenderer) {
                    return TreeBuilder._nodeSize(nodes, width, textRenderer);
                },
                nodeSorter(aName, aExtra, bName, bExtra) { return 0; },
                textRenderer(name, extra, textClass) {
                    return TreeBuilder._textRenderer(name, extra, textClass);
                },
            },
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
            nodeWidth: 100,
            styles: {
                node: 'node',
                lineage: 'lineage',
                marriage: 'marriage',
                text: 'nodeText',
            },
        });

        var data = this._preprocess(data, opts);
        const treeBuilder = new TreeBuilder(data.root, data.siblings, opts);
        treeBuilder.create();
    },

    _preprocess(data, opts) {
        const siblings = [];
        let id = 0;

        const root = {
            name: '',
            id: id++,
            hidden: true,
            children: [],
        };

        var reconstructTree = function (person, parent) {
            // convert to person to d3 node
            const node = {
                name: person.name,
                id: id++,
                hidden: false,
                children: [],
                extra: person.extra,
                textClass: person.textClass ? person.textClass : opts.styles.text,
                class: person.class ? person.class : opts.styles.node,
            };

            // hide lineages to the hidden root node
            if (parent == root) {
                node.noParent = true;
            }

            // apply depth offset
            for (let i = 0; i < person.depthOffset; i++) {
                const pushNode = {
                    name: '',
                    id: id++,
                    hidden: true,
                    children: [],
                    noParent: node.noParent,
                };
                parent.children.push(pushNode);
                // eslint-disable-next-line no-param-reassign
                parent = pushNode;
            }

            // sort children
            dTree._sortPersons(person.children, opts);

            // add "direct" children
            _.forEach(person.children, (child) => {
                reconstructTree(child, node);
            });

            parent.children.push(node);

            // DEPRECATED: Backwards-compatability for v1.x syntax, remove for 2.0
            if (person.marriage) {
                // eslint-disable-next-line
                console.log('DEPRECATED: The data attribute "marriage" is deprecated in favor of "marriages" that takes an array. It will be removed in 2.0.');
                person.marriages = [person.marriage];
            }

            // sort marriages
            dTree._sortMarriages(person.marriages, opts);

            // go through marriage
            _.forEach(person.marriages, (marriage, index) => {
                const m = {
                    name: '',
                    id: id++,
                    hidden: true,
                    noParent: true,
                    children: [],
                    extra: marriage.extra,
                };

                const sp = marriage.spouse;
                let spouse;

                // in our dataset, spouse may not exist.
                if (sp !== undefined) {
                    spouse = {
                        name: sp.name,
                        id: id++,
                        hidden: false,
                        noParent: true,
                        children: [],
                        textClass: sp.textClass ? sp.textClass : opts.styles.text,
                        class: sp.class ? sp.class : opts.styles.node,
                        extra: sp.extra,
                    };
                } else {
                    spouse = {
                        name: '',
                        id: id++,
                        hidden: true,
                        noParent: true,
                        children: [],
                    };
                }

                parent.children.push(m, spouse);

                dTree._sortPersons(marriage.children, opts);
                _.forEach(marriage.children, (child) => {
                    reconstructTree(child, m);
                });

                siblings.push({
                    source: {
                        id: node.id,
                    },
                    target: {
                        id: spouse.id,
                    },
                    number: index,
                });
            });
        };

        _.forEach(data, (person) => {
            reconstructTree(person, root);
        });

        return {
            root: d3.hierarchy(root),
            siblings,
        };
    },

    _sortPersons(persons, opts) {
        if (persons != undefined) {
            persons.sort((a, b) => opts.callbacks.nodeSorter(a.name, a.extra, b.name, b.extra));
        }
        return persons;
    },

    _sortMarriages(marriages, opts) {
        if (marriages != undefined && Array.isArray(marriages)) {
            marriages.sort((marriageA, marriageB) => {
                const a = marriageA.spouse;
                const b = marriageB.spouse;
                return opts.callbacks.nodeSorter(a.name, a.extra, b.name, b.extra);
            });
        }
        return marriages;
    },

};

export default dTree;
