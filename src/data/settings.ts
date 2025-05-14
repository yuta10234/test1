import { Setting } from '../types';

export const defaultSettings: Setting[] = [
  // Windows Settings Section
  {
    id: 'windows-settings-header',
    name: 'Windows設定',
    description: 'Windowsの基本的な設定を変更して、システムの応答性を向上させます。',
    category: 'performance',
    section: 'windows',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: ''
    }
  },
  {
    id: 'disable-notifications',
    name: '通知を無効にする',
    description: 'Windowsの通知を無効にして、システムの応答性を向上させます。',
    category: 'performance',
    section: 'windows',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Set-ItemProperty -Path "HKCU:\\Software\\Policies\\Microsoft\\Windows\\Explorer" -Name "DisableNotificationCenter" -Type DWord -Value 1',
      disable: 'Set-ItemProperty -Path "HKCU:\\Software\\Policies\\Microsoft\\Windows\\Explorer" -Name "DisableNotificationCenter" -Type DWord -Value 0'
    }
  },
  {
    id: 'disable-window-snap',
    name: 'ウィンドウの自動整列を無効化',
    description: 'ウィンドウを画面端にドラッグしたときの自動整列（スナップ）機能を無効にします。細かいウィンドウ操作を好むユーザー向けの設定です。',
    category: 'performance',
    section: 'windows',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting window snap settings..."; try { reg add "HKCU\\Control Panel\\Desktop" /v "WindowArrangementActive" /t REG_SZ /d "0" /f; Write-Host "WindowArrangementActive set to 0 successfully" } catch { Write-Host "Error setting WindowArrangementActive: $_" }; Write-Host "Window snap settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting window snap settings..."; try { reg add "HKCU\\Control Panel\\Desktop" /v "WindowArrangementActive" /t REG_SZ /d "1" /f; Write-Host "WindowArrangementActive set to 1 successfully" } catch { Write-Host "Error setting WindowArrangementActive: $_" }; Write-Host "Window snap settings completed."\''
    }
  },
  {
    id: 'optimize-visual-effects-performance',
    name: '縮小版を表示する、その他の視覚効果をオフ（パフォーマンス優先）',
    description: 'ファイルやフォルダのアイコンを縮小版（サムネイル）で表示し、その他の視覚効果（アニメーションや影など）を無効にして、パフォーマンス重視の設定にします。',
    category: 'performance',
    section: 'windows',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting visual effects optimization..."; try { Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" -Name "VisualFXSetting" -Type DWord -Value 2; Write-Host "VisualFXSetting set to 2 successfully" } catch { Write-Host "Error setting VisualFXSetting: $_" }; try { Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "IconsOnly" -Type DWord -Value 0; Write-Host "IconsOnly set to 0 successfully" } catch { Write-Host "Error setting IconsOnly: $_" }; try { Set-ItemProperty -Path "HKCU:\\Control Panel\\Desktop" -Name "UserPreferencesMask" -Type Binary -Value ([byte[]](0x90,0x12,0x03,0x80,0x12,0x00,0x00,0x00)); Write-Host "UserPreferencesMask set successfully" } catch { Write-Host "Error setting UserPreferencesMask: $_" }; Write-Host "Visual effects optimization completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting visual effects restoration..."; try { Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" -Name "VisualFXSetting" -Type DWord -Value 1; Write-Host "VisualFXSetting set to 1 successfully" } catch { Write-Host "Error setting VisualFXSetting: $_" }; try { Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "IconsOnly" -Type DWord -Value 1; Write-Host "IconsOnly set to 1 successfully" } catch { Write-Host "Error setting IconsOnly: $_" }; try { Set-ItemProperty -Path "HKCU:\\Control Panel\\Desktop" -Name "UserPreferencesMask" -Type Binary -Value ([byte[]](0x90,0x12,0x03,0x80,0x10,0x00,0x00,0x00)); Write-Host "UserPreferencesMask set successfully" } catch { Write-Host "Error setting UserPreferencesMask: $_" }; Write-Host "Visual effects restoration completed."\''
    }
  },
  {
    id: 'disable-mouse-acceleration',
    name: 'ポインターの精度を高めるを無効',
    description: 'ポインター精度を高める設定を無効にし、マウス加速を無効にします。これにより、ポインターの動きがより直線的になり、精度が低下することなく安定した操作が可能です。',
    category: 'performance',
    section: 'windows',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; try { reg add "HKCU\\Control Panel\\Mouse" /v MouseSpeed /t REG_SZ /d "0" /f; Write-Host "MouseSpeed set to 0" } catch { Write-Host "Error setting MouseSpeed: $_" }; try { reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold1 /t REG_SZ /d "0" /f; Write-Host "MouseThreshold1 set to 0" } catch { Write-Host "Error setting MouseThreshold1: $_" }; try { reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold2 /t REG_SZ /d "0" /f; Write-Host "MouseThreshold2 set to 0" } catch { Write-Host "Error setting MouseThreshold2: $_" }\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; try { reg add "HKCU\\Control Panel\\Mouse" /v MouseSpeed /t REG_SZ /d "1" /f; Write-Host "MouseSpeed set to 1" } catch { Write-Host "Error setting MouseSpeed: $_" }; try { reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold1 /t REG_SZ /d "6" /f; Write-Host "MouseThreshold1 set to 6" } catch { Write-Host "Error setting MouseThreshold1: $_" }; try { reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold2 /t REG_SZ /d "10" /f; Write-Host "MouseThreshold2 set to 10" } catch { Write-Host "Error setting MouseThreshold2: $_" }\''
    }
  },
  {
    id: 'disable-transparency',
    name: '透過効果を無効にする',
    description: 'Windowsの透過効果を無効にして、グラフィックス処理を軽減します。',
    category: 'performance',
    section: 'windows',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" -Name "EnableTransparency" -Type DWord -Value 0',
      disable: 'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" -Name "EnableTransparency" -Type DWord -Value 1'
    }
  },
  {
    id: 'always-show-scrollbars',
    name: 'スクロールバーを常に表示する',
    description: 'アクセシビリティ設定のスクロールバーを常に表示にします。スクロールバーが自動で隠れなくなります。',
    category: 'performance',
    section: 'windows',
    enabled: false,
    supportedOS: ['win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting scrollbar settings..."; try { reg add "HKCU\\Control Panel\\Accessibility" /v "DynamicScrollbars" /t REG_DWORD /d "0" /f; Write-Host "DynamicScrollbars set to 0 successfully" } catch { Write-Host "Error setting DynamicScrollbars: $_" }; Write-Host "Scrollbar settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting scrollbar settings..."; try { reg add "HKCU\\Control Panel\\Accessibility" /v "DynamicScrollbars" /t REG_DWORD /d "1" /f; Write-Host "DynamicScrollbars set to 1 successfully" } catch { Write-Host "Error setting DynamicScrollbars: $_" }; Write-Host "Scrollbar settings completed."\''
    }
  },
  {
    id: 'disable-transparency-accessibility',
    name: '透明効果を無効にする（アクセシビリティ）',
    description: 'アクセシビリティ設定の透明効果を無効にします。',
    category: 'performance',
    section: 'windows',
    enabled: false,
    supportedOS: ['win11'],
    command: {
      enable: 'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" -Name "EnableTransparency" -Type DWord -Value 0',
      disable: 'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" -Name "EnableTransparency" -Type DWord -Value 1'
    }
  },
  {
    id: 'disable-animations',
    name: 'アニメーションを無効にする',
    description: 'Windowsのアニメーション効果を無効にして、システムの応答性を向上させます。',
    category: 'performance',
    section: 'windows',
    enabled: false,
    supportedOS: ['win10'],
    command: {
      enable: 'Set-ItemProperty -Path "HKCU:\\Control Panel\\Desktop\\WindowMetrics" -Name "MinAnimate" -Type String -Value "0"',
      disable: 'Set-ItemProperty -Path "HKCU:\\Control Panel\\Desktop\\WindowMetrics" -Name "MinAnimate" -Type String -Value "1"'
    }
  },
  // Privacy Settings Section
  {
    id: 'privacy-settings-header',
    name: 'プライバシー設定',
    description: 'プライバシーに関連する設定を調整して、システムのパフォーマンスを向上させます。',
    category: 'privacy',
    section: 'privacy',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: ''
    }
  },
  {
    id: 'disable-ad-id',
    name: '広告IDを無効にする',
    description: 'アプリケーションがパーソナライズされた広告を表示するために使用する広告IDを無効にします。',
    category: 'privacy',
    section: 'privacy',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting ad ID settings..."; try { reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" /v "Enabled" /t REG_DWORD /d "0" /f; Write-Host "Ad ID disabled successfully" } catch { Write-Host "Error disabling ad ID: $_" }; Write-Host "Ad ID settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting ad ID settings..."; try { reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" /v "Enabled" /t REG_DWORD /d "1" /f; Write-Host "Ad ID enabled successfully" } catch { Write-Host "Error enabling ad ID: $_" }; Write-Host "Ad ID settings completed."\''
    }
  },
  {
    id: 'disable-location',
    name: '位置情報を無効にする',
    description: 'Windowsアプリが位置情報にアクセスするのを防ぎます。',
    category: 'privacy',
    section: 'privacy',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting location settings..."; try { reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location" /v "Value" /t REG_SZ /d "Deny" /f; Write-Host "Location access denied successfully" } catch { Write-Host "Error denying location access: $_" }; Write-Host "Location settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting location settings..."; try { reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location" /v "Value" /t REG_SZ /d "Allow" /f; Write-Host "Location access allowed successfully" } catch { Write-Host "Error allowing location access: $_" }; Write-Host "Location settings completed."\''
    }
  },
  {
    id: 'disable-tailored-experiences',
    name: 'カスタマイズされたエクスペリエンス機能を無効化',
    description: 'Windowsのカスタマイズされたエクスペリエンス機能を無効にします。',
    category: 'privacy',
    section: 'privacy',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Tailored Experiences..."; try { reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Privacy" /v "TailoredExperiencesWithDiagnosticDataEnabled" /t REG_DWORD /d "0" /f; Write-Host "TailoredExperiencesWithDiagnosticDataEnabled disabled." } catch { Write-Host "Error disabling Tailored Experiences: $_" }; Write-Host "Tailored Experiences settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Tailored Experiences..."; try { reg delete "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Privacy" /v "TailoredExperiencesWithDiagnosticDataEnabled" /f; Write-Host "TailoredExperiencesWithDiagnosticDataEnabled enabled (deleted)." } catch { Write-Host "Error enabling Tailored Experiences: $_" }; Write-Host "Tailored Experiences settings completed."\''
    }
  },
  // System Settings Section
  {
    id: 'system-settings-header',
    name: 'システム設定',
    description: 'システムの動作に関する設定を調整して、パフォーマンスを最適化します。',
    category: 'performance',
    section: 'system',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: ''
    }
  },
  {
    id: 'disable-clipboard-history',
    name: 'クリップボード履歴を無効にする',
    description: 'Windowsがクリップボードの履歴を保存するのを防ぎます。',
    category: 'performance',
    section: 'system',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting clipboard history settings..."; try { reg add "HKCU\\Software\\Microsoft\\Clipboard" /v "EnableClipboardHistory" /t REG_DWORD /d "0" /f; Write-Host "Clipboard history disabled successfully" } catch { Write-Host "Error disabling clipboard history: $_" }; Write-Host "Clipboard history settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting clipboard history settings..."; try { reg add "HKCU\\Software\\Microsoft\\Clipboard" /v "EnableClipboardHistory" /t REG_DWORD /d "1" /f; Write-Host "Clipboard history enabled successfully" } catch { Write-Host "Error enabling clipboard history: $_" }; Write-Host "Clipboard history settings completed."\''
    }
  },
  {
    id: 'disable-background-apps',
    name: 'バックグラウンドアプリケーションを無効にする',
    description: 'バックグラウンドでのアプリケーションの実行を無効にしてリソースを節約します。',
    category: 'performance',
    section: 'system',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting background apps settings..."; try { reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v "GlobalUserDisabled" /t REG_DWORD /d "1" /f; Write-Host "Background apps disabled successfully" } catch { Write-Host "Error disabling background apps: $_" }; Write-Host "Background apps settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting background apps settings..."; try { reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v "GlobalUserDisabled" /t REG_DWORD /d "0" /f; Write-Host "Background apps enabled successfully" } catch { Write-Host "Error enabling background apps: $_" }; Write-Host "Background apps settings completed."\''
    }
  },
  {
    id: 'disable-fast-startup',
    name: '高速スタートアップを無効にする',
    description: 'Windowsの高速スタートアップ機能を無効にして、完全なシャットダウンと起動を保証します。',
    category: 'performance',
    section: 'system',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Fast Startup..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v "HiberbootEnabled" /t REG_DWORD /d "0" /f; Write-Host "Fast Startup disabled successfully." } catch { Write-Host "Error disabling Fast Startup: $_" }; Write-Host "Fast Startup settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Fast Startup..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v "HiberbootEnabled" /t REG_DWORD /d "1" /f; Write-Host "Fast Startup enabled successfully." } catch { Write-Host "Error enabling Fast Startup: $_" }; Write-Host "Fast Startup settings completed."\''
    }
  },
  {
    id: 'disable-hibernation',
    name: '休止状態を無効にする',
    description: 'Windowsの休止状態機能を無効にします。ディスク容量を節約できますが、PCの起動が少し遅くなる可能性があります。',
    category: 'performance',
    section: 'system',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Hibernation..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v "HibernateEnabled" /t REG_DWORD /d "0" /f; Write-Host "Hibernation disabled successfully." } catch { Write-Host "Error disabling Hibernation: $_" }; Write-Host "Hibernation settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Hibernation..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v "HibernateEnabled" /t REG_DWORD /d "1" /f; Write-Host "Hibernation enabled successfully." } catch { Write-Host "Error enabling Hibernation: $_" }; Write-Host "Hibernation settings completed."\''
    }
  },
  // Game Settings
  {
    id: 'game-mode',
    name: 'ゲームモードを有効にする',
    description: 'Windowsのゲームモードを有効にしてゲームのパフォーマンスを向上させます。',
    category: 'game',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -Name "AutoGameModeEnabled" -Type DWord -Value 1',
      disable: 'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -Name "AutoGameModeEnabled" -Type DWord -Value 0'
    }
  },
  // Cleanup Settings
  {
    id: 'clear-temp-files',
    name: '一時ファイルをクリアする',
    description: 'Windowsの一時ファイルをクリアしてディスク容量を解放します。',
    category: 'cleanup',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Remove-Item -Path "$env:TEMP\\*" -Recurse -Force',
      disable: 'echo "No action for disabling this setting"'
    }
  },
  {
    id: 'clear-prefetch',
    name: 'プリフェッチをクリアする',
    description: 'Windowsのプリフェッチファイルをクリアしてシステムを最適化します。',
    category: 'cleanup',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Remove-Item -Path "C:\\Windows\\Prefetch\\*" -Force',
      disable: 'echo "No action for disabling this setting"'
    }
  },
  {
    id: 'disk-cleanup',
    name: 'ディスククリーンアップを実行する',
    description: 'Windowsのディスククリーンアップツールを実行してシステムファイルをクリーンアップします。',
    category: 'cleanup',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process -FilePath cleanmgr.exe -ArgumentList "/sagerun:1" -NoNewWindow',
      disable: 'echo "No action for disabling this setting"'
    }
  },
  // BCD Settings Section
  {
    id: 'bcd-settings-header',
    name: 'BCD調整',
    description: 'Windowsの起動設定（BCD）を調整して、システムのパフォーマンスを向上させます。',
    category: 'performance',
    section: 'bcd',
    enabled: false,
    supportedOS: ['win11'],
    command: {
      enable: '',
      disable: ''
    }
  },
  {
    id: 'disable-platform-clock',
    name: 'プラットフォームクロックを無効化',
    description: 'プラットフォームクロックを無効にします。',
    category: 'performance',
    section: 'bcd',
    enabled: false,
    supportedOS: ['win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting platform clock settings..."; try { bcdedit /set useplatformclock No; Write-Host "Platform clock disabled successfully" } catch { Write-Host "Error disabling platform clock: $_" }; Write-Host "Platform clock settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting platform clock settings..."; try { bcdedit /set useplatformclock Yes; Write-Host "Platform clock enabled successfully" } catch { Write-Host "Error enabling platform clock: $_" }; Write-Host "Platform clock settings completed."\''
    }
  },
  {
    id: 'disable-dynamic-tick',
    name: 'ダイナミックティックを無効化',
    description: 'ダイナミックティックを無効にします。',
    category: 'performance',
    section: 'bcd',
    enabled: false,
    supportedOS: ['win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting dynamic tick settings..."; try { bcdedit /set disabledynamictick Yes; Write-Host "Dynamic tick disabled successfully" } catch { Write-Host "Error disabling dynamic tick: $_" }; Write-Host "Dynamic tick settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting dynamic tick settings..."; try { bcdedit /set disabledynamictick No; Write-Host "Dynamic tick enabled successfully" } catch { Write-Host "Error enabling dynamic tick: $_" }; Write-Host "Dynamic tick settings completed."\''
    }
  },
  // Gaming Settings Section
  {
    id: 'gaming-settings-header',
    name: 'ゲーミング設定',
    description: 'ゲームのパフォーマンスを向上させるための設定',
    category: 'performance',
    section: 'gaming',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: ''
    }
  },
  {
    id: 'optimize-memory-usage',
    name: 'メモリ使用量の最適化',
    description: 'メモリ使用量を最適化します。',
    category: 'performance',
    section: 'gaming',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        '1': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting memory usage settings..."; try { fsutil behavior set memoryusage 1; Write-Host "Memory usage set to 1 successfully" } catch { Write-Host "Error setting memory usage: $_" }; Write-Host "Memory usage settings completed."\'',
        '2': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting memory usage settings..."; try { fsutil behavior set memoryusage 2; Write-Host "Memory usage set to 2 successfully" } catch { Write-Host "Error setting memory usage: $_" }; Write-Host "Memory usage settings completed."\''
      }
    }
  },
  {
    id: 'optimize-mft-zone',
    name: 'MFTゾーンの最適化',
    description: 'MFTゾーンを最適化します。',
    category: 'performance',
    section: 'gaming',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        '1': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting MFT zone settings..."; try { fsutil behavior set mftzone 1; Write-Host "MFT zone set to 1 successfully" } catch { Write-Host "Error setting MFT zone: $_" }; Write-Host "MFT zone settings completed."\'',
        '2': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting MFT zone settings..."; try { fsutil behavior set mftzone 2; Write-Host "MFT zone set to 2 successfully" } catch { Write-Host "Error setting MFT zone: $_" }; Write-Host "MFT zone settings completed."\'',
        '3': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting MFT zone settings..."; try { fsutil behavior set mftzone 3; Write-Host "MFT zone set to 3 successfully" } catch { Write-Host "Error setting MFT zone: $_" }; Write-Host "MFT zone settings completed."\'',
        '4': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting MFT zone settings..."; try { fsutil behavior set mftzone 4; Write-Host "MFT zone set to 4 successfully" } catch { Write-Host "Error setting MFT zone: $_" }; Write-Host "MFT zone settings completed."\''
      }
    }
  },
  {
    id: 'disable-last-access',
    name: '最終アクセス時刻の記録を無効化',
    description: '最終アクセス時刻の記録を無効にします。',
    category: 'performance',
    section: 'gaming',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting last access settings..."; try { fsutil behavior set disablelastaccess 1; Write-Host "Last access disabled successfully" } catch { Write-Host "Error disabling last access: $_" }; Write-Host "Last access settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting last access settings..."; try { fsutil behavior set disablelastaccess 0; Write-Host "Last access enabled successfully" } catch { Write-Host "Error enabling last access: $_" }; Write-Host "Last access settings completed."\''
    }
  },
  {
    id: 'enable-delete-notify',
    name: '削除通知を有効化',
    description: '削除通知を有効にします。',
    category: 'performance',
    section: 'gaming',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting delete notify settings..."; try { fsutil behavior set disabledeletenotify 0; Write-Host "Delete notify enabled successfully" } catch { Write-Host "Error enabling delete notify: $_" }; Write-Host "Delete notify settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Starting delete notify settings..."; try { fsutil behavior set disabledeletenotify 1; Write-Host "Delete notify disabled successfully" } catch { Write-Host "Error disabling delete notify: $_" }; Write-Host "Delete notify settings completed."\''
    }
  },
  // Additional Performance and System Tweaks
  {
    id: 'disable-sleep-diagnostics',
    name: 'スリープ関連の診断を無効化',
    description: 'スリープ信頼性診断とスリープスタディを無効にし、関連するオーバーヘッドを削減します。',
    category: 'performance',
    section: 'power',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Sleep Diagnostics..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v "SleepReliabilityDetailedDiagnostics" /t REG_DWORD /d "0" /f; Write-Host "SleepReliabilityDetailedDiagnostics disabled."; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v "SleepStudyDisabled" /t REG_DWORD /d "1" /f; Write-Host "SleepStudyDisabled disabled." } catch { Write-Host "Error disabling sleep diagnostics: $_" }; Write-Host "Sleep diagnostics settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Sleep Diagnostics..."; try { reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v "SleepReliabilityDetailedDiagnostics" /f; Write-Host "SleepReliabilityDetailedDiagnostics enabled (default)."; reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v "SleepStudyDisabled" /f; Write-Host "SleepStudyDisabled enabled (default)." } catch { Write-Host "Error enabling sleep diagnostics: $_" }; Write-Host "Sleep diagnostics settings completed."\'' // Default values might vary, using delete as a general revert
    }
  },
  {
    id: 'disable-fth',
    name: 'Fault Tolerant Heap (FTH) を無効化',
    description: 'アプリケーションクラッシュの診断機能であるFTHを無効にします。一部のゲームでパフォーマンスが向上する可能性があります。',
    category: 'performance',
    section: 'system',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling FTH..."; try { reg add "HKLM\\SOFTWARE\\Microsoft\\FTH" /v "Enabled" /t REG_DWORD /d "0" /f; Write-Host "FTH disabled." } catch { Write-Host "Error disabling FTH: $_" }; Write-Host "FTH settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling FTH..."; try { reg add "HKLM\\SOFTWARE\\Microsoft\\FTH" /v "Enabled" /t REG_DWORD /d "1" /f; Write-Host "FTH enabled." } catch { Write-Host "Error enabling FTH: $_" }; Write-Host "FTH settings completed."\'' // Assuming 1 is the default enabled state
    }
  },
  {
    id: 'disable-timer-coalescing',
    name: 'タイマー結合 (Timer Coalescing) を無効化',
    description: '複数のシステムコンポーネントでタイマー結合を無効にし、レイテンシを改善する可能性があります。',
    category: 'performance',
    section: 'gaming',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Timer Coalescing..."; try { $paths = @("HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager", "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power", "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management", "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\kernel", "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Executive", "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\ModernSleep", "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power"); foreach ($path in $paths) { reg add $path /v "CoalescingTimerInterval" /t REG_DWORD /d "0" /f; Write-Host "Disabled CoalescingTimerInterval in $path" } } catch { Write-Host "Error disabling Timer Coalescing: $_" }; Write-Host "Timer Coalescing settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Timer Coalescing (Deleting Keys)..."; try { $paths = @("HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager", "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power", "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management", "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\kernel", "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Executive", "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\ModernSleep", "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power"); foreach ($path in $paths) { reg delete $path /v "CoalescingTimerInterval" /f; Write-Host "Deleted CoalescingTimerInterval in $path" } } catch { Write-Host "Error enabling Timer Coalescing: $_" }; Write-Host "Timer Coalescing settings completed."\'' // Deleting the key reverts to default behavior
    }
  },
  {
    id: 'disable-modern-standby',
    name: 'モダンスタンバイ (Connected Standby) を無効化',
    description: 'モダンスタンバイ (CsEnabled, PlatformAoAcOverride) を無効にし、従来のスリープモード (S3) を強制します（ハードウェアがサポートしている場合）。',
    category: 'performance',
    section: 'power',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Modern Standby..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v "CsEnabled" /t REG_DWORD /d "0" /f; Write-Host "CsEnabled disabled."; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v "PlatformAoAcOverride" /t REG_DWORD /d "0" /f; Write-Host "PlatformAoAcOverride disabled." } catch { Write-Host "Error disabling Modern Standby: $_" }; Write-Host "Modern Standby settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Modern Standby..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v "CsEnabled" /t REG_DWORD /d "1" /f; Write-Host "CsEnabled enabled."; reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v "PlatformAoAcOverride" /f; Write-Host "PlatformAoAcOverride deleted (revert)." } catch { Write-Host "Error enabling Modern Standby: $_" }; Write-Host "Modern Standby settings completed."\''
    }
  },
  {
    id: 'disable-power-saving-features',
    name: '省電力関連機能を無効化',
    description: 'エネルギー推定、イベントプロセッサ、パワースロットリングを無効にします。',
    category: 'performance',
    section: 'power',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Power Saving Features..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v "EnergyEstimationEnabled" /t REG_DWORD /d "0" /f; Write-Host "EnergyEstimationEnabled disabled."; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v "EventProcessorEnabled" /t REG_DWORD /d "0" /f; Write-Host "EventProcessorEnabled disabled."; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v "PowerThrottlingOff" /t REG_DWORD /d "1" /f; Write-Host "PowerThrottling disabled." } catch { Write-Host "Error disabling power saving features: $_" }; Write-Host "Power saving settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Power Saving Features..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v "EnergyEstimationEnabled" /t REG_DWORD /d "1" /f; Write-Host "EnergyEstimationEnabled enabled."; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v "EventProcessorEnabled" /t REG_DWORD /d "1" /f; Write-Host "EventProcessorEnabled enabled."; reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v "PowerThrottlingOff" /f; Write-Host "PowerThrottling enabled (deleted)." } catch { Write-Host "Error enabling power saving features: $_" }; Write-Host "Power saving settings completed."\''
    }
  },
  {
    id: 'enable-hw-gpu-scheduling',
    name: 'ハードウェアアクセラレータGPUスケジューリングを有効化',
    description: '対応GPUでハードウェアアクセラレータGPUスケジューリングを有効にし、遅延を削減しパフォーマンスを向上させます。再起動が必要です。',
    category: 'performance',
    section: 'graphics',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Hardware GPU Scheduling..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v "HwSchMode" /t REG_DWORD /d "2" /f; Write-Host "HwSchMode set to 2 (Enabled)." } catch { Write-Host "Error enabling HwSchMode: $_" }; Write-Host "Hardware GPU Scheduling setting completed. Restart required."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Hardware GPU Scheduling..."; try { reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v "HwSchMode" /f; Write-Host "HwSchMode deleted (reverted to default)." } catch { Write-Host "Error disabling HwSchMode: $_" }; Write-Host "Hardware GPU Scheduling setting completed. Restart required."\''
    }
  },
  {
    id: 'disable-gpu-energy-driver',
    name: 'GPU省電力ドライバを無効化 (GpuEnergyDrv)',
    description: 'GPUの省電力ドライバ (GpuEnergyDrv) を無効にします。一部環境でのパフォーマンス問題回避に役立つ場合があります。',
    category: 'performance',
    section: 'graphics',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling GpuEnergyDrv..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\GpuEnergyDrv" /v "Start" /t REG_DWORD /d "4" /f; Write-Host "GpuEnergyDrv Start set to 4 (Disabled)."; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\GpuEnergyDr" /v "Start" /t REG_DWORD /d "4" /f; Write-Host "GpuEnergyDr Start set to 4 (Disabled)." } catch { Write-Host "Error disabling GpuEnergyDrv: $_" }; Write-Host "GpuEnergyDrv setting completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling GpuEnergyDrv..."; try { reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\GpuEnergyDrv" /v "Start" /f; Write-Host "GpuEnergyDrv Start deleted."; reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\GpuEnergyDr" /v "Start" /f; Write-Host "GpuEnergyDr Start deleted." } catch { Write-Host "Error enabling GpuEnergyDrv: $_" }; Write-Host "GpuEnergyDrv setting completed."\''
    }
  },
  {
    id: 'disable-nvidia-write-combining',
    name: 'NVIDIA Write Combining を無効化',
    description: 'Write Combining機能を無効にします。FPSが低下する可能性がありますが、遅延が大幅に低下します。',
    category: 'performance',
    section: 'nvidia',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling NVIDIA Write Combining..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\nvlddmkm" /v "DisableWriteCombining" /t REG_DWORD /d "1" /f; Write-Host "DisableWriteCombining set to 1." } catch { Write-Host "Error disabling NVIDIA Write Combining: $_" }; Write-Host "NVIDIA Write Combining setting completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling NVIDIA Write Combining..."; try { reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\nvlddmkm" /v "DisableWriteCombining" /f; Write-Host "DisableWriteCombining deleted (reverted to default)." } catch { Write-Host "Error enabling NVIDIA Write Combining: $_" }; Write-Host "NVIDIA Write Combining setting completed."\''
    }
  },
  {
    id: 'optimize-multimedia-game-profile',
    name: 'マルチメディア/ゲームプロファイルの最適化',
    description: 'Windowsのマルチメディアシステムプロファイル（特にゲームタスク）を最適化し、優先度を高め、レイテンシを改善します。',
    category: 'performance',
    section: 'gaming',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Optimizing Multimedia/Game Profile..."; try { reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "NoLazyMode" /t REG_DWORD /d "1" /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "AlwaysOn" /t REG_DWORD /d "1" /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "GPU Priority" /t REG_DWORD /d "8" /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Priority" /t REG_DWORD /d "6" /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Scheduling Category" /t REG_SZ /d "High" /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "SFIO Priority" /t REG_SZ /d "High" /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Latency Sensitive" /t REG_SZ /d "True" /f; Write-Host "Multimedia/Game Profile optimized." } catch { Write-Host "Error optimizing Multimedia/Game Profile: $_" }; Write-Host "Multimedia/Game Profile settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Reverting Multimedia/Game Profile..."; try { reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "NoLazyMode" /f; reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "AlwaysOn" /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "GPU Priority" /t REG_DWORD /d "8" /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Priority" /t REG_DWORD /d "2" /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Scheduling Category" /t REG_SZ /d "Medium" /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "SFIO Priority" /t REG_SZ /d "Normal" /f; reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Latency Sensitive" /f; Write-Host "Multimedia/Game Profile reverted." } catch { Write-Host "Error reverting Multimedia/Game Profile: $_" }; Write-Host "Multimedia/Game Profile settings completed."\''
    }
  },
  {
    id: 'optimize-reliability-monitor',
    name: '信頼性モニターの最適化',
    description: '信頼性モニターのタイムスタンプ間隔とIO優先度を調整します。',
    category: 'performance',
    section: 'gaming',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Optimizing Reliability Monitor..."; try { reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Reliability" /v "TimeStampInterval" /t REG_DWORD /d "1" /f; Write-Host "TimeStampInterval set to 1."; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Reliability" /v "IoPriority" /t REG_DWORD /d "3" /f; Write-Host "IoPriority set to 3." } catch { Write-Host "Error optimizing Reliability Monitor: $_" }; Write-Host "Reliability Monitor settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Reverting Reliability Monitor..."; try { reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Reliability" /v "TimeStampInterval" /t REG_DWORD /d "1" /f; Write-Host "TimeStampInterval set to 1."; reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Reliability" /v "IoPriority" /f; Write-Host "IoPriority deleted." } catch { Write-Host "Error reverting Reliability Monitor: $_" }; Write-Host "Reliability Monitor settings completed."\''
    }
  },
  {
    id: 'optimize-csrss-priority',
    name: 'CSRSSプロセスの優先度を最適化',
    description: '重要なシステムプロセスであるCSRSS.exeのCPUおよびIO優先度を調整します。',
    category: 'performance',
    section: 'gaming',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Optimizing CSRSS Priority..."; try { reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\csrss.exe\\PerfOptions" /v "CpuPriorityClass" /t REG_DWORD /d "4" /f; Write-Host "CSRSS CpuPriorityClass set to 4."; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\csrss.exe\\PerfOptions" /v "IoPriority" /t REG_DWORD /d "3" /f; Write-Host "CSRSS IoPriority set to 3." } catch { Write-Host "Error optimizing CSRSS Priority: $_" }; Write-Host "CSRSS Priority settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Reverting CSRSS Priority..."; try { reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\csrss.exe\\PerfOptions" /v "CpuPriorityClass" /f; Write-Host "CSRSS CpuPriorityClass deleted."; reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\csrss.exe\\PerfOptions" /v "IoPriority" /f; Write-Host "CSRSS IoPriority deleted." } catch { Write-Host "Error reverting CSRSS Priority: $_" }; Write-Host "CSRSS Priority settings completed."\''
    }
  },
  // Power Settings Section
  {
    id: 'power-settings-header',
    name: '電源設定',
    description: '電源管理に関する設定を調整して、パフォーマンスを最適化します。',
    category: 'performance',
    section: 'power',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: ''
    }
  },
  // Graphics Settings Section
  {
    id: 'graphics-settings-header',
    name: 'グラフィックス設定',
    description: 'グラフィックス関連の設定を調整して、パフォーマンスを最適化します。',
    category: 'performance',
    section: 'graphics',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: ''
    }
  },
  // NVIDIA Settings Section
  {
    id: 'nvidia-settings-header',
    name: 'NVIDIA設定',
    description: 'NVIDIAグラフィックスカードの設定を調整して、パフォーマンスを最適化します。',
    category: 'performance',
    section: 'nvidia',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: ''
    }
  },
  // UI Settings Section
  {
    id: 'ui-settings-header',
    name: 'UI応答性設定',
    description: 'ユーザーインターフェースの応答性を向上させるための設定',
    category: 'performance',
    section: 'ui',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: ''
    }
  },
  {
    id: 'disable-menu-delay',
    name: 'メニュー表示遅延をなくす',
    description: 'メニュー表示の遅延をなくし、より素早い操作を可能にします。',
    category: 'performance',
    section: 'system',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling menu delay..."; try { reg add "HKCU\\Control Panel\\Desktop" /v "MenuShowDelay" /t REG_DWORD /d "0" /f; Write-Host "MenuShowDelay set to 0." } catch { Write-Host "Error disabling menu delay: $_" }; Write-Host "Menu delay settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling menu delay..."; try { reg add "HKCU\\Control Panel\\Desktop" /v "MenuShowDelay" /t REG_DWORD /d "400" /f; Write-Host "MenuShowDelay set to 400 (default)." } catch { Write-Host "Error enabling menu delay: $_" }; Write-Host "Menu delay settings completed."\''
    }
  },
  {
    id: 'optimize-system-responsiveness',
    name: 'システム応答性の最適化',
    description: 'システムの応答性を向上させ、ゲームやアプリケーションの動作をよりスムーズにします。',
    category: 'performance',
    section: 'gaming',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Optimizing system responsiveness..."; try { reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "SystemResponsiveness" /t REG_DWORD /d "10" /f; Write-Host "SystemResponsiveness set to 10." } catch { Write-Host "Error optimizing system responsiveness: $_" }; Write-Host "System responsiveness settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Reverting system responsiveness..."; try { reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "SystemResponsiveness" /t REG_DWORD /d "20" /f; Write-Host "SystemResponsiveness set to 20 (default)." } catch { Write-Host "Error reverting system responsiveness: $_" }; Write-Host "System responsiveness settings completed."\''
    }
  },
  {
    id: 'disable-windows-features',
    name: 'Windowsの不要な機能を無効化',
    description: 'Windowsの不要な機能（コンテンツ配信、共有、検索履歴など）を無効にします。',
    category: 'performance',
    section: 'windows',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Windows features..."; try { reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SoftLandingEnabled" /t REG_DWORD /d "0" /f; Write-Host "SoftLandingEnabled disabled."; reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "RotatingLockScreenOverlayEnabled" /t REG_DWORD /d "0" /f; Write-Host "RotatingLockScreenOverlayEnabled disabled."; reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CDP" /v "CdpSessionUserAuthzPolicy" /t REG_DWORD /d "0" /f; Write-Host "CdpSessionUserAuthzPolicy disabled."; reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CDP" /v "NearShareChannelUserAuthzPolicy" /t REG_DWORD /d "0" /f; Write-Host "NearShareChannelUserAuthzPolicy disabled."; reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Search" /v "DeviceHistoryEnabled" /t REG_DWORD /d "0" /f; Write-Host "DeviceHistoryEnabled disabled."; reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Search" /v "BingSearchEnabled" /t REG_DWORD /d "0" /f; Write-Host "BingSearchEnabled disabled." } catch { Write-Host "Error disabling Windows features: $_" }; Write-Host "Windows features settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Windows features..."; try { reg delete "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SoftLandingEnabled" /f; Write-Host "SoftLandingEnabled deleted."; reg delete "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "RotatingLockScreenOverlayEnabled" /f; Write-Host "RotatingLockScreenOverlayEnabled deleted."; reg delete "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CDP" /v "CdpSessionUserAuthzPolicy" /f; Write-Host "CdpSessionUserAuthzPolicy deleted."; reg delete "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CDP" /v "NearShareChannelUserAuthzPolicy" /f; Write-Host "NearShareChannelUserAuthzPolicy deleted."; reg delete "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Search" /v "DeviceHistoryEnabled" /f; Write-Host "DeviceHistoryEnabled deleted."; reg delete "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Search" /v "BingSearchEnabled" /f; Write-Host "BingSearchEnabled deleted." } catch { Write-Host "Error enabling Windows features: $_" }; Write-Host "Windows features settings completed."\''
    }
  },
  {
    id: 'disable-explorer-features',
    name: 'エクスプローラーの不要な機能を無効化',
    description: 'エクスプローラーの不要な機能（最近使用したファイル、頻繁に使用するファイル、テレメトリなど）を無効にします。',
    category: 'performance',
    section: 'windows',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Explorer features..."; try { reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer" /v "ShowFrequent" /t REG_DWORD /d "0" /f; Write-Host "ShowFrequent disabled."; reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer" /v "ShowRecent" /t REG_DWORD /d "0" /f; Write-Host "ShowRecent disabled."; reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer" /v "TelemetrySalt" /t REG_DWORD /d "0" /f; Write-Host "TelemetrySalt disabled."; reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" /v "NoRecentDocsHistory" /t REG_DWORD /d "1" /f; Write-Host "NoRecentDocsHistory enabled." } catch { Write-Host "Error disabling Explorer features: $_" }; Write-Host "Explorer features settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Explorer features..."; try { reg delete "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer" /v "ShowFrequent" /f; Write-Host "ShowFrequent enabled (deleted)."; reg delete "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer" /v "ShowRecent" /f; Write-Host "ShowRecent enabled (deleted)."; reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer" /v "TelemetrySalt" /t REG_DWORD /d "3" /f; Write-Host "TelemetrySalt set to 3."; reg delete "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" /v "NoRecentDocsHistory" /f; Write-Host "NoRecentDocsHistory disabled (deleted)." } catch { Write-Host "Error enabling Explorer features: $_" }; Write-Host "Explorer features settings completed."\''
    }
  },
  {
    id: 'optimize-graphics-driver-hdcp',
    name: 'グラフィックスドライバ設定の最適化 (HDCP)',
    description: 'HDCP関連のグラフィックスドライバ設定を調整します。',
    category: 'performance',
    section: 'graphics',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Optimizing Graphics Driver HDCP Settings..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000" /v "RMHdcpKeyGlobZero" /t REG_DWORD /d "1" /f; Write-Host "RMHdcpKeyGlobZero set to 1." } catch { Write-Host "Error optimizing graphics HDCP settings: $_" }; Write-Host "Graphics HDCP settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Reverting Graphics Driver HDCP Settings..."; try { reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000" /v "RMHdcpKeyGlobZero" /f; Write-Host "RMHdcpKeyGlobZero deleted." } catch { Write-Host "Error reverting graphics HDCP settings: $_" }; Write-Host "Graphics HDCP settings completed."\''
    }
  },
  {
    id: 'optimize-graphics-driver-tcc',
    name: 'グラフィックスドライバ設定の最適化 (TCC)',
    description: 'TCC関連のグラフィックスドライバ設定を調整します。',
    category: 'performance',
    section: 'graphics',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Optimizing Graphics Driver TCC Settings..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000" /v "TCCSupported" /t REG_DWORD /d "0" /f; Write-Host "TCCSupported set to 0." } catch { Write-Host "Error optimizing graphics TCC settings: $_" }; Write-Host "Graphics TCC settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Reverting Graphics Driver TCC Settings..."; try { reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000" /v "TCCSupported" /f; Write-Host "TCCSupported deleted." } catch { Write-Host "Error reverting graphics TCC settings: $_" }; Write-Host "Graphics TCC settings completed."\''
    }
  },
  {
    id: 'disable-network-throttling',
    name: 'ネットワークスロットリングを無効化',
    description: 'ネットワークスロットリングを無効にし、ネットワークパフォーマンスを向上させます。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Network Throttling..."; try { reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d "4294967295" /f; Write-Host "Network Throttling disabled successfully" } catch { Write-Host "Error disabling Network Throttling: $_" }; Write-Host "Network Throttling settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Network Throttling..."; try { reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d "10" /f; Write-Host "Network Throttling enabled with value 10" } catch { Write-Host "Error enabling Network Throttling: $_" }; Write-Host "Network Throttling settings completed."\''
    }
  },
  {
    id: 'tcp-auto-tuning',
    name: 'TCP自動チューニングレベル',
    description: 'TCPの自動チューニングレベルを設定します。ネットワークのパフォーマンスに影響します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'disabled': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting TCP Auto-Tuning Level to disabled..."; try { netsh int tcp set global autotuninglevel=disabled; Write-Host "TCP Auto-Tuning Level set to disabled successfully" } catch { Write-Host "Error setting TCP Auto-Tuning Level: $_" }; Write-Host "TCP Auto-Tuning Level settings completed."\'',
        'normal': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting TCP Auto-Tuning Level to normal..."; try { netsh int tcp set global autotuninglevel=normal; Write-Host "TCP Auto-Tuning Level set to normal successfully" } catch { Write-Host "Error setting TCP Auto-Tuning Level: $_" }; Write-Host "TCP Auto-Tuning Level settings completed."\'',
        'highlyrestricted': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting TCP Auto-Tuning Level to highlyrestricted..."; try { netsh int tcp set global autotuninglevel=highlyrestricted; Write-Host "TCP Auto-Tuning Level set to highlyrestricted successfully" } catch { Write-Host "Error setting TCP Auto-Tuning Level: $_" }; Write-Host "TCP Auto-Tuning Level settings completed."\'',
        'restricted': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting TCP Auto-Tuning Level to restricted..."; try { netsh int tcp set global autotuninglevel=restricted; Write-Host "TCP Auto-Tuning Level set to restricted successfully" } catch { Write-Host "Error setting TCP Auto-Tuning Level: $_" }; Write-Host "TCP Auto-Tuning Level settings completed."\'',
        'experimental': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting TCP Auto-Tuning Level to experimental..."; try { netsh int tcp set global autotuninglevel=experimental; Write-Host "TCP Auto-Tuning Level set to experimental successfully" } catch { Write-Host "Error setting TCP Auto-Tuning Level: $_" }; Write-Host "TCP Auto-Tuning Level settings completed."\''
      }
    }
  },
  {
    id: 'tcp-ecn-capability',
    name: 'ECN Capability',
    description: 'TCPのECN（Explicit Congestion Notification）機能を制御します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'disabled': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting ECN Capability to disabled..."; try { netsh int tcp set global ecncapability=disabled; Write-Host "ECN Capability set to disabled successfully" } catch { Write-Host "Error setting ECN Capability: $_" }; Write-Host "ECN Capability settings completed."\'',
        'enabled': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting ECN Capability to enabled..."; try { netsh int tcp set global ecncapability=enabled; Write-Host "ECN Capability set to enabled successfully" } catch { Write-Host "Error setting ECN Capability: $_" }; Write-Host "ECN Capability settings completed."\''
      }
    }
  },
  {
    id: 'tcp-direct-cache-access',
    name: 'Direct Cache Access',
    description: 'TCPのDirect Cache Access機能を制御します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Direct Cache Access..."; try { netsh int tcp set global dca=enabled; Write-Host "Direct Cache Access enabled successfully" } catch { Write-Host "Error enabling Direct Cache Access: $_" }; Write-Host "Direct Cache Access settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Direct Cache Access..."; try { netsh int tcp set global dca=disabled; Write-Host "Direct Cache Access disabled successfully" } catch { Write-Host "Error disabling Direct Cache Access: $_" }; Write-Host "Direct Cache Access settings completed."\''
    }
  },
  {
    id: 'tcp-network-direct-memory-access',
    name: 'Network Direct Memory Access',
    description: 'TCPのNetwork Direct Memory Access機能を制御します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Network Direct Memory Access..."; try { netsh int tcp set global netdma=enabled; Write-Host "Network Direct Memory Access enabled successfully" } catch { Write-Host "Error enabling Network Direct Memory Access: $_" }; Write-Host "Network Direct Memory Access settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Network Direct Memory Access..."; try { netsh int tcp set global netdma=disabled; Write-Host "Network Direct Memory Access disabled successfully" } catch { Write-Host "Error disabling Network Direct Memory Access: $_" }; Write-Host "Network Direct Memory Access settings completed."\''
    }
  },
  {
    id: 'tcp-receive-side-coalescing',
    name: 'Receive Side Coalescing (RSC)',
    description: 'TCPのReceive Side Coalescing機能を制御します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'disabled': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Receive Side Coalescing to disabled..."; try { netsh int tcp set global rsc=disabled; Write-Host "Receive Side Coalescing set to disabled successfully" } catch { Write-Host "Error setting Receive Side Coalescing: $_" }; Write-Host "Receive Side Coalescing settings completed."\'',
        'enabled': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Receive Side Coalescing to enabled..."; try { netsh int tcp set global rsc=enabled; Write-Host "Receive Side Coalescing set to enabled successfully" } catch { Write-Host "Error setting Receive Side Coalescing: $_" }; Write-Host "Receive Side Coalescing settings completed."\''
      }
    }
  },
  {
    id: 'tcp-receive-side-scaling',
    name: 'Receive Side Scaling (RSS)',
    description: 'ネットワーク処理を複数のCPUコアに分散させ、ネットワークパフォーマンスを向上させます。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'disabled': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Receive Side Scaling to disabled..."; try { netsh int tcp set global rss=disabled; Write-Host "RSS disabled successfully" } catch { Write-Host "Error disabling RSS: $_" }; Write-Host "RSS settings completed."\'',
        'enabled': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Receive Side Scaling to enabled..."; try { netsh int tcp set global rss=enabled; Write-Host "RSS enabled successfully" } catch { Write-Host "Error enabling RSS: $_" }; Write-Host "RSS settings completed."\''
      }
    }
  },
  {
    id: 'tcp-initial-retransmission-timer',
    name: 'Initial Retransmission Timer',
    description: 'TCPの初期再送タイマーを設定します。ネットワークの遅延に応じて調整できます。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'custom': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Initial Retransmission Timer..."; try { netsh int tcp set global initialRto=%value%; Write-Host "Initial Retransmission Timer set successfully" } catch { Write-Host "Error setting Initial Retransmission Timer: $_" }; Write-Host "Initial Retransmission Timer settings completed."\''
      }
    }
  },
  {
    id: 'tcp-wifi-mtu',
    name: 'MTUサイズ',
    description: 'netsh interface ipv4 show subinterfacesでインターフェースを取得し(MTU)サイズを設定します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'custom': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Wi-Fi MTU size..."; try { netsh interface ipv4 set subinterface "Wi-Fi" mtu=%value% store=persistent; Write-Host "Wi-Fi MTU size set to %value% successfully" } catch { Write-Host "Error setting Wi-Fi MTU size: $_" }; Write-Host "Wi-Fi MTU size settings completed."\''
      }
    }
  },
  {
    id: 'tcp-nonsackrttresiliency',
    name: 'NonSackRTTresiliency',
    description: 'TCPのNonSackRTTresiliencyを制御します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'enabled': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling NonSackRTTresiliency..."; try { netsh int tcp set global nonsackrttresiliency=enabled; Write-Host "NonSackRTTresiliency enabled successfully" } catch { Write-Host "Error enabling NonSackRTTresiliency: $_" }; Write-Host "NonSackRTTresiliency settings completed."\'',
        'disabled': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling NonSackRTTresiliency..."; try { netsh int tcp set global nonsackrttresiliency=disabled; Write-Host "NonSackRTTresiliency disabled successfully" } catch { Write-Host "Error disabling NonSackRTTresiliency: $_" }; Write-Host "NonSackRTTresiliency settings completed."\''
      }
    }
  },
  {
    id: 'tcp-congestion-provider',
    name: '輻輳制御プロバイダー',
    description: 'TCPの輻輳制御プロバイダーを設定します。ネットワークのパフォーマンスに影響します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'none': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Congestion Provider to disabled..."; try { netsh int tcp set supplemental Internet congestionprovider=none; Write-Host "Congestion Provider set to disabled successfully" } catch { Write-Host "Error setting Congestion Provider: $_" }; Write-Host "Congestion Provider settings completed."\'',
        'ctcp': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Congestion Provider to CTCP..."; try { netsh int tcp set supplemental Internet congestionprovider=ctcp; Write-Host "Congestion Provider set to CTCP successfully" } catch { Write-Host "Error setting Congestion Provider: $_" }; Write-Host "Congestion Provider settings completed."\'',
        'cubic': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Congestion Provider to CUBIC..."; try { netsh int tcp set supplemental Internet congestionprovider=cubic; Write-Host "Congestion Provider set to CUBIC successfully" } catch { Write-Host "Error setting Congestion Provider: $_" }; Write-Host "Congestion Provider settings completed."\'',
        'dctcp': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Congestion Provider to DCTCP..."; try { netsh int tcp set supplemental Internet congestionprovider=dctcp; Write-Host "Congestion Provider set to DCTCP successfully" } catch { Write-Host "Error setting Congestion Provider: $_" }; Write-Host "Congestion Provider settings completed."\'',
        'newreno': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Congestion Provider to NewReno..."; try { netsh int tcp set supplemental Internet congestionprovider=newreno; Write-Host "Congestion Provider set to NewReno successfully" } catch { Write-Host "Error setting Congestion Provider: $_" }; Write-Host "Congestion Provider settings completed."\''
      }
    }
  },
  {
    id: 'tcp-memory-pressure-protection',
    name: 'メモリ圧力保護',
    description: 'TCPのメモリ圧力保護を制御します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'disabled': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Memory Pressure Protection to disabled..."; try { netsh int tcp set security mpp=disabled; Write-Host "Memory Pressure Protection set to disabled successfully" } catch { Write-Host "Error setting Memory Pressure Protection: $_" }; Write-Host "Memory Pressure Protection settings completed."\'',
        'enabled': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Memory Pressure Protection to enabled..."; try { netsh int tcp set security mpp=enabled; Write-Host "Memory Pressure Protection set to enabled successfully" } catch { Write-Host "Error setting Memory Pressure Protection: $_" }; Write-Host "Memory Pressure Protection settings completed."\''
      }
    }
  },
  {
    id: 'tcp-scaling-heuristics',
    name: 'スケーリングヒューリスティック',
    description: 'TCPのスケーリングヒューリスティックを制御します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'disabled': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Scaling Heuristics to disabled..."; try { netsh int tcp set heuristics disabled; Write-Host "Scaling Heuristics set to disabled successfully" } catch { Write-Host "Error setting Scaling Heuristics: $_" }; Write-Host "Scaling Heuristics settings completed."\'',
        'enabled': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Scaling Heuristics to enabled..."; try { netsh int tcp set heuristics enabled; Write-Host "Scaling Heuristics set to enabled successfully" } catch { Write-Host "Error setting Scaling Heuristics: $_" }; Write-Host "Scaling Heuristics settings completed."\''
      }
    }
  },
  {
    id: 'tcp-max-syn-retransmissions',
    name: '最大SYN再送信回数',
    description: 'TCPの最大SYN再送信回数を設定します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        '2': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Max SYN Retransmissions to 2..."; try { netsh int tcp set global maxsynretransmissions=2; Write-Host "Max SYN Retransmissions set to 2 successfully" } catch { Write-Host "Error setting Max SYN Retransmissions: $_" }; Write-Host "Max SYN Retransmissions settings completed."\'',
        '3': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Max SYN Retransmissions to 3..."; try { netsh int tcp set global maxsynretransmissions=3; Write-Host "Max SYN Retransmissions set to 3 successfully" } catch { Write-Host "Error setting Max SYN Retransmissions: $_" }; Write-Host "Max SYN Retransmissions settings completed."\'',
        '4': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Max SYN Retransmissions to 4..."; try { netsh int tcp set global maxsynretransmissions=4; Write-Host "Max SYN Retransmissions set to 4 successfully" } catch { Write-Host "Error setting Max SYN Retransmissions: $_" }; Write-Host "Max SYN Retransmissions settings completed."\''
      }
    }
  },
  {
    id: 'ip-arp-cache-size',
    name: 'ARPキャッシュサイズ',
    description: 'ARPキャッシュのサイズを4096に増やします。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting ARP Cache Size..."; try { netsh int ip set global neighborcachelimit=4096; Write-Host "ARP Cache Size set successfully" } catch { Write-Host "Error setting ARP Cache Size: $_" }; Write-Host "ARP Cache Size settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Resetting ARP Cache Size..."; try { netsh int ip set global neighborcachelimit=256; Write-Host "ARP Cache Size reset successfully" } catch { Write-Host "Error resetting ARP Cache Size: $_" }; Write-Host "ARP Cache Size settings completed."\''
    }
  },
  {
    id: 'ip-task-offload',
    name: 'タスクオフロード',
    description: 'ネットワークタスクオフロードを無効にします。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Task Offload..."; try { netsh int ip set global taskoffload=disabled; Write-Host "Task Offload disabled successfully" } catch { Write-Host "Error disabling Task Offload: $_" }; Write-Host "Task Offload settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Task Offload..."; try { netsh int ip set global taskoffload=enabled; Write-Host "Task Offload enabled successfully" } catch { Write-Host "Error enabling Task Offload: $_" }; Write-Host "Task Offload settings completed."\''
    }
  },
  {
    id: 'ipv6-state',
    name: 'IPv6',
    description: 'IPv6を無効にします。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling IPv6..."; try { netsh int ipv6 set state disabled; Write-Host "IPv6 disabled successfully" } catch { Write-Host "Error disabling IPv6: $_" }; Write-Host "IPv6 settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling IPv6..."; try { netsh int ipv6 set state enabled; Write-Host "IPv6 enabled successfully" } catch { Write-Host "Error enabling IPv6: $_" }; Write-Host "IPv6 settings completed."\''
    }
  },
  {
    id: 'isatap-state',
    name: 'ISATAP',
    description: 'ISATAPを無効にします。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling ISATAP..."; try { netsh int isatap set state disabled; Write-Host "ISATAP disabled successfully" } catch { Write-Host "Error disabling ISATAP: $_" }; Write-Host "ISATAP settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling ISATAP..."; try { netsh int isatap set state enabled; Write-Host "ISATAP enabled successfully" } catch { Write-Host "Error enabling ISATAP: $_" }; Write-Host "ISATAP settings completed."\''
    }
  },
  {
    id: 'teredo-state',
    name: 'Teredo',
    description: 'Teredoを無効にします。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Teredo..."; try { netsh int teredo set state disabled; Write-Host "Teredo disabled successfully" } catch { Write-Host "Error disabling Teredo: $_" }; Write-Host "Teredo settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Teredo..."; try { netsh int teredo set state enabled; Write-Host "Teredo enabled successfully" } catch { Write-Host "Error enabling Teredo: $_" }; Write-Host "Teredo settings completed."\''
    }
  },
  {
    id: 'ip-ttl',
    name: 'TTL',
    description: 'IPパケットのTTL（Time To Live）値を設定します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'custom': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting TTL..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "DefaultTTL" /t REG_DWORD /d "%value%" /f; Write-Host "TTL set successfully" } catch { Write-Host "Error setting TTL: $_" }; Write-Host "TTL settings completed."\''
      }
    }
  },
  {
    id: 'tcp-window-scaling',
    name: 'TCPウィンドウスケーリング',
    description: 'TCPウィンドウスケーリングを有効にします。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling TCP Window Scaling..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "Tcp1323Opts" /t REG_DWORD /d "1" /f; Write-Host "TCP Window Scaling enabled successfully" } catch { Write-Host "Error enabling TCP Window Scaling: $_" }; Write-Host "TCP Window Scaling settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling TCP Window Scaling..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "Tcp1323Opts" /t REG_DWORD /d "0" /f; Write-Host "TCP Window Scaling disabled successfully" } catch { Write-Host "Error disabling TCP Window Scaling: $_" }; Write-Host "TCP Window Scaling settings completed."\''
    }
  },
  {
    id: 'tcp-max-dup-acks',
    name: 'TCP重複Ack回数',
    description: 'TCPの重複Ack回数を設定します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting TCP Max Dup Acks..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "TcpMaxDupAcks" /t REG_DWORD /d "2" /f; Write-Host "TCP Max Dup Acks set successfully" } catch { Write-Host "Error setting TCP Max Dup Acks: $_" }; Write-Host "TCP Max Dup Acks settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Resetting TCP Max Dup Acks..."; try { reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "TcpMaxDupAcks" /f; Write-Host "TCP Max Dup Acks reset successfully" } catch { Write-Host "Error resetting TCP Max Dup Acks: $_" }; Write-Host "TCP Max Dup Acks settings completed."\''
    }
  },
  {
    id: 'tcp-sack-opts',
    name: 'SackOpts',
    description: 'TCPのSackOptsを無効にします。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling SackOpts..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "SackOpts" /t REG_DWORD /d "0" /f; Write-Host "SackOpts disabled successfully" } catch { Write-Host "Error disabling SackOpts: $_" }; Write-Host "SackOpts settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling SackOpts..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "SackOpts" /t REG_DWORD /d "1" /f; Write-Host "SackOpts enabled successfully" } catch { Write-Host "Error enabling SackOpts: $_" }; Write-Host "SackOpts settings completed."\''
    }
  },
  {
    id: 'tcp-max-user-port',
    name: 'ポート番号数',
    description: '使用可能なポート番号の最大数を設定します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'custom': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Max User Port..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "MaxUserPort" /t REG_DWORD /d "%value%" /f; Write-Host "Max User Port set successfully" } catch { Write-Host "Error setting Max User Port: $_" }; Write-Host "Max User Port settings completed."\''
      }
    }
  },
  {
    id: 'tcp-timed-wait-delay',
    name: 'TimeWaitDelay',
    description: 'TCPのTimeWaitDelayを設定します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'custom': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting TimeWaitDelay..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "TcpTimedWaitDelay" /t REG_DWORD /d "%value%" /f; Write-Host "TimeWaitDelay set successfully" } catch { Write-Host "Error setting TimeWaitDelay: $_" }; Write-Host "TimeWaitDelay settings completed."\''
      }
    }
  },
  {
    id: 'network-priority',
    name: 'ネットワーク優先順位',
    description: 'ネットワークの優先順位を変更します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Network Priority..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\ServiceProvider" /v "LocalPriority" /t REG_DWORD /d "4" /f; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\ServiceProvider" /v "HostsPriority" /t REG_DWORD /d "5" /f; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\ServiceProvider" /v "DnsPriority" /t REG_DWORD /d "6" /f; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\ServiceProvider" /v "NetbtPriority" /t REG_DWORD /d "7" /f; Write-Host "Network Priority set successfully" } catch { Write-Host "Error setting Network Priority: $_" }; Write-Host "Network Priority settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Resetting Network Priority..."; try { reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\ServiceProvider" /v "LocalPriority" /f; reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\ServiceProvider" /v "HostsPriority" /f; reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\ServiceProvider" /v "DnsPriority" /f; reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\ServiceProvider" /v "NetbtPriority" /f; Write-Host "Network Priority reset successfully" } catch { Write-Host "Error resetting Network Priority: $_" }; Write-Host "Network Priority settings completed."\''
    }
  },
  {
    id: 'winsock-addr-size',
    name: 'ソケットアドレスサイズ',
    description: 'Winsockのソケットアドレスサイズを変更します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Winsock Address Size..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Winsock" /v "MinSockAddrLength" /t REG_DWORD /d "16" /f; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Winsock" /v "MaxSockAddrLength" /t REG_DWORD /d "16" /f; Write-Host "Winsock Address Size set successfully" } catch { Write-Host "Error setting Winsock Address Size: $_" }; Write-Host "Winsock Address Size settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Resetting Winsock Address Size..."; try { reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Winsock" /v "MinSockAddrLength" /f; reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Winsock" /v "MaxSockAddrLength" /f; Write-Host "Winsock Address Size reset successfully" } catch { Write-Host "Error resetting Winsock Address Size: $_" }; Write-Host "Winsock Address Size settings completed."\''
    }
  },
  {
    id: 'delivery-optimization',
    name: '配信の最適化',
    description: 'Windowsの配信の最適化を無効にします。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Delivery Optimization..."; try { reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DeliveryOptimization\\Config" /v "DODownloadMode" /t REG_DWORD /d "0" /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DeliveryOptimization\\Config" /v "DownloadMode" /t REG_DWORD /d "0" /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DeliveryOptimization\\Settings" /v "DownloadMode" /t REG_DWORD /d "0" /f; Write-Host "Delivery Optimization disabled successfully" } catch { Write-Host "Error disabling Delivery Optimization: $_" }; Write-Host "Delivery Optimization settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Delivery Optimization..."; try { reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DeliveryOptimization\\Config" /v "DODownloadMode" /f; reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DeliveryOptimization\\Config" /v "DownloadMode" /f; reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DeliveryOptimization\\Settings" /v "DownloadMode" /f; Write-Host "Delivery Optimization enabled successfully" } catch { Write-Host "Error enabling Delivery Optimization: $_" }; Write-Host "Delivery Optimization settings completed."\''
    }
  },
  {
    id: 'auto-disconnect',
    name: 'アイドル時の自動切断',
    description: 'アイドル時の自動切断を無効にします。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Auto Disconnect..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\services\\LanmanServer\\Parameters" /v "autodisconnect" /t REG_DWORD /d "4294967295" /f; Write-Host "Auto Disconnect disabled successfully" } catch { Write-Host "Error disabling Auto Disconnect: $_" }; Write-Host "Auto Disconnect settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Auto Disconnect..."; try { reg delete "HKLM\\SYSTEM\\CurrentControlSet\\services\\LanmanServer\\Parameters" /v "autodisconnect" /f; Write-Host "Auto Disconnect enabled successfully" } catch { Write-Host "Error enabling Auto Disconnect: $_" }; Write-Host "Auto Disconnect settings completed."\''
    }
  },
  {
    id: 'smb-session-limit',
    name: 'SMBセッション数',
    description: 'SMBセッション数の制限を設定します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting SMB Session Limit..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\services\\LanmanServer\\Parameters" /v "Size" /t REG_DWORD /d "3" /f; Write-Host "SMB Session Limit set successfully" } catch { Write-Host "Error setting SMB Session Limit: $_" }; Write-Host "SMB Session Limit settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Resetting SMB Session Limit..."; try { reg delete "HKLM\\SYSTEM\\CurrentControlSet\\services\\LanmanServer\\Parameters" /v "Size" /f; Write-Host "SMB Session Limit reset successfully" } catch { Write-Host "Error resetting SMB Session Limit: $_" }; Write-Host "SMB Session Limit settings completed."\''
    }
  },
  {
    id: 'smb-oplocks',
    name: 'Oplocks',
    description: 'SMBのOplocksを無効にします。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Oplocks..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\services\\LanmanServer\\Parameters" /v "EnableOplocks" /t REG_DWORD /d "0" /f; Write-Host "Oplocks disabled successfully" } catch { Write-Host "Error disabling Oplocks: $_" }; Write-Host "Oplocks settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Oplocks..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\services\\LanmanServer\\Parameters" /v "EnableOplocks" /t REG_DWORD /d "1" /f; Write-Host "Oplocks enabled successfully" } catch { Write-Host "Error enabling Oplocks: $_" }; Write-Host "Oplocks settings completed."\''
    }
  },
  {
    id: 'irp-stack-size',
    name: 'IRP Stack Size',
    description: 'IRP Stack Sizeを設定します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'custom': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting IRP Stack Size..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\services\\LanmanServer\\Parameters" /v "IRPStackSize" /t REG_DWORD /d "%value%" /f; Write-Host "IRP Stack Size set successfully" } catch { Write-Host "Error setting IRP Stack Size: $_" }; Write-Host "IRP Stack Size settings completed."\''
      }
    }
  },
  {
    id: 'sharing-violation',
    name: '共有違反',
    description: '共有違反の処理を無効にします。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Disabling Sharing Violation..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\services\\LanmanServer\\Parameters" /v "SharingViolationDelay" /t REG_DWORD /d "0" /f; reg add "HKLM\\SYSTEM\\CurrentControlSet\\services\\LanmanServer\\Parameters" /v "SharingViolationRetries" /t REG_DWORD /d "0" /f; Write-Host "Sharing Violation disabled successfully" } catch { Write-Host "Error disabling Sharing Violation: $_" }; Write-Host "Sharing Violation settings completed."\'',
      disable: 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Enabling Sharing Violation..."; try { reg delete "HKLM\\SYSTEM\\CurrentControlSet\\services\\LanmanServer\\Parameters" /v "SharingViolationDelay" /f; reg delete "HKLM\\SYSTEM\\CurrentControlSet\\services\\LanmanServer\\Parameters" /v "SharingViolationRetries" /f; Write-Host "Sharing Violation enabled successfully" } catch { Write-Host "Error enabling Sharing Violation: $_" }; Write-Host "Sharing Violation settings completed."\''
    }
  },
  {
    id: 'tcp-ack-frequency',
    name: 'TCP ACK Frequency',
    description: 'TCP ACK Frequencyの設定を変更します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'default': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Removing TcpAckFrequency..."; try { reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces" /v "TcpAckFrequency" /f; Write-Host "TcpAckFrequency removed successfully" } catch { Write-Host "Error removing TcpAckFrequency: $_" }; Write-Host "TcpAckFrequency settings completed."\'',
        'disabled': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting TcpAckFrequency..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces" /v "TcpAckFrequency" /t REG_DWORD /d "0" /f; Write-Host "TcpAckFrequency set successfully" } catch { Write-Host "Error setting TcpAckFrequency: $_" }; Write-Host "TcpAckFrequency settings completed."\''
      }
    }
  },
  {
    id: 'tcp-no-delay',
    name: 'TCP No Delay',
    description: 'TCP No Delayの設定を変更します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'default': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Removing TCPNoDelay..."; try { reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces" /v "TCPNoDelay" /f; Write-Host "TCPNoDelay removed successfully" } catch { Write-Host "Error removing TCPNoDelay: $_" }; Write-Host "TCPNoDelay settings completed."\'',
        'disabled': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting TCPNoDelay..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces" /v "TCPNoDelay" /t REG_DWORD /d "0" /f; Write-Host "TCPNoDelay set successfully" } catch { Write-Host "Error setting TCPNoDelay: $_" }; Write-Host "TCPNoDelay settings completed."\'',
        'enabled': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting TCPNoDelay..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces" /v "TCPNoDelay" /t REG_DWORD /d "1" /f; Write-Host "TCPNoDelay set successfully" } catch { Write-Host "Error setting TCPNoDelay: $_" }; Write-Host "TCPNoDelay settings completed."\''
      }
    }
  },
  {
    id: 'tcp-del-ack-ticks',
    name: 'TCP Delayed ACK Ticks',
    description: 'TCP Delayed ACK Ticksの設定を変更します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'default': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Removing TcpDelAckTicks..."; try { reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces" /v "TcpDelAckTicks" /f; Write-Host "TcpDelAckTicks removed successfully" } catch { Write-Host "Error removing TcpDelAckTicks: $_" }; Write-Host "TcpDelAckTicks settings completed."\'',
        'disabled': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting TcpDelAckTicks..."; try { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces" /v "TcpDelAckTicks" /t REG_DWORD /d "0" /f; Write-Host "TcpDelAckTicks set successfully" } catch { Write-Host "Error setting TcpDelAckTicks: $_" }; Write-Host "TcpDelAckTicks settings completed."\''
      }
    }
  },
  {
    id: 'non-best-effort-limit',
    name: 'NonBestEffortLimit',
    description: 'ネットワークの優先度制御の設定を変更します。0から100の値で指定します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'custom': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting NonBestEffortLimit..."; try { reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Psched" /v "NonBestEffortLimit" /t REG_DWORD /d "%value%" /f; Write-Host "NonBestEffortLimit set successfully" } catch { Write-Host "Error setting NonBestEffortLimit: $_" }; Write-Host "NonBestEffortLimit settings completed."\''
      }
    }
  },
  {
    id: 'qos-do-not-use-nla',
    name: 'Do not use NLA',
    description: 'QoSのNLA（Network Location Awareness）の使用を制御します。',
    category: 'network',
    section: 'tcpip',
    enabled: false,
    supportedOS: ['win10', 'win11'],
    command: {
      enable: '',
      disable: '',
      options: {
        'default': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Resetting Do not use NLA..."; try { Remove-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\QoS" -Name "Do not use NLA" -ErrorAction SilentlyContinue; Write-Host "Do not use NLA reset to default successfully" } catch { Write-Host "Error resetting Do not use NLA: $_" }; Write-Host "Do not use NLA settings completed."\'',
        'optimized': 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; Write-Host "Setting Do not use NLA..."; try { if(!(Test-Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\QoS")) { New-Item -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\QoS" -Force }; Set-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\QoS" -Name "Do not use NLA" -Value "1" -Type String; Write-Host "Do not use NLA set successfully" } catch { Write-Host "Error setting Do not use NLA: $_" }; Write-Host "Do not use NLA settings completed."\''
      }
    }
  },
];