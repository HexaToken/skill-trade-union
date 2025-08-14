// ESLint rules to prevent yellow/amber regressions
// Add these rules to your existing .eslintrc configuration

module.exports = {
  rules: {
    // Prevent yellow/amber Tailwind utility classes
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/\\b(text|bg|border)-(yellow|amber)-\\d+\\b/]',
        message: 'Use design tokens instead of yellow/amber utilities. Use var(--color-primary), var(--color-warning), etc.'
      },
      {
        selector: 'TemplateLiteral *[value=/\\b(text|bg|border)-(yellow|amber)-\\d+\\b/]', 
        message: 'Use design tokens instead of yellow/amber utilities. Use var(--color-primary), var(--color-warning), etc.'
      }
    ],
    
    // Prevent direct hex color usage
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/#[0-9A-Fa-f]{3,6}/]',
        message: 'Use CSS custom properties (design tokens) instead of hex colors. Use var(--color-primary), var(--color-surface), etc.'
      }
    ]
  }
};

/*
To integrate into your existing ESLint config:

1. If you have .eslintrc.js, add the rules above to your existing rules object
2. If you have .eslintrc.json, convert the rules to JSON format
3. If you have package.json eslintConfig, add to that section

Example integration:
{
  "extends": ["your-existing-config"],
  "rules": {
    // Your existing rules...
    "no-restricted-syntax": [
      "error", 
      {
        "selector": "Literal[value=/\\b(text|bg|border)-(yellow|amber)-\\d+\\b/]",
        "message": "Use design tokens instead of yellow/amber utilities"
      }
    ]
  }
}
*/
