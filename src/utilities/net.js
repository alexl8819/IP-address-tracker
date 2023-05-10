import ipRegex from 'ip-regex';

export function isValidIP (ip) {
  return ipRegex({
    exact: true
  }).test(ip);
}

export function isValidDomain (domain) {
  return /(?=^.{4,253}\.?$)(^((?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}\.?$)/.test(domain);
}

// console.log(isValidDomain('domain'));
// console.log(isValidDomain('google.com'));
// console.log(isValidDomain('a.co.'));
// console.log(isValidDomain('.'));
