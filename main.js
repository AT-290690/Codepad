import { CodeMirror } from './libs/editor/editor.bundle.js'
import { execute } from './commands/exec.js'
import { run } from './commands/utils.js'
export const consoleElement = document.getElementById('console')
export const editorContainer = document.getElementById('editor-container')
export const mainContainer = document.getElementById('main-container')
export const headerContainer = document.getElementById('header')
export const focusButton = document.getElementById('focus-button')
export const keyButton = document.getElementById('key')
export const appButton = document.getElementById('run')
// export const droneButton = document.getElementById('drone')
export const errorIcon = document.getElementById('error-drone-icon')
export const formatterIcon = document.getElementById('formatter-drone-icon')
export const keyIcon = document.getElementById('key-drone-icon')
export const xIcon = document.getElementById('x-drone-icon')
// export const formatterButton = document.getElementById('formatter')
export const popupContainer = document.getElementById('popup-container')
export const alertIcon = document.getElementById('thunder-drone-icon')
export const compositionContainer = document.getElementById(
  'composition-container'
)
export const editorResizerElement = document.getElementById('editor-resizer')
export const consoleResizerElement = document.getElementById('console-resizer')

export const consoleEditor = CodeMirror(popupContainer)

// droneButton.addEventListener('click', () => execute({ value: '_LOG' }))
appButton.addEventListener('click', () => execute({ value: 'RUN ' }))
// formatterButton.addEventListener('click', () => {
//   execute({ value: 'PRETTY' })
// })
keyButton.addEventListener('click', () => execute({ value: 'SHARE' }))
export const editor = CodeMirror(editorContainer, {})

const initial = new URLSearchParams(location.search).get('s') ?? ''
if (initial) {
  const decompressed = LZString.decompressFromBase64(
    decodeURIComponent(initial)
  )
  editor.setValue(decompressed)
}

document.addEventListener('keydown', (e) => {
  const activeElement = document.activeElement
  if (e.key && e.key.toLowerCase() === 's' && (e.ctrlKey || e.metaKey)) {
    e = e || window.event
    e.preventDefault()
    e.stopPropagation()
    popupContainer.style.display = 'none'
    consoleElement.value = ''
    // const value = js_beautify(editor.getValue(), State.settings.beautify)
    // editor.setValue(value)
    editor.getSelection() ? execute({ value: '_LOG' }) : run()
  } else if (e.key === 'Enter') {
    if (activeElement === consoleElement) {
      execute(consoleElement)
    }
  } else if (e.key === 'Escape') {
    e.preventDefault()
    e.stopPropagation()
    popupContainer.style.display = 'none'
  }
})
editor.focus()
window.addEventListener('resize', () => {
  const bouds = document.body.getBoundingClientRect()
  const width = bouds.width
  const height = bouds.height
  editor.setSize(width - 10, height - 60)
  // editor.setSize(width, height - 70)
  if (popupContainer.style.display === 'block') {
    consoleEditor.setSize(width - 2, height / 3)
  }
})
const bounds = document.body.getBoundingClientRect()
editor.setSize(bounds.width - 10, bounds.height - 60)
