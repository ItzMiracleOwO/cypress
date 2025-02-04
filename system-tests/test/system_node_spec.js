const systemTests = require('../lib/system-tests').default
const execa = require('execa')
const Fixtures = require('../lib/fixtures')

const systemNode = Fixtures.projectPath('system-node')

let expectedNodeVersion
let expectedNodePath

describe('e2e system node', () => {
  before(async () => {
    // Grab the system node version and path before running the tests.
    expectedNodeVersion = (await execa('node', ['-v'])).stdout.slice(1)
    expectedNodePath = (await execa('node', ['-e', 'console.log(process.execPath)'])).stdout
  })

  systemTests.setup()

  it('uses system node when launching plugins file', async function () {
    const { stderr } = await systemTests.exec(this, {
      project: systemNode,
      userNodePath: expectedNodePath,
      userNodeVersion: expectedNodeVersion,
      config: {
        nodeVersion: 'system',
        env: {
          expectedNodeVersion,
          expectedNodePath,
        },
      },
      spec: 'system.spec.js',
      sanitizeScreenshotDimensions: true,
      snapshot: true,
    })

    expect(stderr).to.contain(`Plugin Node version: ${expectedNodeVersion}`)

    expect(stderr).to.contain('Plugin Electron version: undefined')
  })

  it('uses bundled node when launching plugins file', async function () {
    const { stderr } = await systemTests.exec(this, {
      project: systemNode,
      config: {
        nodeVersion: 'bundled',
        env: {
          expectedNodeVersion,
        },
      },
      spec: 'bundled.spec.js',
      sanitizeScreenshotDimensions: true,
      snapshot: true,
    })

    expect(stderr).to.contain(`Plugin Node version: ${expectedNodeVersion}`)

    expect(stderr).to.not.contain('Plugin Electron version: undefined')
  })

  it('uses default node when launching plugins file', async function () {
    const { stderr } = await systemTests.exec(this, {
      project: systemNode,
      userNodePath: expectedNodePath,
      userNodeVersion: expectedNodeVersion,
      config: {
        env: {
          expectedNodeVersion,
          expectedNodePath,
        },
      },
      spec: 'default.spec.js',
      sanitizeScreenshotDimensions: true,
      snapshot: true,
    })

    expect(stderr).to.contain(`Plugin Node version: ${expectedNodeVersion}`)

    expect(stderr).to.contain('Plugin Electron version: undefined')
  })
})
