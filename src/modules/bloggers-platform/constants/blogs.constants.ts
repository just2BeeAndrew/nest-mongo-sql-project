export const nameConstants = {
  minLength: 1,
  maxLength: 15,
}

export const descriptionConstants = {
  minLength: 1,
  maxLength: 500,
}

export const websiteUrlConstants = {
  minLength: 1,
  maxLength: 100,
  match: /^https:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[-a-zA-Z0-9._~!$&'()*+,;=:@%]*)*\/?$/
}