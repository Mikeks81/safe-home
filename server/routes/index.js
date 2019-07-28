var fs = require('fs');

export default function (app) {
  fs.readdirSync(__dirname).forEach(file => {
    const reject = ['index.js', '.test.js']
    const matches = reject.filter(str => file.indexOf(str) !== -1)
    if (matches.length) return
    const name = file.substr(0, file.indexOf('.'))
    require(`./${name}`).default(app)
  });
}