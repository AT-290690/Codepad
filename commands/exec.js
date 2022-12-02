import {
  consoleEditor,
  // alertIcon,
  consoleElement,
  errorIcon,
  formatterIcon,
  keyIcon,
  // questionIcon,
  xIcon,
} from '../main.js'
import { editor } from '../main.js'
import { run, printErrors, playSound, State, droneIntel, exe } from './utils.js'

export const execute = async (CONSOLE) => {
  consoleElement.classList.remove('error_line')
  consoleElement.classList.add('info_line')
  const selectedConsoleLine = CONSOLE.value.trim()
  const [CMD, ...PARAMS] = selectedConsoleLine.split(' ')
  switch (CMD?.trim()?.toUpperCase()) {
    case 'CLEAR':
      State.source = editor.getValue()
      editor.setValue('')
      consoleElement.value = ''
      playSound(5)
      droneIntel(xIcon)
      break
    case 'RUN':
      run()
      consoleElement.value = ''
      break
    case 'ABOUT':
      State.source = editor.getValue()
      editor.setValue(`/* 
  Notepad.js

  ✨ Features ✨

  * Write and Run simple JavaScript snippets
  * Store your snippets in browser storage
  * Share existing github snippets (gysts)
  * Hide certain parts of the snippets
  
*/`)
      droneIntel(keyIcon)
      playSound(5)
      break
    case 'LICENSE':
      State.source = editor.getValue()
      editor.setValue(`/*
  MIT License

  Copyright (c) 2022 AT-290690
  
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
      playSound(5)

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
        const label = JSON.stringify(selection)
        const out = `${selection === '' ? ';' : ''}__debug_log(${
          formattedSelection || '"Nothing is selected"'
        }, ${label})`
        editor.replaceSelection(out)
        exe(`const __debug_log = _logger(); ${editor.getValue().trim()}`)
        editor.setValue(source)
        consoleEditor.focus()
      }

      break
    // case 'LINT':
    //   {
    //     const inp = PARAMS[0]?.toUpperCase()
    //     if (inp === 'OFF' && State.settings.lint) {
    //       State.settings.lint = false
    //       editor.switchInstance({
    //         lint: false,
    //         doc: editor.getValue(),
    //       })
    //       droneIntel(xIcon)
    //       playSound(5)
    //     } else if (inp === 'ON' && !State.settings.lint) {
    //       execute({ value: 'UNVEIL' }).then(() => {
    //         playSound(1)
    //         droneIntel(formatterIcon)
    //         debug()
    //       })
    //     } else if (!inp) consoleElement.value = 'Provide a lint option on/off'
    //     else
    //       consoleElement.value = 'LINT ' + (State.settings.lint ? 'OFF' : 'ON')
    //   }
    //   break
    case 'LIST':
      const out = []
      for (let i = 0; i < localStorage.length; ++i) {
        const key = localStorage.key(i)
        if (key.includes('stash-')) out.push(key.split('stash-')[1])
      }
      editor.setValue(
        out.length
          ? `/*
Code stash: 

${out.join('\n')}

LOAD name
*/`
          : `/* 
Your code stash is empty...

SAVE name
*/`
      )
      playSound(3)
      consoleElement.value = ''
      droneIntel(keyIcon)
      State.lastSelectedFile = null
      break
    case 'ESC':
    case 'X':
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Escape',
        })
      )

      break
    case 'LOAD':
    case '.':
      {
        State.source = editor.getValue()
        const file = PARAMS[0] ? 'stash-' + PARAMS[0] : 'stash-main'
        editor.setValue(localStorage.getItem(file))
        State.lastSelectedFile = file

        playSound(3)
        droneIntel(keyIcon)
        consoleElement.value = ''
      }
      break
    case 'SAVE':
      {
        consoleElement.value = ''
        const file = PARAMS[0] ? 'stash-' + PARAMS[0] : State.lastSelectedFile
        localStorage.setItem(file, editor.getValue())
        playSound(6)
        droneIntel(keyIcon)
      }
      break
    case 'DELETE':
      State.source = editor.getValue()
      localStorage.removeItem(PARAMS[0] ? 'stash-' + PARAMS[0] : 'stash-main')
      consoleElement.value = ''
      playSound(5)
      droneIntel(xIcon)
      break
    case 'DROP':
      State.source = editor.getValue()
      for (let i = 0; i < localStorage.length; ++i) {
        const key = localStorage.key(i)
        if (key.includes('stash-')) localStorage.removeItem(key)
      }
      consoleElement.value = ''
      editor.setValue('')
      droneIntel(xIcon)
      playSound(5)
      break
    case 'SOUND':
      switch (PARAMS[0]?.toUpperCase()) {
        case 'ON':
          State.mute = 0
          localStorage.setItem('mute', 0)
          droneIntel(formatterIcon)
          playSound(5)
          break
        case 'OFF':
          State.mute = 1
          localStorage.setItem('mute', 1)
          droneIntel(xIcon)
          break
      }
      break
    case 'PRETTY':
      editor.setValue(js_beautify(editor.getValue(), State.settings.beautify))
      playSound(4)
      droneIntel(formatterIcon)
      break
    case 'INPUT':
      {
        const file = PARAMS[0] ? 'input-' + PARAMS[0] : 'input-main'
        consoleElement.value = ''
        localStorage.setItem(file, editor.getValue())
        editor.setValue('')
        droneIntel(keyIcon)
      }
      break
    case 'BACK':
      editor.setValue(State.source)
      playSound(5)
      droneIntel(keyIcon)
      consoleElement.value = ''
      break
    case 'HELP':
      State.source = editor.getValue()
      editor.setValue(`/* 
-----------------------------
 Press on the drone - run code
 Press ctrl/command + s - run code
-----------------------------
 Enter a command in the console
 ---------[COMMANDS]---------
 BACK: go back to the code
 HELP: list these commands
 RUN: run code 
 CLEAR: clears the editor content
 X: clears search, log and canvas pannels
 SAVE: save in starage
 LOAD: load from storage
 DELETE: remove from storage
 DROP: drop all storage
 LIST: list stash content
 SOUND ON:  enable sounds
 SOUND OFF: dissable sounds
 PRETTY: format code
 LICENSE: read license info
 ----------------------------
*/`)
      playSound(4)
      droneIntel(keyIcon)
      consoleElement.value = ''
      break
    default:
      if (CMD.trim()) printErrors(CMD + ' does not exist!')
      else consoleElement.value = ''
      droneIntel(errorIcon)
      playSound(0)
      break
  }
}
