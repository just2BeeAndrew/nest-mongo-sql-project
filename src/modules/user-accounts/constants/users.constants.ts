export const loginConstants = {
  minLength: 3,
  maxLength: 10,
  match: /^[a-zA-Z0-9_-]*$/
}

export const passwordConstants = {
  minLength: 6,
  maxLength: 20,
}

export const emailConstants = {
  match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
}