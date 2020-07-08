const {app, BrowserWindow} = require('electron');

const path = require('path');
const resources = path.join(__dirname, 'resources')

const { dialog } = require('electron')

function isDevelopment() {
  return process.argv[2] == '--dev';
}

app.on('ready', createWindow)

function createWindow () {
  const isdev = isDevelopment();
  mainWindow = new BrowserWindow(
    {
      minWidth: 800,
      minHeight: 600,
      show: false,
      titleBarStyle: 'hidden', //for iOS
      titleBarStyle: 'hidden-inset', //for iOS
      //frame: false, //hide all buttons to window frame
      backgroundColor: '#ffffff',
    }
  );

  mainWindow.maximize();
  mainWindow.loadFile('index.html');
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  if (isdev) {
    mainWindow.webContents.openDevTools();
    //require('devtron').install()
  }

  //var python = require('child_process').spawn('python', ['./hello.py']);

  /*
  python.stdout.on('data',function(data){
    console.log("data: ",data.toString('utf8'));

    const response = dialog.showMessageBox(null);
    console.log(data.toString('utf8'));
  });
  */

  const filepath = path.join(resources, "/hello.py");
  const  pyshell =  require('python-shell');

  pyshell.run(filepath,  function  (err, results)  {
    if  (err)  throw err;
    console.log('hello.py finished.');
    console.log('results', results);
    const message = results.toString();
    console.log('message', message)

    const options = {
      type: 'info',
      buttons: ['Cancel', 'OK'],
      defaultId: 2,
      title: 'title',
      message: message,
      detail: 'detail',
      //checkboxLabel: 'Remember my answer',
      //checkboxChecked: true,
    };

    const response = dialog.showMessageBox(null, options);
  });  

}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
})

