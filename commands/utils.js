import {
  editor,
  consoleElement,
  alertIcon,
  errorIcon,
  popupContainer,
  consoleEditor,
} from '../main.js'
export const replacer = (_, value) => {
  if (value instanceof Map)
    return {
      ['{Map}']: Array.from(value.entries()),
    }
  else if (value instanceof Set)
    return {
      '{Set}': Array.from(value.values()),
    }
  else return value
}
export const print = function (...values) {
  values.forEach(
    (x) =>
      (consoleElement.value += `${JSON.stringify(x, replacer) ?? undefined}`)
  )
  return values
}

export const printErrors = (errors) => {
  consoleElement.classList.remove('info_line')
  consoleElement.classList.add('error_line')
  consoleElement.value = errors
}

export const droneIntel = (icon) => {
  icon.style.visibility = 'visible'
  setTimeout(() => (icon.style.visibility = 'hidden'), 500)
}

const AsyncFunction = async function () {}.constructor
export const exe = async (source, params) => {
  try {
    const result = await new AsyncFunction(source)()
    droneIntel(alertIcon)
    return result
  } catch (err) {
    consoleElement.classList.remove('info_line')
    consoleElement.classList.add('error_line')
    consoleElement.value = consoleElement.value.trim() || err + ' '
    droneIntel(errorIcon)
  }
}

globalThis.logger = (disable = 0) => {
  if (disable) return () => {}
  popupContainer.style.display = 'block'
  consoleEditor.setValue('')
  const bouds = document.body.getBoundingClientRect()
  const width = bouds.width
  const height = bouds.height
  consoleEditor.setSize(width - 2, height / 3)
  // let count = 0
  return (msg, comment = '', space) => {
    const current = consoleEditor.getValue()
    consoleEditor.setValue(
      `${current ? current + '\n' : ''}// ${comment.replace(/\n/g, '')}
${msg !== undefined ? JSON.stringify(msg, replacer, space) : undefined}`
    )
    consoleEditor.setCursor(
      consoleEditor.posToOffset({ ch: 0, line: consoleEditor.lineCount() - 1 }),
      true
    )
    return msg
  }
}
globalThis.print = (msg) => {
  if (popupContainer.style.display !== 'block') {
    popupContainer.style.display = 'block'
    consoleEditor.setValue('')
    const bouds = document.body.getBoundingClientRect()
    const width = bouds.width
    const height = bouds.height
    consoleEditor.setSize(width - 2, height / 3)
  }
  const current = consoleEditor.getValue()
  consoleEditor.setValue(
    `${current ? current + '\n' : ''}${
      msg !== undefined ? JSON.stringify(msg, replacer) : undefined
    }`
  )
  consoleEditor.setCursor(
    consoleEditor.posToOffset({ ch: 0, line: consoleEditor.lineCount() - 1 }),
    true
  )
  return msg
}
export const run = async () => {
  consoleElement.classList.add('info_line')
  consoleElement.classList.remove('error_line')
  consoleElement.value = ''
  popupContainer.style.display = 'none'
  const source = editor.getValue().trim()
  await exe(source)
  return source
}
