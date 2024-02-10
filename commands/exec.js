import {
  consoleEditor,
  consoleElement,
  errorIcon,
  keyIcon,
  xIcon,
} from '../main.js'
import { editor } from '../main.js'
import { run, printErrors, droneIntel, exe, replacer } from './utils.js'

export const execute = async (CONSOLE) => {
  consoleElement.classList.remove('error_line')
  consoleElement.classList.add('info_line')
  const selectedConsoleLine = CONSOLE.value.trim()
  const [CMD, ...ARGS] = selectedConsoleLine.split(' ')
  switch (CMD?.trim()?.toUpperCase()) {
    case 'SHARE':
      {
        const compressed = LZString.compressToBase64(editor.getValue())
        const uri = encodeURIComponent(compressed)
        const newurl =
          window.location.protocol +
          '//' +
          window.location.host +
          window.location.pathname +
          `?s=${uri}`
        consoleElement.value = newurl
        window.history.pushState({ path: newurl }, '', newurl)
        droneIntel(keyIcon)
      }
      break
    case 'ENCODE':
      {
        const compressed = LZString.compressToBase64(editor.getValue())
        const uri = encodeURIComponent(compressed)
        const newurl =
          window.location.protocol +
          '//' +
          window.location.host +
          window.location.pathname +
          `?s=${uri}`
        consoleElement.value = uri
        window.history.pushState({ path: newurl }, '', newurl)
        droneIntel(keyIcon)
      }
      break
    case 'DECODE':
      {
        const decompressed = LZString.decompressFromBase64(ARGS[0])
        editor.setValue(decodeURIComponent(decompressed))
        consoleElement.value = ''
        droneIntel(keyIcon)
      }
      break
    case 'CLEAR':
      editor.setValue('')
      consoleElement.value = ''
      droneIntel(xIcon)
      break
    case 'RUN':
      run()
      consoleElement.value = ''
      break
    case 'ABOUT':
      editor.setValue(`/* 
  Codepad.js

  ✨ Features ✨

  * Write and Run simple JavaScript snippets
  * Share Base64 encoded link
  * Log selected expressions
*/`)
      consoleElement.value = ''

      droneIntel(keyIcon)
      break
    case 'LICENSE':
      consoleElement.value = ''
      editor.setValue(`/*
  MIT License

  Copyright (c) 2024 AT-290690
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
  */`)
      droneIntel(keyIcon)
      break
    case '_LOG':
      {
        consoleElement.value = ''
        consoleElement.classList.add('info_line')
        consoleElement.classList.remove('error_line')
        const source = editor.getValue()
        const selection = editor.getSelection()
        const formattedSelection =
          selection[selection.length - 1] === ';'
            ? selection.substring(selection, selection.length - 1)
            : selection
        const label = JSON.stringify(selection, replacer)
        const out = `${selection === '' ? ';' : ''}__debug_log(${
          formattedSelection || run()
        }, ${label})`
        editor.replaceSelection(out)
        exe(`const __debug_log = logger(); ${editor.getValue().trim()}`)
        editor.setValue(source)
        consoleEditor.focus()
      }
      break
    case 'ESC':
    case 'X':
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Escape',
        })
      )
      consoleElement.value = ''
      break
    case 'HELP':
      editor.setValue(`/* 
-----------------------------
 Press ctrl/command + s - run code
-----------------------------
 Enter a command in the console
 ---------[COMMANDS]---------
 HELP: list these commands
 RUN: run code 
 SHARE: create share link
 ENCODE: turn code into Base64
 DECODE: decode the current Base64
 CLEAR: clears the editor content
 X: clears search and logs
 ABOUT: read feature list
 LICENSE: read license info
 ----------------------------
*/`)
      droneIntel(keyIcon)
      consoleElement.value = ''
      break
    default:
      if (CMD.trim()) printErrors('command "' + CMD + '" does not exist!')
      else consoleElement.value = ''
      droneIntel(errorIcon)
      break
  }
}
