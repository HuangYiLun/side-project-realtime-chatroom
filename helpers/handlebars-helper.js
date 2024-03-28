const formatTime = require("../utilities/formatTime")

module.exports = {
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  lookupPartial: function (partialName) {
    return partialName
  },
  time: function (a) {
    return formatTime(a)
  },
}
