import { ipcRenderer } from 'electron';

// PowerShellコマンドを実行する関数
const runPowerShellCommand = async (command) => {
  try {
    const result = await ipcRenderer.invoke('run-powershell-command', command);
    console.log('実行成功:', result);
    return true;
  } catch (error) {
    console.error('実行失敗:', error);
    return false;
  }
};

// トグルのイベントハンドラを設定
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('input[type="checkbox"]');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('change', async (e) => {
      const isChecked = e.target.checked;
      const settingId = e.target.id;
      
      // 設定IDに応じて適切なPowerShellコマンドを実行
      let command = '';
      switch(settingId) {
        case 'disable-animations':
          command = isChecked ? 
            'Set-ItemProperty -Path "HKCU:\\Control Panel\\Desktop\\WindowMetrics" -Name "MinAnimate" -Type String -Value "0"' :
            'Set-ItemProperty -Path "HKCU:\\Control Panel\\Desktop\\WindowMetrics" -Name "MinAnimate" -Type String -Value "1"';
          break;
        case 'disable-transparency':
          command = isChecked ?
            'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" -Name "EnableTransparency" -Type DWord -Value 0' :
            'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" -Name "EnableTransparency" -Type DWord -Value 1';
          break;
        case 'disable-ad-id':
          command = isChecked ?
            'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" -Name "Enabled" -Type DWord -Value 0' :
            'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" -Name "Enabled" -Type DWord -Value 1';
          break;
        case 'disable-location':
          command = isChecked ?
            'Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location" -Name "Value" -Type String -Value "Deny"' :
            'Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location" -Name "Value" -Type String -Value "Allow"';
          break;
        case 'disable-clipboard-history':
          command = isChecked ?
            'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Clipboard" -Name "EnableClipboardHistory" -Type DWord -Value 0' :
            'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Clipboard" -Name "EnableClipboardHistory" -Type DWord -Value 1';
          break;
        case 'disable-background-apps':
          command = isChecked ?
            'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" -Name "GlobalUserDisabled" -Type DWord -Value 1' :
            'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" -Name "GlobalUserDisabled" -Type DWord -Value 0';
          break;
        case 'game-mode':
          command = isChecked ?
            'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -Name "AutoGameModeEnabled" -Type DWord -Value 1' :
            'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -Name "AutoGameModeEnabled" -Type DWord -Value 0';
          break;
        case 'disable-game-bar':
          command = isChecked ?
            'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -Name "UseNexusForGameBarEnabled" -Type DWord -Value 0' :
            'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -Name "UseNexusForGameBarEnabled" -Type DWord -Value 1';
          break;
        case 'optimize-visual-effects':
          command = isChecked ?
            'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" -Name "VisualFXSetting" -Type DWord -Value 2' :
            'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" -Name "VisualFXSetting" -Type DWord -Value 1';
          break;
        case 'disable-notifications':
          command = isChecked ?
            'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\PushNotifications" -Name "ToastEnabled" -Type DWord -Value 0' :
            'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\PushNotifications" -Name "ToastEnabled" -Type DWord -Value 1';
          break;
        default:
          console.error('未知の設定ID:', settingId);
          return;
      }
      
      const success = await runPowerShellCommand(command);
      if (!success) {
        // エラーが発生した場合はトグルを元の状態に戻す
        e.target.checked = !isChecked;
      }
    });
  });
});
