// This file just initialises the electron wrapper/window, loads main template and loads some other elements
// The other js files then manipulate what is in the mainWindow
// Think of this as a init/run application file
const electron = require('electron')
const {app, BrowserWindow, Menu} = electron
const path = require('path')
const url = require('url')

// Menu template, about app
menuTemplate = [
  {
    label: 'Application',
    submenu: [
      {
        label: 'About',
        click: () => {
          openAboutWindow()
        }
      }
    ]
  }
]
let mainWindow // Gbl reference

function createWindow () {

  // Create the window
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 720
  })

  // Load the index.html file
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Set up the menu
  var menu = Menu.buildFromTemplate(menuTemplate)
  mainWindow.setMenu(menu)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Opens about window
function openAboutWindow() {

  let aboutWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false,
    width: 400,
    height: 200
  })
  aboutWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'about.html'),
    protocol: 'file:',
    slashes: true
  }))
  aboutWindow.setMenu(null)
  aboutWindow.once('ready-to-show', () => {
    aboutWindow.show()
  })
}

// Create window then the app is ready (event)
app.on('ready', () => {
  createWindow()
  electron.powerMonitor.on('on-ac', () => {
    mainWindow.restore()
  })
  electron.powerMonitor.on('on-battery', () => {
    mainWindow.minimize()
  })
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Reopen for mac osx compatibility 
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
