const dayjs = require("dayjs");

const formatTime = (date) => {
const formattedTime = dayjs(date).format('YYYY-MM-DD HH:mm')

return formattedTime
};

module.exports = formatTime
