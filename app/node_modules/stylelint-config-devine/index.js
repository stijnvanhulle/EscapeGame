module.exports = {

  extends: [
    `stylelint-config-standard`
  ],

  rules: {

    "selector-list-comma-newline-after": null,
    "block-closing-brace-empty-line-before": null,
    "rule-nested-empty-line-before": `always`,
    "declaration-empty-line-before": null,
    "font-family-name-quotes": `always-where-recommended`,
    "color-named": `always-where-possible`,
    "function-url-quotes": `always`,
    "string-quotes": `single`,
    "declaration-no-important": true,
    "no-duplicate-selectors": true,
    "selector-no-id": true,
    "number-max-precision": 2,
    "shorthand-property-no-redundant-values": true,
    "selector-no-qualifying-type": [true, {ignore: `attribute`}],
    "selector-no-universal": true,
    "selector-no-vendor-prefix": true,
    "property-no-vendor-prefix": true,
    "root-no-standard-properties": true,
    "media-feature-name-case": `lower`,
    "number-no-trailing-zeros": true,
    "number-leading-zero": `never`,
    "value-keyword-case": `lower`,
    "no-extra-semicolons": true,
    "declaration-block-no-shorthand-property-overrides": true,
    "declaration-block-no-redundant-longhand-properties": true

  }

};
