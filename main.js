const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  // あなたのUIをロード
  win.loadURL('http://localhost:5173'); // ← 本番ビルドしたらloadFileに変える！
}

// アプリが起動したら
app.whenReady().then(() => {
  createWindow();

  // レンダラーから受け取ったPowerShellコマンドを実行する
  ipcMain.handle('run-powershell-command', async (event, command) => {
    return new Promise((resolve, reject) => {
      // 管理者権限でPowerShellを実行（ウィンドウを非表示）
      const escapedCommand = command.replace(/"/g, '\\"');
      const fullCommand = `Start-Process powershell.exe -Verb RunAs -WindowStyle Hidden -ArgumentList '-NoProfile -ExecutionPolicy Bypass -Command "${escapedCommand}"'`;
      
      console.log('実行するコマンド:', fullCommand);
      
      exec(`powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command "${fullCommand}"`, (error, stdout, stderr) => {
        if (error) {
          console.error('PowerShell実行エラー:', error);
          console.error('エラー詳細:', stderr);
          reject(stderr);
        } else {
          console.log('PowerShell出力:', stdout);
          resolve(stdout);
        }
      });
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
