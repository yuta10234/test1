// ネットワークインターフェース情報を取得
ipcMain.handle('get-network-interfaces', async () => {
  return new Promise((resolve, reject) => {
    exec('powershell.exe -Command "Get-NetAdapter | Select-Object -ExpandProperty InterfaceDescription"', (error, stdout, stderr) => {
      if (error) {
        console.error(`エラー: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        reject(new Error(stderr));
        return;
      }
      const descriptions = stdout.trim().split('\n').map(line => line.trim());
      resolve(descriptions);
    });
  });
}); 