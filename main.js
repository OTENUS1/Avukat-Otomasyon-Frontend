const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow , ipcMain} = electron;

let mainWindow;
let currentWindow = null;


app.on('ready', () => {
    


 createMainWindow("main.html");

 ipcMain.on('close-current-window', async (event) => {
    if (currentWindow) {
        currentWindow.close();
    }
    await getall(event);
});

  ipcMain.on('get-data', async (event,arg) => {
    await getall(event,arg);
    if (mainWindow) {
        mainWindow.close();
    }
});

ipcMain.on("key:basaridurumu", async (event,arg)=>{
    await getallbyarguman(event,arg);
  });

ipcMain.on("key:tumdavalar",()=>{
  createWindow("DavaGoster.html");
});
      ipcMain.on("key:newWindow",()=>{
 
      hidecreateWindow("panel.html");
      mainWindow.hide();
         });

           ipcMain.on("key:newData",()=>{
      createWindow("Ekleme.html",900,950);
  });

  ipcMain.on('dava-form-submit', async (event, davaDosya) => {
    try {
        const response = await fetch('http://localhost:8080/api/adddava', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(davaDosya)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        event.reply('dava-form-response', result);
    } catch (error) {
        console.error('API isteği sırasında hata oluştu:', error);
        event.reply('dava-form-response', { error: error.message });
    }
});
    });
 


    async function getall(event,arg) {
        const arguman=arg
        try {
            const response = await fetch('http://localhost:8080/api/getall');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            event.reply('data-response', JSON.stringify(data),arguman);
        } catch (error) {
            console.error('Error fetching data:', error);
            event.reply('data-response', { error: error.message });
        }
    }

    async function getallbyarguman(event,arguman) {
        const apiUrl = `http://localhost:8080/api/bystatu?statu=${arguman}`;
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
         
            event.reply('data-response',JSON.stringify(data),arguman);
        } catch (error) {
            console.error('Error fetching data:', error);
            event.reply('data-response', { error: error.message });
        }
    }




function createMainWindow(filePath) {
  let win = new BrowserWindow({
    width: 600, 
    height: 950,
      webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
      }
  });
  win.setMenu(null);
  win.loadURL(url.format({
      pathname: path.join(__dirname, filePath),
      protocol: 'file:',
      slashes: true
  }));

  win.on('closed', () => {
      win = null;
  });
  mainWindow = win;
   
  currentWindow = win;
  return win;
}

function createWindow(filePath,widthv,heightv) {
  let win = new BrowserWindow({
    width: widthv, 
    height: heightv,
      webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
      }
  });
  win.setMenu(null);
  win.loadURL(url.format({
      pathname: path.join(__dirname, filePath),
      protocol: 'file:',
      slashes: true
  }));


  win.on('closed', () => {
      win = null;
  });

   
  currentWindow = win;

  return win;
}


function hidecreateWindow(filePath) {
  let win = new BrowserWindow({
   
      webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
      }
  });
  win.setMenu(null);
  win.maximize(); 
  win.loadURL(url.format({
      pathname: path.join(__dirname, filePath),
      protocol: 'file:',
      slashes: true
  }));

  win.on('closed', () => {
      win = null;
  });
  currentWindow = win;
    if (mainWindow) {
      mainWindow.hide();
  }
  
    
  return win;
}



