// @ts-check

/** @type {import('lazyrepo').LazyConfig} */
export default {
  tasks: {
    // 测试命令 暂时先不加
    test: {
      defaultCommand: 'jest --runInBand --noCache --coverage',
      cache: {
        // by default we consider all files in the package directory
        inputs: ['**/*'],
        // there are no outputs
        outputs: [],
        // a test invocation depends on the input files of any upstream packages
        inheritsInputFromDependencies: true,
      },
    },
    run: {
      defaultCommand: 'pnpm build',
      cache: {
        // by default we consider all files in the package directory
        inputs: ['**/*'],
        // there are no outputs
        outputs: [],
        // a test invocation depends on the input files of any upstream packages
        inheritsInputFromDependencies: true,
      },
    },
  },
}
