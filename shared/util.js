export default function isValidHostname (hostname) {
  return /^([a-zA-Z0-9](?:(?:[a-zA-Z0-9-]*|(?<!-)\.(?![-.]))*[a-zA-Z0-9]+)?)$/.test(hostname);
}

// console.log(isValid('c-61-123-45-67.hsd1.co.comcast.net'));
// console.log(isValid('localhost'));
// console.log(isValid('12412..'));
// console.log(isValid('12kdjsd.asasa..com'));
