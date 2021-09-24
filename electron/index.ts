import { app, BrowserWindow } from 'electron'

const { ipcMain, dialog } = require('electron')
const fs = require('fs').promises
const path = require('path')
let selectedPath: string[]

const createWindow = () => {
  const window = new BrowserWindow({
    width: 1000,
    height: 1200,
    backgroundColor: 'white',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  })

  if (process.platform === 'win32') {
    window.loadFile(`file://${__dirname}/index.html`)
  }
  window.loadFile(`${__dirname}/index.html`)
  // window.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('saveFile', async (event, obj) => {
  console.log('Saving file: ', obj.filename)
  fs.writeFile(`${selectedPath}/${obj.filename}`, obj.data)
  const result = { ok: true }
  console.log('returning', result)
  return result
})

ipcMain.handle('openFileSystem', async (event, window) => {
  selectedPath = dialog.showOpenDialogSync(window, {
    properties: ['openDirectory']
  })
  console.log('Got the path: ', selectedPath)
  return selectedPath
})

ipcMain.handle('removeOldFiles', async (event, object) => {
  fs.readdir(`${selectedPath}`, (err: any, files: any) => {
    files.forEach((file: any) => {
      const fileString = file.toString()
      if (fileString.includes(object.propertyID)) {
        console.log('Removing file: ', file)
        fs.unlink(`${selectedPath}/${file}`)
      }
    })
  })
  const results = { ok: true }
  return results
})