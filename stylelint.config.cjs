module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-tailwindcss'
  ],
  rules: {
    // Block raw hex colors to force using design tokens
    'color-no-hex': true,
    
    // Disallow specific yellow/amber hex values
    'declaration-property-value-disallowed-list': {
      '/^color$/': [
        '#f59e0b', '#F59E0B',
        '#fbbf24', '#FBBF24', 
        '#eab308', '#EAB308',
        '#ffc107', '#FFC107',
        '#facc15', '#FACC15',
        '#ffd54f', '#FFD54F'
      ],
      '/^background(-color)?$/': [
        '#f59e0b', '#F59E0B',
        '#fbbf24', '#FBBF24',
        '#eab308', '#EAB308', 
        '#ffc107', '#FFC107',
        '#facc15', '#FACC15',
        '#ffd54f', '#FFD54F'
      ],
      '/^border(-color)?$/': [
        '#f59e0b', '#F59E0B',
        '#fbbf24', '#FBBF24',
        '#eab308', '#EAB308',
        '#ffc107', '#FFC107', 
        '#facc15', '#FACC15',
        '#ffd54f', '#FFD54F'
      ]
    },
    
    // Allow CSS custom properties (our design tokens)
    'custom-property-pattern': null,
    
    // Allow our design token naming convention
    'selector-class-pattern': null,
    
    // Allow Tailwind utilities 
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply', 
          'variants',
          'responsive',
          'screen',
          'layer'
        ]
      }
    ]
  }
};
