const electron = require('electron')
const { app, BrowserWindow } = electron
const log = require('electron-log')
const { autoUpdater } = require('electron-updater')

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let win
function createWindow() {
  win = new BrowserWindow({
    height: 600,
    width: 800
  })

  win.webContents.openDevTools();
  win.on('close', () => {
    win = null
  })

  win.loadURL(`file:///${__dirname}/index.html`)
  return win
}

app.on('ready', () => {
  createWindow()
  autoUpdater.checkForUpdates()
})

app.on('window-all-closed', () => {
  app.quit()
});

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.')
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.')
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err)
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
  sendStatusToWindow(log_message)
})

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded')
  autoUpdater.quitAndInstall()
});
