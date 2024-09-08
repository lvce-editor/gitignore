export const state = {
  path: '',
}

export const setPath = (path) => {
  state.path = path
}

export const getPath = () => {
  return state.path
}
