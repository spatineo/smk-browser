import { app, BrowserWindow } from 'electron'

const { ipcMain, dialog } = require('electron')

const fs = require('fs').promises


const path = require('path')


const createWindow = () => {
  const window = new BrowserWindow({
    width: 1000,
    height: 1200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  window.loadFile('index.html')
  window.webContents.openDevTools()
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

ipcMain.handle('saveJson', async (event, obj) => {
  console.log('Hello, I am a node server. I will save a file', obj.filename)
  var fh = await fs.open(obj.filename, 'w')
  await fh.writeFile(JSON.stringify(obj.data))
  await fh.close()
  var result = { ok: true }
  console.log('returning', result)
  return result
})

ipcMain.handle('openFileSystem', async (event, window) => {
  let path = dialog.showOpenDialogSync(window, {
    properties: ['openDirectory']
  })
  console.log('Got the path: ', path)
  return path
})