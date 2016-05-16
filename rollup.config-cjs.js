import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/eelog.js',
    format: 'cjs',
    plugins: [babel()],
    dest: 'lib/eelog-cjs.js'
};