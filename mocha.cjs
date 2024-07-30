require("global-jsdom/register");

/* If you ever import a non-script file that isn't in DEFAULT_EXTENSIONS, initially sourced from here:
    (https://github.com/bkonkle/ignore-styles/blob/master/ignore-styles.js#L1-L22)
    then you need to add to this list.
, */

const DEFAULT_EXTENSIONS = [
    '.css',
    '.scss',
    '.sass',
    '.pcss',
    '.stylus',
    '.styl',
    '.less',
    '.sss',
    '.gif',
    '.jpeg',
    '.jpg',
    '.png',
    '.svg',
    '.mp4',
    '.webm',
    '.ogv',
    '.aac',
    '.mp3',
    '.wav',
    '.ogg'
]

require('ignore-styles').default(DEFAULT_EXTENSIONS)
