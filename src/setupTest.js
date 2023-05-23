const { toHaveCompiledCss } = require('@compiled/jest');

expect.extend({
  toHaveCompiledCss,
});
