const crypto = require('crypto');

/**
 * Generates a meeting ID in the format NOVA-XXX-XXX
 * where X is a digit, e.g. NOVA-482-913
 */
const generateMeetingId = () => {
  const randomDigits = (length) => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += crypto.randomInt(0, 10).toString();
    }
    return result;
  };

  return `NOVA-${randomDigits(3)}-${randomDigits(3)}`;
};

module.exports = generateMeetingId;
