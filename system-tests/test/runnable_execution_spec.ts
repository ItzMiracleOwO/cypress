import systemTests from '../lib/system-tests'
import Fixtures from '../lib/fixtures'

describe('e2e runnable execution', () => {
  systemTests.setup({
    servers: [{
      port: 3434,
      static: true,
    },
    {
      port: 4545,
      static: true,
    },
    {
      port: 5656,
      static: true,
    }],
  })

  // navigation in before and in test body doesn't cause infinite loop
  // but throws correct error
  // https://github.com/cypress-io/cypress/issues/1987
  systemTests.it('cannot navigate in before hook and test', {
    project: Fixtures.projectPath('hooks-after-rerun'),
    spec: 'beforehook-and-test-navigation.js',
    snapshot: true,
    expectedExitCode: 2,
  })

  systemTests.it('runnables run correct number of times with navigation', {
    project: Fixtures.projectPath('hooks-after-rerun'),
    spec: 'runnable-run-count.spec.js',
    snapshot: true,
  })

  systemTests.it('runs correctly after top navigation with already ran suite', {
    spec: 'runnables_already_run_suite.js',
    snapshot: true,
    expectedExitCode: 1,
    config: { video: false },
  })
})
