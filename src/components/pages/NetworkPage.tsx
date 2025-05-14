import React, { useEffect, useRef, useState } from 'react';
import { Wifi } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useSystem } from '../../context/SystemContext';
import ToggleSwitch from '../ui/ToggleSwitch';
import Toast, { ToastType } from '../ui/Toast';
import { Setting } from '../../types';

const NetworkPage: React.FC = () => {
  const { getSettingsByCategory, toggleSetting, loading } = useSettings();
  const { systemInfo } = useSystem();
  const [toast, setToast] = React.useState<{ type: ToastType; message: string } | null>(null);
  const [selectedValues, setSelectedValues] = React.useState<{ [key: string]: string }>({});
  const [customValues, setCustomValues] = React.useState<{ [key: string]: string }>({
    'tcp-wifi-mtu': '1500', // デフォルト値
  });
  const [networkInterfaces, setNetworkInterfaces] = React.useState<{ name: string; description: string }[]>([]);
  const [mtuInterfaces, setMtuInterfaces] = React.useState<string[]>([]);
  const [selectedInterface, setSelectedInterface] = React.useState<string>('');
  const [selectedNetworkInterface, setSelectedNetworkInterface] = React.useState<string>('');
  const [isLoadingTcpSettings, setIsLoadingTcpSettings] = React.useState(false);
  const [isLoadingAdapterSettings, setIsLoadingAdapterSettings] = React.useState(false);
  const [isLoadingRscSettings, setIsLoadingRscSettings] = React.useState(false);
  const [isLoadingInterfaces, setIsLoadingInterfaces] = React.useState(false);
  const tcpSettingsRef = useRef(false);
  const adapterSettingsRef = useRef(false);
  const rscSettingsRef = useRef(false);
  const [tcpChecksumOffload, setTcpChecksumOffload] = React.useState<string>('');
  const [tcpChecksumOffloadIPv6, setTcpChecksumOffloadIPv6] = React.useState<string>('');
  const [udpChecksumOffloadIPv4, setUdpChecksumOffloadIPv4] = React.useState<string>('');
  const [udpChecksumOffloadIPv6, setUdpChecksumOffloadIPv6] = React.useState<string>('');
  const [ipv4ChecksumOffload, setIpv4ChecksumOffload] = React.useState<string>('');
  const [largeSendOffloadV2IPv4, setLargeSendOffloadV2IPv4] = React.useState<string>('');
  const [largeSendOffloadV2IPv6, setLargeSendOffloadV2IPv6] = React.useState<string>('');
  const [arpOffload, setArpOffload] = React.useState<string>('');
  const [nsOffload, setNsOffload] = React.useState<string>('');
  const [receiveSideScaling, setReceiveSideScaling] = React.useState<string>('');
  const [flowControl, setFlowControl] = React.useState<string>('');
  const [powerSavingSettings, setPowerSavingSettings] = React.useState<{
    eee: string;
    advancedEee: string;
    greenEthernet: string;
    autoGigabitDisable: string;
    gigabitLite: string;
    powerSavingMode: string;
  }>({
    eee: '',
    advancedEee: '',
    greenEthernet: '',
    autoGigabitDisable: '',
    gigabitLite: '',
    powerSavingMode: ''
  });

  const [wakeupSettings, setWakeupSettings] = React.useState<{
    wakeOnMagicPacket: string;
    wakeOnPatternMatch: string;
    wakeOnLanShutdown: string;
    wakeOnMagicPacketS4S5: string;
  }>({
    wakeOnMagicPacket: '',
    wakeOnPatternMatch: '',
    wakeOnLanShutdown: '',
    wakeOnMagicPacketS4S5: ''
  });
  
  const networkSettings = getSettingsByCategory('network');
  const settings = networkSettings.filter(setting => 
    setting.section === 'tcpip' &&
    (!setting.supportedOS || (Array.isArray(setting.supportedOS) && setting.supportedOS.includes(systemInfo.windowsVersion!)))
  );

  // Advanced Settingsに移動するIDリスト
  const advancedSettingIds = [
    'tcp-nonsackrttresiliency',
    'tcp-max-user-port',
    'tcp-ack-frequency',
    'tcp-initial-retransmission-timer',
    'tcp-max-syn-retransmissions',
    'tcp-timed-wait-delay',
    'tcp-no-delay',
    'irp-stack-size',
    'tcp-del-ack-ticks',
    'tcp-memory-pressure-protection',
  ];
  // タブの型定義を更新
  const [activeTab, setActiveTab] = React.useState<'general' | 'advanced' | 'extra'>('general');

  // 状態の追加
  const [interruptModeration, setInterruptModeration] = React.useState<string>('');
  const [maxRssQueues, setMaxRssQueues] = React.useState<string>('');
  const [priorityVlan, setPriorityVlan] = React.useState<string>('');
  const [wolShutdownLinkSpeed, setWolShutdownLinkSpeed] = React.useState<string>('');
  const [speedDuplex, setSpeedDuplex] = React.useState<string>('');
  const [networkRegistryPath, setNetworkRegistryPath] = React.useState<string>('');
  const [transmitBuffers, setTransmitBuffers] = React.useState<string>('');
  const [receiveBuffers, setReceiveBuffers] = React.useState<string>('');
  const [isLoadingRegistry, setIsLoadingRegistry] = React.useState<boolean>(false);
  const [maxRssProcessors, setMaxRssProcessors] = useState<string>('');
  const [rssMaxProcNumber, setRssMaxProcNumber] = useState<string>('');
  const [intDelayValues, setIntDelayValues] = useState<{TxAbsIntDelay: string, TxIntDelay: string, RxAbsIntDelay: string, RxIntDelay: string}>({TxAbsIntDelay: '', TxIntDelay: '', RxAbsIntDelay: '', RxIntDelay: ''});
  const [threadedDpcEnabled, setThreadedDpcEnabled] = useState<boolean>(false);
  const [threadedDpcValues, setThreadedDpcValues] = useState<{ThreadedDpcEnable: string, TxThreadedDpcEnable: string}>({ThreadedDpcEnable: '', TxThreadedDpcEnable: ''});

  // レジストリパスをローカルストレージから読み込む
  useEffect(() => {
    const savedPath = localStorage.getItem('networkRegistryPath');
    if (savedPath) {
      setNetworkRegistryPath(savedPath);
      // 保存されていたパスで値を取得
      getRegistryValues(savedPath);
    }
  }, []);

  useEffect(() => {
    const fetchNetworkInterfaces = async () => {
      setIsLoadingInterfaces(true);
      try {
        const command = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting Network Interfaces..."; try { Get-NetAdapter; Write-Host "Network Interfaces retrieved successfully" } catch { Write-Host "Error getting Network Interfaces: $_" }; Write-Host "Network Interfaces retrieval completed."\'';
        const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
        
        if (output) {
          const lines = output.split('\n');
          const interfaces: { name: string; description: string }[] = [];
          
          // ヘッダー行をスキップして各行を処理
          lines.slice(2).forEach((line: string) => {
            // ログメッセージとヘッダーを除外
            if (!line.includes('----') && 
                !line.includes('Getting') && 
                !line.includes('retrieved') && 
                !line.includes('completed') &&
                !line.includes('InterfaceDescription')) {
              
              // 行を分割して必要な部分を抽出
              const parts = line.split(/\s{2,}/); // 2つ以上の空白で分割
              if (parts.length >= 2) {
                // Name列とInterfaceDescription列の値を取得
                const name = parts[0].trim();
                const description = parts[1].trim();
                if (name && description) {
                  interfaces.push({ name, description });
                }
              }
            }
          });
          
          setNetworkInterfaces(interfaces);
          // 最初のインターフェースを自動選択
          if (interfaces.length > 0) {
            setSelectedNetworkInterface(interfaces[0].name);
          }
        }
      } catch (error) {
        console.error('ネットワークインターフェースの取得に失敗しました:', error);
        setToast({
          type: 'error',
          message: 'ネットワークインターフェースの取得に失敗しました',
        });
      } finally {
        setIsLoadingInterfaces(false);
      }
    };

    fetchNetworkInterfaces();
  }, []);

  useEffect(() => {
    if (tcpSettingsRef.current) return;
    tcpSettingsRef.current = true;

    const getTcpSettings = async () => {
      setIsLoadingTcpSettings(true);
      try {
        const command = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting TCP Settings..."; try { Get-NetTCPSetting -SettingName Internet; Write-Host "TCP Settings retrieved successfully" } catch { Write-Host "Error getting TCP Settings: $_" }; Write-Host "TCP Settings retrieval completed."\'';
        const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
        
        if (output) {
          // AutoTuningLevelLocalの値を取得
          const lines = output.split('\n');
          const autoTuningLine = lines.find((line: string) => line.includes('AutoTuningLevelLocal'));
          if (autoTuningLine) {
            const currentValue = autoTuningLine.split(':')[1].trim().toLowerCase();
            setSelectedValues(prev => ({
              ...prev,
              'tcp-auto-tuning': currentValue
            }));
          }

          // CongestionProviderの値を取得
          const congestionProviderLine = lines.find((line: string) => line.includes('CongestionProvider'));
          if (congestionProviderLine) {
            const currentValue = congestionProviderLine.split(':')[1].trim().toLowerCase();
            setSelectedValues(prev => ({
              ...prev,
              'tcp-congestion-provider': currentValue === 'none' ? 'disabled' : currentValue
            }));
          }

          // MemoryPressureProtectionの値を取得
          const mppLine = lines.find((line: string) => line.includes('MemoryPressureProtection'));
          if (mppLine) {
            const currentValue = mppLine.split(':')[1].trim().toLowerCase();
            setSelectedValues(prev => ({
              ...prev,
              'tcp-memory-pressure-protection': currentValue
            }));
          }

          // ScalingHeuristicsの値を取得
          const heuristicsLine = lines.find((line: string) => line.includes('ScalingHeuristics'));
          if (heuristicsLine) {
            const currentValue = heuristicsLine.split(':')[1].trim().toLowerCase();
            setSelectedValues(prev => ({
              ...prev,
              'tcp-scaling-heuristics': currentValue
            }));
          }

          // MaxSynRetransmissionsの値を取得
          const maxSynLine = lines.find((line: string) => line.includes('MaxSynRetransmissions'));
          if (maxSynLine) {
            const currentValue = maxSynLine.split(':')[1].trim();
            setSelectedValues(prev => ({
              ...prev,
              'tcp-max-syn-retransmissions': currentValue
            }));
          }

          // ECN Capabilityの値を取得
          const ecnCapabilityLine = lines.find((line: string) => line.includes('EcnCapability'));
          if (ecnCapabilityLine) {
            const currentValue = ecnCapabilityLine.split(':')[1].trim().toLowerCase();
            setSelectedValues(prev => ({
              ...prev,
              'tcp-ecn-capability': currentValue
            }));
          }

          // TCP ACK Frequencyの値を取得
          const tcpAckFrequencyCommand = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting TCP ACK Frequency..."; try { $value = (Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces" -Name TcpAckFrequency).TcpAckFrequency; Write-Host "TCP ACK Frequency: $value" } catch { Write-Host "Error getting TCP ACK Frequency: $_" }; Write-Host "TCP ACK Frequency retrieval completed."\'';
          const tcpAckFrequencyOutput = await window.electron.ipcRenderer.invoke('run-powershell-command', tcpAckFrequencyCommand);
          const tcpAckFrequencyValue = tcpAckFrequencyOutput.match(/TCP ACK Frequency: (\d+)/)?.[1] || '';
          setSelectedValues(prev => ({
            ...prev,
            'tcp-ack-frequency': tcpAckFrequencyValue === '0' ? 'disabled' : 'default'
          }));

          // TCP No Delayの値を取得
          const tcpNoDelayCommand = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting TCP No Delay..."; try { $value = (Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces" -Name TCPNoDelay).TCPNoDelay; Write-Host "TCP No Delay: $value" } catch { Write-Host "Error getting TCP No Delay: $_" }; Write-Host "TCP No Delay retrieval completed."\'';
          const tcpNoDelayOutput = await window.electron.ipcRenderer.invoke('run-powershell-command', tcpNoDelayCommand);
          const tcpNoDelayValue = tcpNoDelayOutput.match(/TCP No Delay: (\d+)/)?.[1] || '';
          setSelectedValues(prev => ({
            ...prev,
            'tcp-no-delay': tcpNoDelayValue === '0' ? 'disabled' : tcpNoDelayValue === '1' ? 'enabled' : 'default'
          }));

          // TCP Delayed ACK Ticksの値を取得
          const tcpDelAckTicksCommand = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting TCP Delayed ACK Ticks..."; try { $value = (Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces" -Name TcpDelAckTicks).TcpDelAckTicks; Write-Host "TCP Delayed ACK Ticks: $value" } catch { Write-Host "Error getting TCP Delayed ACK Ticks: $_" }; Write-Host "TCP Delayed ACK Ticks retrieval completed."\'';
          const tcpDelAckTicksOutput = await window.electron.ipcRenderer.invoke('run-powershell-command', tcpDelAckTicksCommand);
          const tcpDelAckTicksValue = tcpDelAckTicksOutput.match(/TCP Delayed ACK Ticks: (\d+)/)?.[1] || '';
          setSelectedValues(prev => ({
            ...prev,
            'tcp-del-ack-ticks': tcpDelAckTicksValue === '0' ? 'disabled' : 'default'
          }));

          // Initial Retransmission Timerの値を取得
          const initialRtoLine = lines.find((line: string) => line.includes('InitialRto'));
          if (initialRtoLine) {
            const currentValue = initialRtoLine.split(':')[1].trim();
            setCustomValues(prev => ({
              ...prev,
              'tcp-initial-retransmission-timer': currentValue
            }));
          }

          // NonSackRTTresiliencyの値を取得
          const nonsackLine = lines.find((line: string) => line.toLowerCase().includes('nonsackrttresiliency'));
          if (nonsackLine) {
            const currentValue = nonsackLine.split(':')[1].trim().toLowerCase();
            setSelectedValues(prev => ({
              ...prev,
              'tcp-nonsackrttresiliency': currentValue
            }));
          }

          // レジストリキーの取得
          const ttlCommand = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting TTL..."; try { $ttl = (Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" -Name DefaultTTL).DefaultTTL; Write-Host "TTL: $ttl" } catch { Write-Host "Error getting TTL: $_" }; Write-Host "TTL retrieval completed."\'';
          const ttlOutput = await window.electron.ipcRenderer.invoke('run-powershell-command', ttlCommand);
          const ttlValue = ttlOutput.match(/TTL: (\d+)/)?.[1] || '';

          // NonBestEffortLimitの値を取得
          const nonBestEffortLimitCommand = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting NonBestEffortLimit..."; try { $value = (Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Psched" -Name NonBestEffortLimit).NonBestEffortLimit; Write-Host "NonBestEffortLimit: $value" } catch { Write-Host "Error getting NonBestEffortLimit: $_" }; Write-Host "NonBestEffortLimit retrieval completed."\'';
          const nonBestEffortLimitOutput = await window.electron.ipcRenderer.invoke('run-powershell-command', nonBestEffortLimitCommand);
          const nonBestEffortLimitValue = nonBestEffortLimitOutput.match(/NonBestEffortLimit: (\d+)/)?.[1] || '';

          const timeWaitDelayCommand = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting TimeWaitDelay..."; try { $delay = (Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" -Name TcpTimedWaitDelay).TcpTimedWaitDelay; Write-Host "TimeWaitDelay: $delay" } catch { Write-Host "Error getting TimeWaitDelay: $_" }; Write-Host "TimeWaitDelay retrieval completed."\'';
          const timeWaitDelayOutput = await window.electron.ipcRenderer.invoke('run-powershell-command', timeWaitDelayCommand);
          const timeWaitDelayValue = timeWaitDelayOutput.match(/TimeWaitDelay: (\d+)/)?.[1] || '';

          const irpStackSizeCommand = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting IRPStackSize..."; try { $size = (Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\services\\LanmanServer\\Parameters" -Name IRPStackSize).IRPStackSize; Write-Host "IRPStackSize: $size" } catch { Write-Host "Error getting IRPStackSize: $_" }; Write-Host "IRPStackSize retrieval completed."\'';
          const irpStackSizeOutput = await window.electron.ipcRenderer.invoke('run-powershell-command', irpStackSizeCommand);
          const irpStackSizeValue = irpStackSizeOutput.match(/IRPStackSize: (\d+)/)?.[1] || '';

          // ポート番号数の取得
          const maxUserPortCommand = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting MaxUserPort..."; try { $port = (Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" -Name MaxUserPort).MaxUserPort; Write-Host "MaxUserPort: $port" } catch { Write-Host "Error getting MaxUserPort: $_" }; Write-Host "MaxUserPort retrieval completed."\'';
          const maxUserPortOutput = await window.electron.ipcRenderer.invoke('run-powershell-command', maxUserPortCommand);
          const maxUserPortValue = maxUserPortOutput.match(/MaxUserPort: (\d+)/)?.[1] || '';

          // カスタム値の更新
          setCustomValues(prev => ({
            ...prev,
            'ip-ttl': ttlValue,
            'tcp-timed-wait-delay': timeWaitDelayValue,
            'irp-stack-size': irpStackSizeValue,
            'tcp-max-user-port': maxUserPortValue,
            'non-best-effort-limit': nonBestEffortLimitValue
          }));

          setToast({
            type: 'success',
            message: 'TCP設定とレジストリ値を取得しました',
          });

          // Do not use NLAの値を取得
          const doNotUseNlaCommand = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting Do not use NLA setting..."; try { $value = (Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\QoS" -Name "Do not use NLA" -ErrorAction SilentlyContinue)."Do not use NLA"; Write-Host "Do not use NLA: $value" } catch { Write-Host "Error getting Do not use NLA: $_" }; Write-Host "Do not use NLA retrieval completed."\'';
          const doNotUseNlaOutput = await window.electron.ipcRenderer.invoke('run-powershell-command', doNotUseNlaCommand);
          const doNotUseNlaValue = doNotUseNlaOutput.match(/Do not use NLA: (.+)/)?.[1] || '';

          setSelectedValues(prev => ({
            ...prev,
            'qos-do-not-use-nla': doNotUseNlaValue === '1' ? 'optimized' : 'default'
          }));
        } else {
          setToast({
            type: 'error',
            message: 'TCP設定の取得に失敗しました',
          });
        }
      } catch (error) {
        setToast({
          type: 'error',
          message: 'TCP設定の取得に失敗しました',
        });
      } finally {
        setIsLoadingTcpSettings(false);
      }
    };

    getTcpSettings();
  }, []);

  useEffect(() => {
    const getAdapterSettings = async () => {
      if (!selectedNetworkInterface) return;
      
      setIsLoadingAdapterSettings(true);
      try {
        console.log('Selected Interface:', selectedNetworkInterface);
        const command1 = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting Network Adapter Settings..."; try { Get-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}"; Write-Host "Network Adapter Settings retrieved successfully" } catch { Write-Host "Error getting Network Adapter Settings: $_" }; Write-Host "Network Adapter Settings retrieval completed."'`;
        const output1 = await window.electron.ipcRenderer.invoke('run-powershell-command', command1);
        
        if (output1) {
          const lines1 = output1.split('\n');
          
          // 省電力関連の設定を取得
          const powerSettings = {
            eee: '',
            advancedEee: '',
            greenEthernet: '',
            autoGigabitDisable: '',
            gigabitLite: '',
            powerSavingMode: ''
          };

          // ウェイクアップ関連の設定を取得
          const wakeupSettings = {
            wakeOnMagicPacket: '',
            wakeOnPatternMatch: '',
            wakeOnLanShutdown: '',
            wakeOnMagicPacketS4S5: ''
          };

          // ウェイク・オン・マジック・パケット
          const wakeOnMagicPacketLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === 'ウェイク・オン・マジック・パケット';
          });
          if (wakeOnMagicPacketLine) {
            const values = wakeOnMagicPacketLine.split(/\s{2,}/);
            wakeupSettings.wakeOnMagicPacket = values[2].trim();
          }

          // ウェイク・オン・パターン・マッチ
          const wakeOnPatternMatchLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === 'ウェイク・オン・パターン・マッチ';
          });
          if (wakeOnPatternMatchLine) {
            const values = wakeOnPatternMatchLine.split(/\s{2,}/);
            wakeupSettings.wakeOnPatternMatch = values[2].trim();
          }

          // LAN 上のウェークアップのシャットダウン
          const wakeOnLanShutdownLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === 'LAN 上のウェークアップのシャットダウン';
          });
          if (wakeOnLanShutdownLine) {
            const values = wakeOnLanShutdownLine.split(/\s{2,}/);
            wakeupSettings.wakeOnLanShutdown = values[2].trim();
          }

          // Wake on magic packet when system is in S4/S5
          const wakeOnMagicPacketS4S5Line = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            return line.includes('Wake on magic packet when s...');
          });
          if (wakeOnMagicPacketS4S5Line) {
            // 設定名の後の最初の値を取得
            const match = wakeOnMagicPacketS4S5Line.match(/Wake on magic packet when s\.\.\.\s+(\S+)/);
            if (match) {
              wakeupSettings.wakeOnMagicPacketS4S5 = match[1].trim();
            }
          }

          setWakeupSettings(wakeupSettings);

          // 省電力型イーサネット(EEE)
          const eeeLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === '省電力型イーサネット(EEE)';
          });
          if (eeeLine) {
            const values = eeeLine.split(/\s{2,}/);
            powerSettings.eee = values[2].trim();
          }

          // Advanced EEE
          const advancedEeeLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === 'Advanced EEE';
          });
          if (advancedEeeLine) {
            const values = advancedEeeLine.split(/\s{2,}/);
            powerSettings.advancedEee = values[2].trim();
          }

          // グリーンイーサネット
          const greenEthernetLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === 'グリーンイーサネット';
          });
          if (greenEthernetLine) {
            const values = greenEthernetLine.split(/\s{2,}/);
            powerSettings.greenEthernet = values[2].trim();
          }

          // 自動無効ギガビット
          const autoGigabitDisableLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === '自動無効ギガビット';
          });
          if (autoGigabitDisableLine) {
            const values = autoGigabitDisableLine.split(/\s{2,}/);
            powerSettings.autoGigabitDisable = values[2].trim();
          }

          // Gigabit Lite
          const gigabitLiteLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === 'Gigabit Lite';
          });
          if (gigabitLiteLine) {
            const values = gigabitLiteLine.split(/\s{2,}/);
            powerSettings.gigabitLite = values[2].trim();
          }

          // Power Saving Mode
          const powerSavingModeLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === 'Power Saving Mode';
          });
          if (powerSavingModeLine) {
            const values = powerSavingModeLine.split(/\s{2,}/);
            powerSettings.powerSavingMode = values[2].trim();
          }

          setPowerSavingSettings(powerSettings);

          // TCP Checksum Offload (IPv4)
          const tcpChecksumLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === 'TCP チェックサムオフロード (IPv4)';
          });

          if (tcpChecksumLine) {
            const values = tcpChecksumLine.split(/\s{2,}/);
            const tcpChecksumValue = values[2].trim();
            setTcpChecksumOffload(tcpChecksumValue);
          }

          // TCP Checksum Offload (IPv6)
          const tcpChecksumIPv6Line = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === 'TCP チェックサムオフロード (IPv6)';
          });

          if (tcpChecksumIPv6Line) {
            const values = tcpChecksumIPv6Line.split(/\s{2,}/);
            const tcpChecksumIPv6Value = values[2].trim();
            setTcpChecksumOffloadIPv6(tcpChecksumIPv6Value);
          }

          // UDP Checksum Offload (IPv4)
          const udpChecksumIPv4Line = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === 'UDP チェックサムオフロード (IPv4)';
          });

          if (udpChecksumIPv4Line) {
            const values = udpChecksumIPv4Line.split(/\s{2,}/);
            const udpChecksumIPv4Value = values[2].trim();
            setUdpChecksumOffloadIPv4(udpChecksumIPv4Value);
          }

          // UDP Checksum Offload (IPv6)
          const udpChecksumIPv6Line = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === 'UDP チェックサムオフロード (IPv6)';
          });

          if (udpChecksumIPv6Line) {
            const values = udpChecksumIPv6Line.split(/\s{2,}/);
            const udpChecksumIPv6Value = values[2].trim();
            setUdpChecksumOffloadIPv6(udpChecksumIPv6Value);
          }

          // IPv4 Checksum Offload
          const ipv4ChecksumLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === 'IPv4 チェックサムオフロード';
          });

          if (ipv4ChecksumLine) {
            const values = ipv4ChecksumLine.split(/\s{2,}/);
            const ipv4ChecksumValue = values[2].trim();
            setIpv4ChecksumOffload(ipv4ChecksumValue);
          }

          // 一括送信オフロード v2 (IPv4)
          const largeSendOffloadV2IPv4Line = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === '一括送信オフロード v2 (IPv4)';
          });

          if (largeSendOffloadV2IPv4Line) {
            const values = largeSendOffloadV2IPv4Line.split(/\s{2,}/);
            const largeSendOffloadV2IPv4Value = values[2].trim();
            setLargeSendOffloadV2IPv4(largeSendOffloadV2IPv4Value);
          }

          // 一括送信オフロード v2 (IPv6)
          const largeSendOffloadV2IPv6Line = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === '一括送信オフロード v2 (IPv6)';
          });

          if (largeSendOffloadV2IPv6Line) {
            const values = largeSendOffloadV2IPv6Line.split(/\s{2,}/);
            const largeSendOffloadV2IPv6Value = values[2].trim();
            setLargeSendOffloadV2IPv6(largeSendOffloadV2IPv6Value);
          }

          // ARP オフロード
          const arpOffloadLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === 'ARP オフロード';
          });

          if (arpOffloadLine) {
            const values = arpOffloadLine.split(/\s{2,}/);
            const arpOffloadValue = values[2].trim();
            setArpOffload(arpOffloadValue);
          }

          // NS オフロード
          const nsOffloadLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === 'NS オフロード';
          });

          if (nsOffloadLine) {
            const values = nsOffloadLine.split(/\s{2,}/);
            const nsOffloadValue = values[2].trim();
            setNsOffload(nsOffloadValue);
          }

          // 受信側スケーリング
          const receiveSideScalingLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === '受信側スケーリング';
          });

          if (receiveSideScalingLine) {
            const values = receiveSideScalingLine.split(/\s{2,}/);
            const receiveSideScalingValue = values[2].trim();
            setReceiveSideScaling(receiveSideScalingValue);
          }

          // フローコントロール
          const flowControlLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === 'フローコントロール';
          });

          if (flowControlLine) {
            const values = flowControlLine.split(/\s{2,}/);
            const flowControlValue = values[2].trim();
            setFlowControl(flowControlValue);
          }

          // 割込みモデレーション
          const interruptModerationLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === '割込みモデレーション';
          });

          if (interruptModerationLine) {
            const values = interruptModerationLine.split(/\s{2,}/);
            const interruptModerationValue = values[2].trim();
            setInterruptModeration(interruptModerationValue);
          }

          const command2 = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting MTU Settings..."; try { netsh interface ipv4 show subinterfaces; Write-Host "MTU Settings retrieved successfully" } catch { Write-Host "Error getting MTU Settings: $_" }; Write-Host "MTU Settings retrieval completed."\'';
          const output2 = await window.electron.ipcRenderer.invoke('run-powershell-command', command2);

        if (output2) {
          // すべてのインターフェースのMTU値を取得
          const lines2 = output2.split('\n');
          const interfaces: { name: string; mtu: string; traffic: number }[] = [];
          
          // ヘッダー行をスキップして各行を処理
          lines2.slice(2).forEach((line: string) => {
            const values = line.split(/\s+/).filter(Boolean);
            // 有効なインターフェース行のみを処理（MTUが数値で、インターフェース名が存在する場合）
            if (values.length >= 5 && !isNaN(Number(values[0])) && values[4]) {
              const mtu = values[0];
              const bytesIn = parseInt(values[2], 10);
              const bytesOut = parseInt(values[3], 10);
              // インターフェース名は4番目の列以降のすべての文字列を結合
              const name = line.substring(line.indexOf(values[4])).trim();
              if (!name.includes('---') && (bytesIn > 0 || bytesOut > 0)) {
                interfaces.push({ name, mtu, traffic: bytesIn + bytesOut });
              }
            }
          });

          // トラフィック量で降順にソート
          interfaces.sort((a, b) => b.traffic - a.traffic);
          
          // トラフィック情報を削除して保存
            const sortedInterfaces = interfaces.map(({ name }) => name);
            setMtuInterfaces(sortedInterfaces);
          
          // 最初のインターフェースを選択（最もトラフィックの多いもの）
          if (sortedInterfaces.length > 0) {
              setSelectedInterface(sortedInterfaces[0]);
            setCustomValues(prev => ({
              ...prev,
                'tcp-wifi-mtu': interfaces[0].mtu
            }));
          }
        }

          setToast({
            type: 'success',
            message: 'ネットワークアダプター設定を取得しました',
          });

          // RSSキューの最大数
          const maxRssQueuesLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === 'RSSキューの最大数';
          });

          if (maxRssQueuesLine) {
            const values = maxRssQueuesLine.split(/\s{2,}/);
            const maxRssQueuesValue = values[2].trim();
            setMaxRssQueues(maxRssQueuesValue);
          }

          // 優先度およびVLAN
          const priorityVlanLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === '優先度およびVLAN';
          });

          if (priorityVlanLine) {
            const values = priorityVlanLine.split(/\s{2,}/);
            const priorityVlanValue = values[2].trim();
            setPriorityVlan(priorityVlanValue);
          }

          // WOLとシャットダウンリンク速度
          const wolShutdownLinkSpeedLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === 'WOL とシャットダウンリンク速度';
          });

          if (wolShutdownLinkSpeedLine) {
            const values = wolShutdownLinkSpeedLine.split(/\s{2,}/);
            const wolShutdownLinkSpeedValue = values[2].trim();
            setWolShutdownLinkSpeed(wolShutdownLinkSpeedValue);
          }

          // 速度とデュプレックス
          const speedDuplexLine = lines1.find((line: string) => {
            if (line.includes('----')) return false;
            const values = line.split(/\s{2,}/);
            return values.length >= 2 && values[1].trim() === '速度とデュプレックス';
          });

          if (speedDuplexLine) {
            const values = speedDuplexLine.split(/\s{2,}/);
            const speedDuplexValue = values[2].trim();
            setSpeedDuplex(speedDuplexValue);
          }
        }

        // ... existing code ...
      } catch (error) {
        setToast({
          type: 'error',
          message: 'ネットワークアダプター設定の取得に失敗しました',
        });
      } finally {
        setIsLoadingAdapterSettings(false);
      }
    };

    getAdapterSettings();
  }, [selectedNetworkInterface]); // selectedNetworkInterfaceが変更されたときに実行

  useEffect(() => {
    if (rscSettingsRef.current) return;
    rscSettingsRef.current = true;

    const getRscSettings = async () => {
      setIsLoadingRscSettings(true);
      try {
        const command = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting RSC Settings..."; try { Get-NetAdapterRsc; Write-Host "RSC Settings retrieved successfully" } catch { Write-Host "Error getting RSC Settings: $_" }; Write-Host "RSC Settings retrieval completed."\'';
        const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
        
        if (output) {
          // アクティブなネットワークアダプターのRSC状態を解析
          const lines = output.split('\n');
          // ヘッダー行をスキップして最初のアクティブなアダプターを探す
          const activeAdapterLine = lines.find((line: string) => {
            const values = line.split(/\s+/).filter(Boolean);
            // Stateの値（3番目と4番目）がTrueの行を探す
            return values.length >= 4 && values[2] === 'True' && values[3] === 'True';
          });

          if (activeAdapterLine) {
            const values = activeAdapterLine.split(/\s+/).filter(Boolean);
            const ipv4State = values[2] === 'True';
            const ipv6State = values[3] === 'True';
            
            // IPv4とIPv6の状態に基づいてRSCの設定を決定
            const rscState = ipv4State || ipv6State ? 'enabled' : 'disabled';
            setSelectedValues(prev => ({
              ...prev,
              'tcp-receive-side-coalescing': rscState
            }));
          }

          setToast({
            type: 'success',
            message: 'RSC設定を取得しました',
          });
        } else {
          setToast({
            type: 'error',
            message: 'RSC設定の取得に失敗しました',
          });
        }
      } catch (error) {
        setToast({
          type: 'error',
          message: 'RSC設定の取得に失敗しました',
        });
      } finally {
        setIsLoadingRscSettings(false);
      }
    };

    getRscSettings();
  }, []);

  // MTUインターフェースの取得処理
  useEffect(() => {
    const fetchMtuInterfaces = async () => {
      try {
        const command = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting MTU Settings..."; try { netsh interface ipv4 show subinterfaces; Write-Host "MTU Settings retrieved successfully" } catch { Write-Host "Error getting MTU Settings: $_" }; Write-Host "MTU Settings retrieval completed."\'';
        const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
        
        if (output) {
          const lines = output.split('\n');
          const interfaces: { name: string; mtu: string; traffic: number }[] = [];
          
          // ヘッダー行をスキップして各行を処理
          lines.slice(2).forEach((line: string) => {
            const values = line.split(/\s+/).filter(Boolean);
            // 有効なインターフェース行のみを処理（MTUが数値で、インターフェース名が存在する場合）
            if (values.length >= 5 && !isNaN(Number(values[0])) && values[4]) {
              const mtu = values[0];
              const bytesIn = parseInt(values[2], 10);
              const bytesOut = parseInt(values[3], 10);
              // インターフェース名は4番目の列以降のすべての文字列を結合
              const name = line.substring(line.indexOf(values[4])).trim();
              if (!name.includes('---') && (bytesIn > 0 || bytesOut > 0)) {
                interfaces.push({ name, mtu, traffic: bytesIn + bytesOut });
              }
            }
          });

          // トラフィック量で降順にソート
          interfaces.sort((a, b) => b.traffic - a.traffic);
          
          // トラフィック情報を削除して保存
          const sortedInterfaces = interfaces.map(({ name }) => name);
          setMtuInterfaces(sortedInterfaces);
          
          // 最初のインターフェースを選択（最もトラフィックの多いもの）
          if (sortedInterfaces.length > 0) {
            setSelectedInterface(sortedInterfaces[0]);
          }
        }
      } catch (error) {
        console.error('MTUインターフェースの取得に失敗しました:', error);
      }
    };

    fetchMtuInterfaces();
  }, []);

  // レジストリ値を取得する関数
  const getRegistryValues = async (path: string) => {
    if (!path) {
      setToast({
        type: 'error',
        message: 'レジストリパスを入力してください',
      });
      return;
    }

    setIsLoadingRegistry(true);
    try {
      // パスを正しい形式に変換
      const formattedPath = path.replace(/\\/g, '\\\\');
      
      // パスが有効な場合、ローカルストレージに保存
      localStorage.setItem('networkRegistryPath', path);
      
      // *TransmitBuffersの値を取得
      const transmitCommand = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting *TransmitBuffers..."; try { $value = (Get-ItemProperty -Path "HKLM:${formattedPath}" -Name "*TransmitBuffers" -ErrorAction Stop)."*TransmitBuffers"; Write-Host "*TransmitBuffers: $value" } catch { Write-Host "Error getting *TransmitBuffers: $_" }; Write-Host "*TransmitBuffers retrieval completed."'`;
      const transmitOutput = await window.electron.ipcRenderer.invoke('run-powershell-command', transmitCommand);
      const transmitValue = transmitOutput.match(/\*TransmitBuffers: (.+)/)?.[1] || '';
      setTransmitBuffers(transmitValue);

      // *ReceiveBuffersの値を取得
      const receiveCommand = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting *ReceiveBuffers..."; try { $value = (Get-ItemProperty -Path "HKLM:${formattedPath}" -Name "*ReceiveBuffers" -ErrorAction Stop)."*ReceiveBuffers"; Write-Host "*ReceiveBuffers: $value" } catch { Write-Host "Error getting *ReceiveBuffers: $_" }; Write-Host "*ReceiveBuffers retrieval completed."'`;
      const receiveOutput = await window.electron.ipcRenderer.invoke('run-powershell-command', receiveCommand);
      const receiveValue = receiveOutput.match(/\*ReceiveBuffers: (.+)/)?.[1] || '';
      setReceiveBuffers(receiveValue);

      // MaxRssProcessorsの値を取得
      const maxRssProcessorsCommand = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting MaxRssProcessors..."; try { $value = (Get-ItemProperty -Path "HKLM:${formattedPath}" -Name "*MaxRssProcessors" -ErrorAction Stop)."*MaxRssProcessors"; Write-Host "MaxRssProcessors: $value" } catch { Write-Host "Error getting MaxRssProcessors: $_" }; Write-Host "MaxRssProcessors retrieval completed."'`;
      const maxRssProcessorsOutput = await window.electron.ipcRenderer.invoke('run-powershell-command', maxRssProcessorsCommand);
      const maxRssProcessorsValue = maxRssProcessorsOutput.match(/MaxRssProcessors: (.+)/)?.[1] || '';
      setMaxRssProcessors(maxRssProcessorsValue);

      // RssMaxProcNumberの値を取得
      const rssMaxProcNumberCommand = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting RssMaxProcNumber..."; try { $value = (Get-ItemProperty -Path "HKLM:${formattedPath}" -Name "*RssMaxProcNumber" -ErrorAction Stop)."*RssMaxProcNumber"; Write-Host "RssMaxProcNumber: $value" } catch { Write-Host "Error getting RssMaxProcNumber: $_" }; Write-Host "RssMaxProcNumber retrieval completed."'`;
      const rssMaxProcNumberOutput = await window.electron.ipcRenderer.invoke('run-powershell-command', rssMaxProcNumberCommand);
      const rssMaxProcNumberValue = rssMaxProcNumberOutput.match(/RssMaxProcNumber: (.+)/)?.[1] || '';
      setRssMaxProcNumber(rssMaxProcNumberValue);

      // IntDelay系の値を取得
      const intDelayNames = ['TxAbsIntDelay', 'TxIntDelay', 'RxAbsIntDelay', 'RxIntDelay'];
      const intDelayResults: any = {};
      for (const name of intDelayNames) {
        const cmd = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting ${name}..."; try { $value = (Get-ItemProperty -Path "HKLM:${formattedPath}" -Name "${name}" -ErrorAction Stop).${name}; Write-Host "${name}: $value" } catch { Write-Host "Error getting ${name}: $_" }; Write-Host "${name} retrieval completed."'`;
        const output = await window.electron.ipcRenderer.invoke('run-powershell-command', cmd);
        intDelayResults[name] = output.match(new RegExp(`${name}: (.+)`))?.[1] || '';
      }
      setIntDelayValues(intDelayResults);

      // ThreadedDpc系の値を取得
      const threadedDpcNames = ['ThreadedDpcEnable', 'TxThreadedDpcEnable'];
      const threadedDpcResults: any = {};
      for (const name of threadedDpcNames) {
        const cmd = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting ${name}..."; try { $value = (Get-ItemProperty -Path "HKLM:${formattedPath}" -Name "${name}" -ErrorAction Stop).${name}; Write-Host "${name}: $value" } catch { Write-Host "Error getting ${name}: $_" }; Write-Host "${name} retrieval completed."'`;
        const output = await window.electron.ipcRenderer.invoke('run-powershell-command', cmd);
        threadedDpcResults[name] = output.match(new RegExp(`${name}: (.+)`))?.[1] || '';
      }
      setThreadedDpcValues(threadedDpcResults);
      setThreadedDpcEnabled(threadedDpcResults['ThreadedDpcEnable'] === '1');

      setToast({
        type: 'success',
        message: 'レジストリ値を取得しました',
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'レジストリ値の取得に失敗しました',
      });
    } finally {
      setIsLoadingRegistry(false);
    }
  };

  // レジストリ値を設定する関数
  const handleBufferChange = async (type: 'transmit' | 'receive', value: string) => {
    if (!networkRegistryPath) {
      setToast({
        type: 'error',
        message: 'レジストリパスを入力してください',
      });
      return;
    }

    try {
      const propertyName = type === 'transmit' ? '*TransmitBuffers' : '*ReceiveBuffers';
      const formattedPath = networkRegistryPath.replace(/\\/g, '\\\\');
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting ${propertyName}..."; try { Set-ItemProperty -Path "HKLM:${formattedPath}" -Name "${propertyName}" -Value "${value}" -Type String; Write-Host "${propertyName} set successfully" } catch { Write-Host "Error setting ${propertyName}: $_" }; Write-Host "${propertyName} setting completed."'`;
      
      await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (type === 'transmit') {
        setTransmitBuffers(value);
      } else {
        setReceiveBuffers(value);
      }

      setToast({
        type: 'success',
        message: `${propertyName}の値を更新しました`,
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: `${type === 'transmit' ? '*TransmitBuffers' : '*ReceiveBuffers'}の設定に失敗しました`,
      });
    }
  };

  const handleToggle = async (settingId: string, settingName: string, enabled: boolean) => {
    const success = await toggleSetting(settingId);
    
    if (success) {
      setToast({
        type: 'success',
        message: `「${settingName}」を${enabled ? 'オフ' : 'オン'}にしました`,
      });
    } else {
      setToast({
        type: 'error',
        message: `設定の変更に失敗しました: ${settingName}`,
      });
    }
  };

  const handleValueChange = async (settingId: string, value: string) => {
    setSelectedValues(prev => ({
      ...prev,
      [settingId]: value
    }));

    const setting = settings.find(s => s.id === settingId);
    if (!setting || !setting.command.options) return;

    let command = setting.command.options[value];
    if (!command) return;

    try {
      const success = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (success) {
        setToast({
          type: 'success',
          message: `「${setting.name}」の値を設定しました`,
        });
      } else {
        setToast({
          type: 'error',
          message: `設定の変更に失敗しました: ${setting.name}`,
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: `設定の変更に失敗しました: ${setting.name}`,
      });
    }
  };

  const handleCustomValueChange = (settingId: string, value: string) => {
    // ポート番号の場合、5桁までに制限
    if (settingId === 'tcp-max-user-port' && value.length > 5) {
      return;
    }
    // TimeWaitDelayの場合、4桁までに制限
    if (settingId === 'tcp-timed-wait-delay' && value.length > 4) {
      return;
    }
    // Initial RTOの場合、4桁までに制限
    if (settingId === 'tcp-initial-retransmission-timer' && value.length > 4) {
      return;
    }
    // MTUサイズの場合、4桁までに制限
    if (settingId === 'tcp-wifi-mtu' && value.length > 4) {
      return;
    }
    // TTLの場合、3桁までに制限
    if (settingId === 'ip-ttl' && value.length > 3) {
      return;
    }
    // IRP Stack Sizeの場合、2桁までに制限
    if (settingId === 'irp-stack-size' && value.length > 2) {
      return;
    }
    // NonBestEffortLimitの場合、3桁までに制限
    if (settingId === 'non-best-effort-limit' && value.length > 3) {
      return;
    }
    setCustomValues(prev => ({
      ...prev,
      [settingId]: value
    }));
  };

  const handleValueApply = async (settingId: string, settingName: string) => {
    const setting = settings.find(s => s.id === settingId);
    if (!setting || !setting.command.options) return;

    // MTUサイズの制限チェック
    if (settingId === 'tcp-wifi-mtu') {
      const mtuValue = parseInt(customValues[settingId], 10);
      if (isNaN(mtuValue) || mtuValue < 40 || mtuValue > 9000) {
        setToast({
          type: 'error',
          message: 'MTUサイズは40から9000の間で指定してください',
        });
        return;
      }
    }

    // 各設定の値チェック
    if (settingId === 'tcp-max-user-port') {
      const portValue = parseInt(customValues[settingId], 10);
      if (isNaN(portValue) || portValue < 16384 || portValue > 65535) {
        setToast({
          type: 'error',
          message: 'ポート番号は16384から65535の間で指定してください',
        });
        return;
      }
    } else if (settingId === 'ip-ttl') {
      const ttlValue = parseInt(customValues[settingId], 10);
      if (isNaN(ttlValue) || ttlValue < 1 || ttlValue > 128) {
        setToast({
          type: 'error',
          message: 'TTLは1から128の間で指定してください',
        });
        return;
      }
    } else if (settingId === 'tcp-timed-wait-delay') {
      const delayValue = parseInt(customValues[settingId], 10);
      if (isNaN(delayValue) || delayValue < 1 || delayValue > 3600) {
        setToast({
          type: 'error',
          message: 'TimeWaitDelayは1から3600の間で指定してください',
        });
        return;
      }
    } else if (settingId === 'tcp-initial-retransmission-timer') {
      const rtoValue = parseInt(customValues[settingId], 10);
      if (isNaN(rtoValue) || rtoValue < 300 || rtoValue > 3000) {
        setToast({
          type: 'error',
          message: 'Initial RTOは300から3000の間で指定してください',
        });
        return;
      }
    } else if (settingId === 'irp-stack-size') {
      const stackValue = parseInt(customValues[settingId], 10);
      if (isNaN(stackValue) || stackValue < 1 || stackValue > 50) {
        setToast({
          type: 'error',
          message: 'IRP Stack Sizeは1から50の間で指定してください',
        });
        return;
      }
    } else if (settingId === 'non-best-effort-limit') {
      const limitValue = parseInt(customValues[settingId], 10);
      if (isNaN(limitValue) || limitValue < 0 || limitValue > 100) {
        setToast({
          type: 'error',
          message: 'NonBestEffortLimitは0から100の間で指定してください',
        });
        return;
      }
    }

    const selectedValue = selectedValues[settingId] || Object.keys(setting.command.options)[0];
    let command = setting.command.options[selectedValue];
    if (!command) return;

    // カスタム値で %value% を置き換え
    if (selectedValue === 'custom' && customValues[settingId]) {
      command = command.replace(/%value%/g, customValues[settingId]);
    }

    try {
      // 選択されたインターフェースのMTUを変更
      if (settingId === 'tcp-wifi-mtu' && selectedInterface) {
        const mtuCommand = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting MTU for ${selectedInterface}..."; try { netsh interface ipv4 set subinterface "${selectedInterface}" mtu=${customValues[settingId]}; Write-Host "MTU set successfully" } catch { Write-Host "Error setting MTU: $_" }; Write-Host "MTU setting completed."'`;
        const success = await window.electron.ipcRenderer.invoke('run-powershell-command', mtuCommand);
        
        if (success) {
          // MTU変更後に現在の値を再取得
          const getMtuCommand = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting MTU Settings..."; try { netsh interface ipv4 show subinterfaces; Write-Host "MTU Settings retrieved successfully" } catch { Write-Host "Error getting MTU Settings: $_" }; Write-Host "MTU Settings retrieval completed."\'';
          const output = await window.electron.ipcRenderer.invoke('run-powershell-command', getMtuCommand);
          
          if (output) {
            const lines = output.split('\n');
            const interfaces: { name: string; mtu: string; traffic: number }[] = [];
            
            lines.slice(2).forEach((line: string) => {
              const values = line.split(/\s+/).filter(Boolean);
              if (values.length >= 5 && !isNaN(Number(values[0])) && values[4]) {
                const mtu = values[0];
                const bytesIn = parseInt(values[2], 10);
                const bytesOut = parseInt(values[3], 10);
                // インターフェース名は4番目の列以降のすべての文字列を結合
                const name = line.substring(line.indexOf(values[4])).trim();
                if (!name.includes('---') && (bytesIn > 0 || bytesOut > 0)) {
                  interfaces.push({ name, mtu, traffic: bytesIn + bytesOut });
                }
              }
            });

            // トラフィック量で降順にソート
            interfaces.sort((a, b) => b.traffic - a.traffic);
            
            // トラフィック情報を削除して保存
            const sortedInterfaces = interfaces.map(({ name }) => name);
            setMtuInterfaces(sortedInterfaces);
            
            // 選択中のインターフェースのMTU値を更新
            const updatedInterface = sortedInterfaces.find(intf => intf === selectedInterface);
            if (updatedInterface) {
              setCustomValues(prev => ({
                ...prev,
                'tcp-wifi-mtu': interfaces.find(i => i.name === updatedInterface)?.mtu || ''
              }));
            }
          }

          setToast({
            type: 'success',
            message: `「${selectedInterface}」のMTU値を${customValues[settingId]}に設定しました`,
          });
        } else {
          setToast({
            type: 'error',
            message: `MTU値の設定に失敗しました: ${selectedInterface}`,
          });
        }
      } else {
        // その他の設定の処理
      const success = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (success) {
        setToast({
          type: 'success',
            message: `「${settingName}」の値を設定しました`,
        });
      } else {
        setToast({
          type: 'error',
          message: `設定の変更に失敗しました: ${settingName}`,
        });
        }
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: `設定の変更に失敗しました: ${settingName}`,
      });
    }
  };

  const handleInterfaceChange = (interfaceName: string) => {
    setSelectedInterface(interfaceName);
    // MTU値を取得するコマンドを実行
    const getMtuCommand = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting MTU Settings..."; try { netsh interface ipv4 show subinterfaces; Write-Host "MTU Settings retrieved successfully" } catch { Write-Host "Error getting MTU Settings: $_" }; Write-Host "MTU Settings retrieval completed."\'';
    
    window.electron.ipcRenderer.invoke('run-powershell-command', getMtuCommand)
      .then(output => {
        if (output) {
          const lines = output.split('\n');
          const interfaces: { name: string; mtu: string; traffic: number }[] = [];
          
          lines.slice(2).forEach((line: string) => {
            const values = line.split(/\s+/).filter(Boolean);
            if (values.length >= 5 && !isNaN(Number(values[0])) && values[4]) {
              const mtu = values[0];
              const bytesIn = parseInt(values[2], 10);
              const bytesOut = parseInt(values[3], 10);
              const name = line.substring(line.indexOf(values[4])).trim();
              if (!name.includes('---') && (bytesIn > 0 || bytesOut > 0)) {
                interfaces.push({ name, mtu, traffic: bytesIn + bytesOut });
              }
            }
          });

          // 選択されたインターフェースのMTU値を探す
          const selectedInterfaceInfo = interfaces.find(i => i.name === interfaceName);
          if (selectedInterfaceInfo) {
      setCustomValues(prev => ({
        ...prev,
              'tcp-wifi-mtu': selectedInterfaceInfo.mtu
      }));
    }
        }
      })
      .catch(error => {
        console.error('MTU値の取得に失敗しました:', error);
      });
  };

  const getCurrentValues = async () => {
    try {
      const output = await window.electron.ipcRenderer.invoke('execute-command', {
        command: 'netsh int tcp show global'
      });

      const lines = output.split('\n');
      const autoTuningLine = lines.find((line: string) => line.includes('AutoTuningLevelLocal'));
      const ecnCapabilityLine = lines.find((line: string) => line.includes('ECN Capability'));
      const dcaLine = lines.find((line: string) => line.includes('Direct Cache Access'));
      const netdmaLine = lines.find((line: string) => line.includes('NetDMA'));
      const rscLine = lines.find((line: string) => line.includes('Receive Segment Coalescing'));
      const rssLine = lines.find((line: string) => line.includes('Receive Side Scaling'));
      const initialRtoLine = lines.find((line: string) => line.includes('Initial RTO'));
      const nonsackRttResiliencyLine = lines.find((line: string) => line.includes('NonSackRttResiliency'));
      const congestionProviderLine = lines.find((line: string) => line.includes('Congestion Provider'));
      const memoryPressureProtectionLine = lines.find((line: string) => line.includes('Memory Pressure Protection'));
      const scalingHeuristicsLine = lines.find((line: string) => line.includes('Scaling Heuristics'));
      const maxSynRetransmissionsLine = lines.find((line: string) => line.includes('Max SYN Retransmissions'));

      // TTLの値を取得
      const ttlCommand = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting TTL..."; try { $ttl = (Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" -Name DefaultTTL).DefaultTTL; Write-Host "TTL: $ttl" } catch { Write-Host "Error getting TTL: $_" }; Write-Host "TTL retrieval completed."\'';
      const ttlOutput = await window.electron.ipcRenderer.invoke('run-powershell-command', ttlCommand);
      const ttlValue = ttlOutput.match(/TTL: (\d+)/)?.[1] || '';

      // NonBestEffortLimitの値を取得
      const nonBestEffortLimitCommand = 'Start-Process powershell.exe -Verb RunAs -ArgumentList \'$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Getting NonBestEffortLimit..."; try { $value = (Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Psched" -Name NonBestEffortLimit).NonBestEffortLimit; Write-Host "NonBestEffortLimit: $value" } catch { Write-Host "Error getting NonBestEffortLimit: $_" }; Write-Host "NonBestEffortLimit retrieval completed."\'';
      const nonBestEffortLimitOutput = await window.electron.ipcRenderer.invoke('run-powershell-command', nonBestEffortLimitCommand);
      const nonBestEffortLimitValue = nonBestEffortLimitOutput.match(/NonBestEffortLimit: (\d+)/)?.[1] || '';

      // TimeWaitDelayの値を取得
      const timeWaitDelayOutput = await window.electron.ipcRenderer.invoke('execute-command', {
        command: 'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v TcpTimedWaitDelay'
      });
      const timeWaitDelayMatch = timeWaitDelayOutput.match(/TcpTimedWaitDelay\s+REG_DWORD\s+0x([0-9a-fA-F]+)/);
      const timeWaitDelayValue = timeWaitDelayMatch ? parseInt(timeWaitDelayMatch[1], 16).toString() : '';

      // IRP Stack Sizeの値を取得
      const irpStackSizeOutput = await window.electron.ipcRenderer.invoke('execute-command', {
        command: 'reg query "HKLM\\SYSTEM\\CurrentControlSet\\services\\LanmanServer\\Parameters" /v IRPStackSize'
      });
      const irpStackSizeMatch = irpStackSizeOutput.match(/IRPStackSize\s+REG_DWORD\s+0x([0-9a-fA-F]+)/);
      const irpStackSizeValue = irpStackSizeMatch ? parseInt(irpStackSizeMatch[1], 16).toString() : '';

      setSelectedValues({
        'tcp-auto-tuning': autoTuningLine ? autoTuningLine.split(':')[1].trim().toLowerCase() : '',
        'tcp-ecn-capability': ecnCapabilityLine ? ecnCapabilityLine.split(':')[1].trim().toLowerCase() : '',
        'tcp-direct-cache-access': dcaLine ? dcaLine.split(':')[1].trim().toLowerCase() : '',
        'tcp-network-direct-memory-access': netdmaLine ? netdmaLine.split(':')[1].trim().toLowerCase() : '',
        'tcp-receive-side-coalescing': rscLine ? rscLine.split(':')[1].trim().toLowerCase() : '',
        'tcp-receive-side-scaling': rssLine ? rssLine.split(':')[1].trim().toLowerCase() : '',
        'tcp-initial-retransmission-timer': initialRtoLine ? initialRtoLine.split(':')[1].trim().toLowerCase() : '',
        'tcp-nonsackrttresiliency': nonsackRttResiliencyLine ? nonsackRttResiliencyLine.split(':')[1].trim().toLowerCase() : '',
        'tcp-congestion-provider': congestionProviderLine ? (congestionProviderLine.split(':')[1].trim().toLowerCase() === 'none' ? 'disabled' : congestionProviderLine.split(':')[1].trim().toLowerCase()) : '',
        'tcp-memory-pressure-protection': memoryPressureProtectionLine ? memoryPressureProtectionLine.split(':')[1].trim().toLowerCase() : '',
        'tcp-scaling-heuristics': scalingHeuristicsLine ? scalingHeuristicsLine.split(':')[1].trim().toLowerCase() : '',
        'tcp-max-syn-retransmissions': maxSynRetransmissionsLine ? maxSynRetransmissionsLine.split(':')[1].trim().toLowerCase() : '',
        'ip-ttl': ttlValue,
        'tcp-timed-wait-delay': timeWaitDelayValue,
        'irp-stack-size': irpStackSizeValue
      });
    } catch (error) {
      console.error('Error getting current values:', error);
    }
  };

  const handleTcpChecksumOffloadChange = async (value: string) => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting TCP Checksum Offload..."; try { Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "TCP チェックサムオフロード (IPv4)" -DisplayValue "${value}"; Write-Host "TCP Checksum Offload set successfully" } catch { Write-Host "Error setting TCP Checksum Offload: $_" }; Write-Host "TCP Checksum Offload setting completed."'`;
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setTcpChecksumOffload(value);
        setToast({
          type: 'success',
          message: 'TCP Checksum Offloadの設定を更新しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'TCP Checksum Offloadの設定に失敗しました',
      });
    }
  };

  const handleTcpChecksumOffloadIPv6Change = async (value: string) => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting TCP Checksum Offload IPv6..."; try { Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "TCP チェックサムオフロード (IPv6)" -DisplayValue "${value}"; Write-Host "TCP Checksum Offload IPv6 set successfully" } catch { Write-Host "Error setting TCP Checksum Offload IPv6: $_" }; Write-Host "TCP Checksum Offload IPv6 setting completed."'`;
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setTcpChecksumOffloadIPv6(value);
        setToast({
          type: 'success',
          message: 'TCP Checksum Offload IPv6の設定を更新しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'TCP Checksum Offload IPv6の設定に失敗しました',
      });
    }
  };

  const handleUdpChecksumOffloadIPv4Change = async (value: string) => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting UDP Checksum Offload IPv4..."; try { Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "UDP チェックサムオフロード (IPv4)" -DisplayValue "${value}"; Write-Host "UDP Checksum Offload IPv4 set successfully" } catch { Write-Host "Error setting UDP Checksum Offload IPv4: $_" }; Write-Host "UDP Checksum Offload IPv4 setting completed."'`;
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setUdpChecksumOffloadIPv4(value);
        setToast({
          type: 'success',
          message: 'UDP Checksum Offload IPv4の設定を更新しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'UDP Checksum Offload IPv4の設定に失敗しました',
      });
    }
  };

  const handleUdpChecksumOffloadIPv6Change = async (value: string) => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting UDP Checksum Offload IPv6..."; try { Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "UDP チェックサムオフロード (IPv6)" -DisplayValue "${value}"; Write-Host "UDP Checksum Offload IPv6 set successfully" } catch { Write-Host "Error setting UDP Checksum Offload IPv6: $_" }; Write-Host "UDP Checksum Offload IPv6 setting completed."'`;
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setUdpChecksumOffloadIPv6(value);
        setToast({
          type: 'success',
          message: 'UDP Checksum Offload IPv6の設定を更新しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'UDP Checksum Offload IPv6の設定に失敗しました',
      });
    }
  };

  const handleIpv4ChecksumOffloadChange = async (value: string) => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting IPv4 Checksum Offload..."; try { Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "IPv4 チェックサムオフロード" -DisplayValue "${value}"; Write-Host "IPv4 Checksum Offload set successfully" } catch { Write-Host "Error setting IPv4 Checksum Offload: $_" }; Write-Host "IPv4 Checksum Offload setting completed."'`;
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setIpv4ChecksumOffload(value);
        setToast({
          type: 'success',
          message: 'IPv4 Checksum Offloadの設定を更新しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'IPv4 Checksum Offloadの設定に失敗しました',
      });
    }
  };

  const handleLargeSendOffloadV2IPv4Change = async (value: string) => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting Large Send Offload v2 IPv4..."; try { Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "一括送信オフロード v2 (IPv4)" -DisplayValue "${value}"; Write-Host "Large Send Offload v2 IPv4 set successfully" } catch { Write-Host "Error setting Large Send Offload v2 IPv4: $_" }; Write-Host "Large Send Offload v2 IPv4 setting completed."'`;
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setLargeSendOffloadV2IPv4(value);
        setToast({
          type: 'success',
          message: '一括送信オフロード v2 (IPv4)の設定を更新しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: '一括送信オフロード v2 (IPv4)の設定に失敗しました',
      });
    }
  };

  const handleLargeSendOffloadV2IPv6Change = async (value: string) => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting Large Send Offload v2 IPv6..."; try { Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "一括送信オフロード v2 (IPv6)" -DisplayValue "${value}"; Write-Host "Large Send Offload v2 IPv6 set successfully" } catch { Write-Host "Error setting Large Send Offload v2 IPv6: $_" }; Write-Host "Large Send Offload v2 IPv6 setting completed."'`;
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setLargeSendOffloadV2IPv6(value);
        setToast({
          type: 'success',
          message: '一括送信オフロード v2 (IPv6)の設定を更新しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: '一括送信オフロード v2 (IPv6)の設定に失敗しました',
      });
    }
  };

  const handleArpOffloadChange = async (value: string) => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting ARP Offload..."; try { Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "ARP オフロード" -DisplayValue "${value}"; Write-Host "ARP Offload set successfully" } catch { Write-Host "Error setting ARP Offload: $_" }; Write-Host "ARP Offload setting completed."'`;
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setArpOffload(value);
        setToast({
          type: 'success',
          message: 'ARP オフロードの設定を更新しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'ARP オフロードの設定に失敗しました',
      });
    }
  };

  const handleNsOffloadChange = async (value: string) => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting NS Offload..."; try { Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "NS オフロード" -DisplayValue "${value}"; Write-Host "NS Offload set successfully" } catch { Write-Host "Error setting NS Offload: $_" }; Write-Host "NS Offload setting completed."'`;
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setNsOffload(value);
        setToast({
          type: 'success',
          message: 'NS オフロードの設定を更新しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'NS オフロードの設定に失敗しました',
      });
    }
  };

  const handleReceiveSideScalingChange = async (value: string) => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting Receive Side Scaling..."; try { Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "受信側スケーリング" -DisplayValue "${value}"; Write-Host "Receive Side Scaling set successfully" } catch { Write-Host "Error setting Receive Side Scaling: $_" }; Write-Host "Receive Side Scaling setting completed."'`;
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setReceiveSideScaling(value);
        setToast({
          type: 'success',
          message: '受信側スケーリングの設定を更新しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: '受信側スケーリングの設定に失敗しました',
      });
    }
  };

  const handleDisableAllPowerSaving = async () => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const commands = [
        `Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "省電力型イーサネット(EEE)" -DisplayValue "無効"`,
        `Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "Advanced EEE" -DisplayValue "無効"`,
        `Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "グリーンイーサネット" -DisplayValue "無効"`,
        `Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "自動無効ギガビット" -DisplayValue "無効"`,
        `Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "Gigabit Lite" -DisplayValue "無効"`,
        `Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "Power Saving Mode" -DisplayValue "無効"`
      ];

      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Disabling all power saving features..."; try { ${commands.join('; ')}; Write-Host "All power saving features disabled successfully" } catch { Write-Host "Error disabling power saving features: $_" }; Write-Host "Power saving features setting completed."'`;
      
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setPowerSavingSettings({
          eee: '無効',
          advancedEee: '無効',
          greenEthernet: '無効',
          autoGigabitDisable: '無効',
          gigabitLite: '無効',
          powerSavingMode: '無効'
        });
        setToast({
          type: 'success',
          message: 'すべての省電力機能を無効化しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: '省電力機能の無効化に失敗しました',
      });
    }
  };

  const handleDisableAllWakeup = async () => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const commands = [
        `Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "ウェイク・オン・マジック・パケット" -DisplayValue "無効"`,
        `Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "ウェイク・オン・パターン・マッチ" -DisplayValue "無効"`,
        `Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "LAN 上のウェークアップのシャットダウン" -DisplayValue "無効"`,
        `Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "Wake on magic packet when system is in the S0ix power state" -DisplayValue "無効"`
      ];

      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Disabling all wakeup features..."; try { ${commands.join('; ')}; Write-Host "All wakeup features disabled successfully" } catch { Write-Host "Error disabling wakeup features: $_" }; Write-Host "Wakeup features setting completed."'`;
      
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setWakeupSettings({
          wakeOnMagicPacket: '無効',
          wakeOnPatternMatch: '無効',
          wakeOnLanShutdown: '無効',
          wakeOnMagicPacketS4S5: '無効'
        });
        setToast({
          type: 'success',
          message: 'すべてのウェイクアップ機能を無効化しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'ウェイクアップ機能の無効化に失敗しました',
      });
    }
  };

  const handleFlowControlChange = async (value: string) => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting Flow Control..."; try { Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "フローコントロール" -DisplayValue "${value}"; Write-Host "Flow Control set successfully" } catch { Write-Host "Error setting Flow Control: $_" }; Write-Host "Flow Control setting completed."'`;
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setFlowControl(value);
        setToast({
          type: 'success',
          message: 'フローコントロールの設定を更新しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'フローコントロールの設定に失敗しました',
      });
    }
  };

  // 割込みモデレーションの設定を変更する関数を追加
  const handleInterruptModerationChange = async (value: string) => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting Interrupt Moderation..."; try { Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "割込みモデレーション" -DisplayValue "${value}"; Write-Host "Interrupt Moderation set successfully" } catch { Write-Host "Error setting Interrupt Moderation: $_" }; Write-Host "Interrupt Moderation setting completed."'`;
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setInterruptModeration(value);
        setToast({
          type: 'success',
          message: '割込みモデレーションの設定を更新しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: '割込みモデレーションの設定に失敗しました',
      });
    }
  };

  const handleMaxRssQueuesChange = async (value: string) => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting Maximum RSS Queues..."; try { Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "RSSキューの最大数" -DisplayValue "${value}"; Write-Host "Maximum RSS Queues set successfully" } catch { Write-Host "Error setting Maximum RSS Queues: $_" }; Write-Host "Maximum RSS Queues setting completed."'`;
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setMaxRssQueues(value);
        setToast({
          type: 'success',
          message: 'RSSキューの最大数を更新しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'RSSキューの最大数の設定に失敗しました',
      });
    }
  };

  const handlePriorityVlanChange = async (value: string) => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting Priority & VLAN..."; try { Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "優先度およびVLAN" -DisplayValue "${value}"; Write-Host "Priority & VLAN set successfully" } catch { Write-Host "Error setting Priority & VLAN: $_" }; Write-Host "Priority & VLAN setting completed."'`;
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setPriorityVlan(value);
        setToast({
          type: 'success',
          message: '優先度およびVLANの設定を更新しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: '優先度およびVLANの設定に失敗しました',
      });
    }
  };

  const handleWolShutdownLinkSpeedChange = async (value: string) => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting WOL and Shutdown Link Speed..."; try { Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "WOL とシャットダウンリンク速度" -DisplayValue "${value}"; Write-Host "WOL and Shutdown Link Speed set successfully" } catch { Write-Host "Error setting WOL and Shutdown Link Speed: $_" }; Write-Host "WOL and Shutdown Link Speed setting completed."'`;
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setWolShutdownLinkSpeed(value);
        setToast({
          type: 'success',
          message: 'WOLとシャットダウンリンク速度の設定を更新しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'WOLとシャットダウンリンク速度の設定に失敗しました',
      });
    }
  };

  const handleSpeedDuplexChange = async (value: string) => {
    if (!selectedNetworkInterface) {
      setToast({
        type: 'error',
        message: 'ネットワークインターフェースを選択してください',
      });
      return;
    }

    try {
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting Speed and Duplex..."; try { Set-NetAdapterAdvancedProperty -Name "${selectedNetworkInterface}" -DisplayName "速度とデュプレックス" -DisplayValue "${value}"; Write-Host "Speed and Duplex set successfully" } catch { Write-Host "Error setting Speed and Duplex: $_" }; Write-Host "Speed and Duplex setting completed."'`;
      const output = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (output) {
        setSpeedDuplex(value);
        setToast({
          type: 'success',
          message: '速度とデュプレックスの設定を更新しました',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: '速度とデュプレックスの設定に失敗しました',
      });
    }
  };

  const renderSettings = (sectionSettings: Setting[]) => {
    if (isLoadingTcpSettings || isLoadingAdapterSettings || isLoadingRscSettings) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-gray-400">設定を取得中...</span>
        </div>
      );
    }

    return sectionSettings.map((setting) => {
      if (setting.id.endsWith('-header')) {
        return (
          <div key={setting.id} className="mb-6">
            <h2 className="text-xl font-semibold text-white">{setting.name}</h2>
            <p className="text-sm text-gray-400 mt-1">{setting.description}</p>
          </div>
        );
      }

      if (setting.command.options) {
        return (
          <div key={setting.id} className="setting-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{setting.name}</h3>
                <p className="text-sm text-gray-400">{setting.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                {setting.id === 'tcp-wifi-mtu' ? (
                  <div className="flex items-center space-x-2">
                <select
                      value={selectedInterface}
                      onChange={(e) => handleInterfaceChange(e.target.value)}
                      className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm min-w-[200px]"
                    >
                      {mtuInterfaces.map((intf) => (
                        <option key={intf} value={intf}>
                          {intf}
                    </option>
                  ))}
                </select>
                    <input
                      type="number"
                      value={customValues['tcp-wifi-mtu'] || ''}
                      onChange={e => handleCustomValueChange('tcp-wifi-mtu', e.target.value)}
                      className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm w-20"
                      placeholder="MTU"
                      maxLength={4}
                    />
                    <button
                      onClick={() => handleValueApply('tcp-wifi-mtu', 'MTUサイズ')}
                      className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-xs"
                      disabled={loading}
                    >
                      <span>適用</span>
                    </button>
                  </div>
                ) : setting.id === 'ip-ttl' || setting.id === 'tcp-timed-wait-delay' || setting.id === 'irp-stack-size' || setting.id === 'tcp-max-user-port' ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={customValues[setting.id] || ''}
                      onChange={(e) => handleCustomValueChange(setting.id, e.target.value)}
                      className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 w-24 text-center focus:ring-primary-500 focus:border-primary-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder={setting.id === 'ip-ttl' ? 'TTL' : 
                                 setting.id === 'tcp-timed-wait-delay' ? 'TimeWaitDelay' :
                                 setting.id === 'irp-stack-size' ? 'Stack Size' :
                                 setting.id === 'tcp-max-user-port' ? 'Port' : 'Value'}
                      min={setting.id === 'tcp-max-user-port' ? '16384' : 
                           setting.id === 'ip-ttl' ? '1' :
                           setting.id === 'tcp-timed-wait-delay' ? '1' :
                           setting.id === 'irp-stack-size' ? '1' : undefined}
                      max={setting.id === 'ip-ttl' ? '128' : 
                           setting.id === 'tcp-max-user-port' ? '65535' :
                           setting.id === 'tcp-timed-wait-delay' ? '3600' :
                           setting.id === 'irp-stack-size' ? '50' : undefined}
                      maxLength={setting.id === 'tcp-max-user-port' ? 5 :
                                setting.id === 'ip-ttl' ? 3 : undefined}
                    />
                <button
                  onClick={() => handleValueApply(setting.id, setting.name)}
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isLoadingTcpSettings ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  ) : (
                    <span>適用</span>
                  )}
                </button>
                  </div>
                ) : (
                  <select
                    value={selectedValues[setting.id] || ''}
                    onChange={(e) => handleValueChange(setting.id, e.target.value)}
                    className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {Object.keys(setting.command.options)
                      .sort((a, b) => {
                        if (a === 'default') return -1;
                        if (b === 'default') return 1;
                        return a.localeCompare(b);
                      })
                      .map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        );
      }

      return (
        <div key={setting.id} className="setting-card">
          <ToggleSwitch
            id={setting.id}
            enabled={setting.enabled}
            onChange={(enabled) => handleToggle(setting.id, setting.name, enabled)}
            label={setting.name}
            description={setting.description}
            disabled={loading}
          />
        </div>
      );
    });
  };

  // IntDelayを無効にする関数を追加
  const handleDisableIntDelay = async () => {
    if (!networkRegistryPath) {
      setToast({
        type: 'error',
        message: 'レジストリパスを入力してください',
      });
      return;
    }

    try {
      const formattedPath = networkRegistryPath.replace(/\\/g, '\\\\');
      const commands = [
        `Set-ItemProperty -Path "HKLM:${formattedPath}" -Name "TxAbsIntDelay" -Value "0" -Type String`,
        `Set-ItemProperty -Path "HKLM:${formattedPath}" -Name "TxIntDelay" -Value "0" -Type String`,
        `Set-ItemProperty -Path "HKLM:${formattedPath}" -Name "RxAbsIntDelay" -Value "0" -Type String`,
        `Set-ItemProperty -Path "HKLM:${formattedPath}" -Name "RxIntDelay" -Value "0" -Type String`
      ];

      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Disabling IntDelay settings..."; try { ${commands.join('; ')}; Write-Host "IntDelay settings disabled successfully" } catch { Write-Host "Error disabling IntDelay settings: $_" }; Write-Host "IntDelay settings completed."'`;
      
      await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      setToast({
        type: 'success',
        message: 'IntDelay設定を無効化しました',
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'IntDelay設定の無効化に失敗しました',
      });
    }
  };

  // ThreadedDpcの設定を変更する関数を追加
  const handleThreadedDpcChange = async (enabled: boolean) => {
    if (!networkRegistryPath) {
      setToast({
        type: 'error',
        message: 'レジストリパスを入力してください',
      });
      return;
    }

    try {
      const formattedPath = networkRegistryPath.replace(/\\/g, '\\\\');
      const value = enabled ? "1" : "0";
      const commands = [
        `Set-ItemProperty -Path "HKLM:${formattedPath}" -Name "ThreadedDpcEnable" -Value ${value} -Type DWord`,
        `Set-ItemProperty -Path "HKLM:${formattedPath}" -Name "TxThreadedDpcEnable" -Value ${value} -Type DWord`
      ];

      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting ThreadedDpc..."; try { ${commands.join('; ')}; Write-Host "ThreadedDpc settings updated successfully" } catch { Write-Host "Error updating ThreadedDpc settings: $_" }; Write-Host "ThreadedDpc settings completed."'`;
      
      await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      setThreadedDpcEnabled(enabled);
      setToast({
        type: 'success',
        message: `ThreadedDpc設定を${enabled ? '有効' : '無効'}にしました`,
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'ThreadedDpc設定の更新に失敗しました',
      });
    }
  };

  // MaxRssProcessorsの設定を変更する関数を追加
  const handleMaxRssProcessorsChange = async (value: string) => {
    if (!networkRegistryPath) {
      setToast({
        type: 'error',
        message: 'レジストリパスを入力してください',
      });
      return;
    }

    try {
      const formattedPath = networkRegistryPath.replace(/\\/g, '\\\\');
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting MaxRssProcessors..."; try { Set-ItemProperty -Path "HKLM:${formattedPath}" -Name "*MaxRssProcessors" -Value "${value}" -Type String; Write-Host "MaxRssProcessors set successfully" } catch { Write-Host "Error setting MaxRssProcessors: $_" }; Write-Host "MaxRssProcessors setting completed."'`;
      
      await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      setMaxRssProcessors(value);
      setToast({
        type: 'success',
        message: 'MaxRssProcessorsの値を更新しました',
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'MaxRssProcessorsの設定に失敗しました',
      });
    }
  };

  // RssMaxProcNumberの設定を変更する関数を追加
  const handleRssMaxProcNumberChange = async (value: string) => {
    if (!networkRegistryPath) {
      setToast({
        type: 'error',
        message: 'レジストリパスを入力してください',
      });
      return;
    }

    try {
      const formattedPath = networkRegistryPath.replace(/\\/g, '\\\\');
      const command = `Start-Process powershell.exe -Verb RunAs -ArgumentList '$ErrorActionPreference = "Stop"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host "Setting RssMaxProcNumber..."; try { Set-ItemProperty -Path "HKLM:${formattedPath}" -Name "*RssMaxProcNumber" -Value "${value}" -Type String; Write-Host "RssMaxProcNumber set successfully" } catch { Write-Host "Error setting RssMaxProcNumber: $_" }; Write-Host "RssMaxProcNumber setting completed."'`;
      
      await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      setRssMaxProcNumber(value);
      setToast({
        type: 'success',
        message: 'RssMaxProcNumberの値を更新しました',
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'RssMaxProcNumberの設定に失敗しました',
      });
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-dark-700 mr-3">
            <Wifi className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">ネットワーク</h1>
            <p className="text-gray-400 mt-1">
              ネットワークのパフォーマンスを最適化するための設定
            </p>
          </div>
        </div>
      </div>

      {/* タブ部分 */}
      <div className="flex space-x-4 mb-6 border-b border-gray-700">
        <button
          className={`px-4 py-2 font-semibold border-b-2 ${activeTab === 'general' ? 'text-white border-primary-400' : 'text-gray-400 border-transparent'}`}
          onClick={() => setActiveTab('general')}
        >
          General Settings
        </button>
        <button
          className={`px-4 py-2 font-semibold border-b-2 ${activeTab === 'advanced' ? 'text-white border-primary-400' : 'text-gray-400 border-transparent'}`}
          onClick={() => setActiveTab('advanced')}
        >
          Advanced Settings
        </button>
        <button
          className={`px-4 py-2 font-semibold border-b-2 ${activeTab === 'extra' ? 'text-white border-primary-400' : 'text-gray-400 border-transparent'}`}
          onClick={() => setActiveTab('extra')}
        >
          Extra Settings
        </button>
      </div>

      {/* タブコンテンツ */}
      {activeTab === 'general' && (
        <>
          <div className="bg-dark-800 p-6 rounded-lg mb-8 relative">
            {(isLoadingTcpSettings || isLoadingAdapterSettings || isLoadingRscSettings || isLoadingInterfaces) && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-800/80 backdrop-blur-sm z-10 rounded-lg">
              <div className="flex items-center justify-center bg-dark-700 px-6 py-3 rounded-lg shadow-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-3 text-white">設定を取得中...</span>
              </div>
            </div>
          )}

            {/* General Settings Grid */}
            <div className="space-y-6">
              {/* ネットワークインターフェース情報 */}
              <div>
                <h3 className="text-sm text-gray-300 font-semibold mb-2">ネットワークインターフェース</h3>
                <div className="bg-dark-700/50 rounded-md p-3 max-w-md">
                  <div className="space-y-2">
                    {networkInterfaces.length > 0 ? (
                      networkInterfaces.map((iface, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center p-2 bg-dark-600/50 rounded-md cursor-pointer hover:bg-dark-600 transition-colors ${selectedNetworkInterface === iface.name ? 'bg-dark-600' : ''}`}
                          onClick={() => setSelectedNetworkInterface(iface.name)}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${selectedNetworkInterface === iface.name ? 'bg-primary-500' : 'bg-primary-500/70'} mr-2`}></div>
                          <span className="text-sm text-gray-200 truncate">{`${iface.description}（${iface.name}）`}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400 text-center py-2">インターフェース情報を取得中...</div>
                    )}
                  </div>
                </div>
              </div>

              {/* 設定グリッド */}
              <div className="grid grid-cols-2 gap-4">
          {/* 1行目 */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">TCP自動チューニングレベル</label>
            <select
              value={selectedValues['tcp-auto-tuning'] || ''}
              onChange={e => handleValueChange('tcp-auto-tuning', e.target.value)}
              className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
            >
              {Object.keys(settings.find(s => s.id === 'tcp-auto-tuning')?.command.options || {})
                .sort((a, b) => {
                  if (a === 'default') return -1;
                  if (b === 'default') return 1;
                  return a.localeCompare(b);
                })
                .map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">TTL</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={customValues['ip-ttl'] || ''}
                onChange={e => handleCustomValueChange('ip-ttl', e.target.value)}
                className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                placeholder="TTL"
              />
              <button
                onClick={() => handleValueApply('ip-ttl', 'TTL')}
                className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-xs"
                disabled={loading}
              >
                    <span>適用</span>
              </button>
            </div>
          </div>

          {/* 2行目 */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">スケーリングヒューリスティック</label>
            <select
              value={selectedValues['tcp-scaling-heuristics'] || ''}
              onChange={e => handleValueChange('tcp-scaling-heuristics', e.target.value)}
              className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
            >
              {Object.keys(settings.find(s => s.id === 'tcp-scaling-heuristics')?.command.options || {})
                .sort((a, b) => {
                  if (a === 'default') return -1;
                  if (b === 'default') return 1;
                  return a.localeCompare(b);
                })
                .map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">ECN Capability</label>
            <select
              value={selectedValues['tcp-ecn-capability'] || ''}
              onChange={e => handleValueChange('tcp-ecn-capability', e.target.value)}
              className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
            >
              {Object.keys(settings.find(s => s.id === 'tcp-ecn-capability')?.command.options || {})
                .sort((a, b) => {
                  if (a === 'default') return -1;
                  if (b === 'default') return 1;
                  return a.localeCompare(b);
                })
                .map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
            </select>
          </div>

          {/* 3行目 */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">輻輳制御プロバイダー</label>
            <select
              value={selectedValues['tcp-congestion-provider'] || ''}
              onChange={e => handleValueChange('tcp-congestion-provider', e.target.value)}
              className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
            >
              {Object.keys(settings.find(s => s.id === 'tcp-congestion-provider')?.command.options || {})
                .sort((a, b) => {
                  if (a === 'default') return -1;
                  if (b === 'default') return 1;
                  return a.localeCompare(b);
                })
                .map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">MTUサイズ</label>
            <div className="flex items-center space-x-2">
                  <select
                    value={selectedInterface}
                    onChange={(e) => handleInterfaceChange(e.target.value)}
                    className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm min-w-[200px]"
                  >
                    {mtuInterfaces.map((intf) => (
                      <option key={intf} value={intf}>
                        {intf}
                      </option>
                    ))}
                  </select>
              <input
                type="number"
                value={customValues['tcp-wifi-mtu'] || ''}
                onChange={e => handleCustomValueChange('tcp-wifi-mtu', e.target.value)}
                    className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm w-20"
                placeholder="MTU"
                maxLength={4}
              />
              <button
                onClick={() => handleValueApply('tcp-wifi-mtu', 'MTUサイズ')}
                className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-xs"
                disabled={loading}
              >
                    <span>適用</span>
              </button>
            </div>
          </div>

                        {/* 4行目 */}
                        <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">Receive Side Scaling (RSS)</label>
            <select
              value={selectedValues['tcp-receive-side-scaling'] || ''}
              onChange={e => handleValueChange('tcp-receive-side-scaling', e.target.value)}
              className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
            >
              {Object.keys(settings.find(s => s.id === 'tcp-receive-side-scaling')?.command.options || {})
                .sort((a, b) => {
                  if (a === 'default') return -1;
                  if (b === 'default') return 1;
                  return a.localeCompare(b);
                })
                .map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
            </select>
          </div>
                        <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">Receive Side Coalescing (RSC)</label>
            <select
              value={selectedValues['tcp-receive-side-coalescing'] || ''}
              onChange={e => handleValueChange('tcp-receive-side-coalescing', e.target.value)}
              className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
            >
              {Object.keys(settings.find(s => s.id === 'tcp-receive-side-coalescing')?.command.options || {})
                .sort((a, b) => {
                  if (a === 'default') return -1;
                  if (b === 'default') return 1;
                  return a.localeCompare(b);
                })
                .map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
            </select>
          </div>
                        {/* 5行目 */}
                        <div className="flex flex-col space-y-1">
                          <label className="text-sm text-gray-300 font-semibold mb-1">TCP Checksum Offload (IPv4)</label>
                          <select
                            value={tcpChecksumOffload}
                            onChange={(e) => handleTcpChecksumOffloadChange(e.target.value)}
                            className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                            disabled={!selectedNetworkInterface}
                          >
                            <option value="無効">無効</option>
                            <option value="受信と伝送有効">受信と伝送有効</option>
                            <option value="Rx 有効">Rx 有効</option>
                            <option value="Tx 有効">Tx 有効</option>
                          </select>
        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-sm text-gray-300 font-semibold mb-1">TCP Checksum Offload (IPv6)</label>
                          <select
                            value={tcpChecksumOffloadIPv6}
                            onChange={(e) => handleTcpChecksumOffloadIPv6Change(e.target.value)}
                            className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                            disabled={!selectedNetworkInterface}
                          >
                            <option value="無効">無効</option>
                            <option value="受信と伝送有効">受信と伝送有効</option>
                            <option value="Rx 有効">Rx 有効</option>
                            <option value="Tx 有効">Tx 有効</option>
                          </select>
                        </div>

                        {/* 6行目 */}
                        <div className="flex flex-col space-y-1">
                          <label className="text-sm text-gray-300 font-semibold mb-1">UDP Checksum Offload (IPv4)</label>
                          <select
                            value={udpChecksumOffloadIPv4}
                            onChange={(e) => handleUdpChecksumOffloadIPv4Change(e.target.value)}
                            className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                            disabled={!selectedNetworkInterface}
                          >
                            <option value="無効">無効</option>
                            <option value="受信と伝送有効">受信と伝送有効</option>
                            <option value="Rx 有効">Rx 有効</option>
                            <option value="Tx 有効">Tx 有効</option>
                          </select>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-sm text-gray-300 font-semibold mb-1">UDP Checksum Offload (IPv6)</label>
                          <select
                            value={udpChecksumOffloadIPv6}
                            onChange={(e) => handleUdpChecksumOffloadIPv6Change(e.target.value)}
                            className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                            disabled={!selectedNetworkInterface}
                          >
                            <option value="無効">無効</option>
                            <option value="受信と伝送有効">受信と伝送有効</option>
                            <option value="Rx 有効">Rx 有効</option>
                            <option value="Tx 有効">Tx 有効</option>
                          </select>
                        </div>

                        {/* 7行目 */}
                        <div className="flex flex-col space-y-1">
                          <label className="text-sm text-gray-300 font-semibold mb-1">IPv4 Checksum Offload</label>
                          <select
                            value={ipv4ChecksumOffload}
                            onChange={(e) => handleIpv4ChecksumOffloadChange(e.target.value)}
                            className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                            disabled={!selectedNetworkInterface}
                          >
                            <option value="無効">無効</option>
                            <option value="受信と伝送有効">受信と伝送有効</option>
                            <option value="Rx 有効">Rx 有効</option>
                            <option value="Tx 有効">Tx 有効</option>
                          </select>
                        </div>

                        {/* 8行目 */}
                        <div className="flex flex-col space-y-1">
                          <label className="text-sm text-gray-300 font-semibold mb-1">一括送信オフロード v2 (IPv4)</label>
                          <select
                            value={largeSendOffloadV2IPv4}
                            onChange={(e) => handleLargeSendOffloadV2IPv4Change(e.target.value)}
                            className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                            disabled={!selectedNetworkInterface}
                          >
                            <option value="無効">無効</option>
                            <option value="有効">有効</option>
                          </select>
                        </div>
                        <div className="flex flex-col space-y-1">
                  {/* 8行目 */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-300 font-semibold mb-1">一括送信オフロード v2 (IPv4)</label>
                    <select
                      value={largeSendOffloadV2IPv4}
                      onChange={(e) => handleLargeSendOffloadV2IPv4Change(e.target.value)}
                      className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                      disabled={!selectedNetworkInterface}
                    >
                      <option value="無効">無効</option>
                      <option value="有効">有効</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-300 font-semibold mb-1">一括送信オフロード v2 (IPv6)</label>
                    <select
                      value={largeSendOffloadV2IPv6}
                      onChange={(e) => handleLargeSendOffloadV2IPv6Change(e.target.value)}
                      className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                      disabled={!selectedNetworkInterface}
                    >
                      <option value="無効">無効</option>
                      <option value="有効">有効</option>
                    </select>
                  </div>

                  {/* 9行目 */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-300 font-semibold mb-1">ARP オフロード</label>
                    <select
                      value={arpOffload}
                      onChange={(e) => handleArpOffloadChange(e.target.value)}
                      className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                      disabled={!selectedNetworkInterface}
                    >
                      <option value="無効">無効</option>
                      <option value="有効">有効</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-300 font-semibold mb-1">NS オフロード</label>
                    <select
                      value={nsOffload}
                      onChange={(e) => handleNsOffloadChange(e.target.value)}
                      className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                      disabled={!selectedNetworkInterface}
                    >
                      <option value="無効">無効</option>
                      <option value="有効">有効</option>
                    </select>
                  </div>

                  {/* 10行目 */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-300 font-semibold mb-1">受信側スケーリング</label>
                    <select
                      value={receiveSideScaling}
                      onChange={(e) => handleReceiveSideScalingChange(e.target.value)}
                      className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                      disabled={!selectedNetworkInterface}
                    >
                      <option value="無効">無効</option>
                      <option value="有効">有効</option>
                    </select>
                  </div>

                  {/* フローコントロール */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-300 font-semibold mb-1">フローコントロール</label>
                    <select
                      value={flowControl}
                      onChange={(e) => handleFlowControlChange(e.target.value)}
                      className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                      disabled={!selectedNetworkInterface}
                    >
                      <option value="無効">無効</option>
                      <option value="受信と伝送有効">受信と伝送有効</option>
                    </select>
                  </div>

                  {/* 割込みモデレーション */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-300 font-semibold mb-1">割込みモデレーション</label>
                    <select
                      value={interruptModeration}
                      onChange={(e) => handleInterruptModerationChange(e.target.value)}
                      className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                      disabled={!selectedNetworkInterface}
                    >
                      <option value="無効">無効</option>
                      <option value="有効">有効</option>
                    </select>
                  </div>

                  {/* 11行目 - 省電力機能一括無効化 */}
                  <div className="col-span-2 flex flex-col space-y-1">
                    <label className="text-sm text-gray-300 font-semibold mb-1">省電力機能一括無効化</label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-dark-700/50 rounded-md p-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-sm text-gray-400">
                            <span className="font-medium">省電力型イーサネット(EEE):</span> {powerSavingSettings.eee}
                          </div>
                          <div className="text-sm text-gray-400">
                            <span className="font-medium">Advanced EEE:</span> {powerSavingSettings.advancedEee}
                          </div>
                          <div className="text-sm text-gray-400">
                            <span className="font-medium">グリーンイーサネット:</span> {powerSavingSettings.greenEthernet}
                          </div>
                          <div className="text-sm text-gray-400">
                            <span className="font-medium">自動無効ギガビット:</span> {powerSavingSettings.autoGigabitDisable}
                          </div>
                          <div className="text-sm text-gray-400">
                            <span className="font-medium">Gigabit Lite:</span> {powerSavingSettings.gigabitLite}
                          </div>
                          <div className="text-sm text-gray-400">
                            <span className="font-medium">Power Saving Mode:</span> {powerSavingSettings.powerSavingMode}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleDisableAllPowerSaving}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                        disabled={!selectedNetworkInterface}
                      >
                        すべて無効化
                      </button>
                    </div>
                  </div>

                  {/* 12行目 - ウェイクアップ機能一括無効化 */}
                  <div className="col-span-2 flex flex-col space-y-1">
                    <label className="text-sm text-gray-300 font-semibold mb-1">ウェイクアップ機能一括無効化</label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-dark-700/50 rounded-md p-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-sm text-gray-400">
                            <span className="font-medium">ウェイク・オン・マジック・パケット:</span> {wakeupSettings.wakeOnMagicPacket}
                          </div>
                          <div className="text-sm text-gray-400">
                            <span className="font-medium">ウェイク・オン・パターン・マッチ:</span> {wakeupSettings.wakeOnPatternMatch}
                          </div>
                          <div className="text-sm text-gray-400">
                            <span className="font-medium">LAN 上のウェークアップのシャットダウン:</span> {wakeupSettings.wakeOnLanShutdown}
                          </div>
                          <div className="text-sm text-gray-400">
                            <span className="font-medium">Wake on magic packet when system is in S4/S5:</span> {wakeupSettings.wakeOnMagicPacketS4S5}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleDisableAllWakeup}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                        disabled={!selectedNetworkInterface}
                      >
                        すべて無効化
                      </button>
                    </div>
                  </div>

                  {/* RSSキューの最大数 */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-300 font-semibold mb-1">RSSキューの最大数</label>
                    <select
                      value={maxRssQueues}
                      onChange={(e) => handleMaxRssQueuesChange(e.target.value)}
                      className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                      disabled={!selectedNetworkInterface}
                    >
                      <option value="1キュー">1キュー</option>
                      <option value="2キュー">2キュー</option>
                      <option value="3キュー">3キュー</option>
                      <option value="4キュー">4キュー</option>
                    </select>
                  </div>

                  {/* 優先度およびVLAN */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-300 font-semibold mb-1">優先度およびVLAN</label>
                    <select
                      value={priorityVlan}
                      onChange={(e) => handlePriorityVlanChange(e.target.value)}
                      className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                      disabled={!selectedNetworkInterface}
                    >
                      <option value="優先度有効">優先度有効</option>
                      <option value="VLAN 有効">VLAN 有効</option>
                      <option value="優先度およびVLAN 無効">優先度およびVLAN 無効</option>
                      <option value="優先度およびVLAN 有効">優先度およびVLAN 有効</option>
                    </select>
                  </div>

                  {/* WOLとシャットダウンリンク速度 */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-300 font-semibold mb-1">WOLとシャットダウンリンク速度</label>
                    <select
                      value={wolShutdownLinkSpeed}
                      onChange={(e) => handleWolShutdownLinkSpeedChange(e.target.value)}
                      className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                      disabled={!selectedNetworkInterface}
                    >
                      <option value="10 Mbps 優先">10 Mbps 優先</option>
                      <option value="100 Mbps 優先">100 Mbps 優先</option>
                      <option value="速度低下ではない">速度低下ではない</option>
                    </select>
                  </div>

                  {/* 速度とデュプレックス */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-300 font-semibold mb-1">速度とデュプレックス</label>
                    <select
                      value={speedDuplex}
                      onChange={(e) => handleSpeedDuplexChange(e.target.value)}
                      className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                      disabled={!selectedNetworkInterface}
                    >
                      <option value="自動ネゴシエーション">自動ネゴシエーション</option>
                      <option value="1.0 Gbps フルデュプレックス">1.0 Gbps フルデュプレックス</option>
                      <option value="100 Mbps ハーフデュープレックス">100 Mbps ハーフデュープレックス</option>
                      <option value="100 Mbps フルデュプレックス">100 Mbps フルデュプレックス</option>
                      <option value="10 Mbps ハーフデュープレックス">10 Mbps ハーフデュープレックス</option>
                      <option value="10 Mbps フルデュプレックス">10 Mbps フルデュプレックス</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          
        </>
      )}

      {activeTab === 'advanced' && (
        <div className="relative grid grid-cols-2 gap-4 bg-dark-800 p-6 rounded-lg mb-8" style={{gridTemplateRows: 'repeat(5, minmax(0, 1fr))'}}>
          {(isLoadingTcpSettings || isLoadingAdapterSettings || isLoadingRscSettings) && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-800/80 backdrop-blur-sm z-10 rounded-lg">
              <div className="flex items-center justify-center bg-dark-700 px-6 py-3 rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-3 text-white">設定を取得中...</span>
              </div>
            </div>
          )}
          {/* 1行目 */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">最大SYN再送信回数</label>
            <select
              value={selectedValues['tcp-max-syn-retransmissions'] || ''}
              onChange={e => handleValueChange('tcp-max-syn-retransmissions', e.target.value)}
              className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
            >
              {Object.keys(settings.find(s => s.id === 'tcp-max-syn-retransmissions')?.command.options || {})
                .sort((a, b) => {
                  if (a === 'default') return -1;
                  if (b === 'default') return 1;
                  return a.localeCompare(b);
                })
                .map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">TCP ACK Frequency</label>
            <select
              value={selectedValues['tcp-ack-frequency'] || ''}
              onChange={e => handleValueChange('tcp-ack-frequency', e.target.value)}
              className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
            >
              {Object.keys(settings.find(s => s.id === 'tcp-ack-frequency')?.command.options || {})
                .sort((a, b) => {
                  if (a === 'default') return -1;
                  if (b === 'default') return 1;
                  return a.localeCompare(b);
                })
                .map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
            </select>
          </div>
          {/* 2行目 */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">NonSackRTTresiliency</label>
            <select
              value={selectedValues['tcp-nonsackrttresiliency'] || ''}
              onChange={e => handleValueChange('tcp-nonsackrttresiliency', e.target.value)}
              className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
            >
              {Object.keys(settings.find(s => s.id === 'tcp-nonsackrttresiliency')?.command.options || {})
                .sort((a, b) => {
                  if (a === 'default') return -1;
                  if (b === 'default') return 1;
                  return a.localeCompare(b);
                })
                .map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">TCP No Delay</label>
            <select
              value={selectedValues['tcp-no-delay'] || ''}
              onChange={e => handleValueChange('tcp-no-delay', e.target.value)}
              className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
            >
              {Object.keys(settings.find(s => s.id === 'tcp-no-delay')?.command.options || {})
                .sort((a, b) => {
                  if (a === 'default') return -1;
                  if (b === 'default') return 1;
                  return a.localeCompare(b);
                })
                .map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">Initial Retransmission Timer</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={customValues['tcp-initial-retransmission-timer'] || ''}
                onChange={e => handleCustomValueChange('tcp-initial-retransmission-timer', e.target.value)}
              className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                placeholder="Initial RTO"
                min="300"
                max="3000"
                maxLength={4}
              />
              <button
                onClick={() => handleValueApply('tcp-initial-retransmission-timer', 'Initial Retransmission Timer')}
                className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-xs"
                disabled={loading}
              >
                <span>適用</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">TCP Delayed ACK Ticks</label>
            <select
              value={selectedValues['tcp-del-ack-ticks'] || ''}
              onChange={e => handleValueChange('tcp-del-ack-ticks', e.target.value)}
              className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
            >
              {Object.keys(settings.find(s => s.id === 'tcp-del-ack-ticks')?.command.options || {})
                .sort((a, b) => {
                  if (a === 'default') return -1;
                  if (b === 'default') return 1;
                  return a.localeCompare(b);
                })
                .map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">IRP Stack Size</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={customValues['irp-stack-size'] || ''}
                onChange={e => handleCustomValueChange('irp-stack-size', e.target.value)}
                className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                placeholder="IRP Stack Size"
                maxLength={2}
              />
              <button
                onClick={() => handleValueApply('irp-stack-size', 'IRP Stack Size')}
                className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-xs"
                disabled={loading}
              >
                <span>適用</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">TimeWaitDelay</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={customValues['tcp-timed-wait-delay'] || ''}
                onChange={e => handleCustomValueChange('tcp-timed-wait-delay', e.target.value)}
                className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                placeholder="TimeWaitDelay"
                maxLength={4}
              />
              <button
                onClick={() => handleValueApply('tcp-timed-wait-delay', 'TimeWaitDelay')}
                className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-xs"
                disabled={loading}
              >
                <span>適用</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">メモリ圧力保護</label>
            <select
              value={selectedValues['tcp-memory-pressure-protection'] || ''}
              onChange={e => handleValueChange('tcp-memory-pressure-protection', e.target.value)}
              className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
            >
              {Object.keys(settings.find(s => s.id === 'tcp-memory-pressure-protection')?.command.options || {})
                .sort((a, b) => {
                  if (a === 'default') return -1;
                  if (b === 'default') return 1;
                  return a.localeCompare(b);
                })
                .map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">ポート番号数</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={customValues['tcp-max-user-port'] || ''}
                onChange={e => handleCustomValueChange('tcp-max-user-port', e.target.value)}
                className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                placeholder="ポート番号数"
              />
              <button
                onClick={() => handleValueApply('tcp-max-user-port', 'ポート番号数')}
                className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-xs"
                disabled={loading}
              >
                <span>適用</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">NonBestEffortLimit</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={customValues['non-best-effort-limit'] || ''}
                onChange={e => handleCustomValueChange('non-best-effort-limit', e.target.value)}
                className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                placeholder="0-100"
                min="0"
                max="100"
                maxLength={3}
              />
              <button
                onClick={() => handleValueApply('non-best-effort-limit', 'NonBestEffortLimit')}
                className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-xs"
                disabled={loading}
              >
                <span>適用</span>
              </button>
        </div>
          </div>

          {/* Do not use NLA設定を追加 */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-300 font-semibold mb-1">Do not use NLA</label>
            <select
              value={selectedValues['qos-do-not-use-nla'] || 'default'}
              onChange={e => handleValueChange('qos-do-not-use-nla', e.target.value)}
              className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
            >
              <option value="default">デフォルト</option>
              <option value="optimized">最適化</option>
            </select>
            </div>
            </div>
          )}

      {/* トグル式の設定は下部に従来通り表示 */}
      {(activeTab === 'general' || activeTab === 'advanced') && (
      <div className="space-y-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">TCP/IP設定</h2>
          <p className="text-sm text-gray-400 mt-1">TCP/IPの基本設定を管理します</p>
        </div>
        {settings.filter(s => !s.command.options).map(setting => (
          <div key={setting.id} className="setting-card">
            <ToggleSwitch
              id={setting.id}
              enabled={setting.enabled}
              onChange={(enabled) => handleToggle(setting.id, setting.name, enabled)}
              label={setting.name}
              description={setting.description}
              disabled={loading}
            />
          </div>
        ))}
      </div>
      )}

      {activeTab === 'extra' && (
        <div className="relative grid grid-cols-2 gap-4 bg-dark-800 p-6 rounded-lg mb-8">
          {(isLoadingRegistry) && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-800/80 backdrop-blur-sm z-10 rounded-lg">
              <div className="flex items-center justify-center bg-dark-700 px-6 py-3 rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-3 text-white">レジストリ値を取得中...</span>
              </div>
            </div>
          )}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">追加設定</h2>
            <p className="text-sm text-gray-400 mb-6">その他の高度なネットワーク設定を管理します。</p>
          </div>

          {/* ネットワークレジストリパス入力欄 */}
          <div className="col-span-2">
            <div className="bg-dark-700/50 rounded-lg p-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-300">ネットワークレジストリパス</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={networkRegistryPath}
                    onChange={(e) => setNetworkRegistryPath(e.target.value)}
                    className="flex-1 bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm font-mono"
                    placeholder="レジストリパスを入力"
                  />
                  <button
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm"
                    onClick={() => getRegistryValues(networkRegistryPath)}
                  >
                    適用
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  例: HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Class\\{'{'}4d36e972-e325-11ce-bfc1-08002be10318{'}'}\0001
                </p>
              </div>
            </div>
          </div>

          {/* TransmitBuffers設定 */}
          <div className="col-span-1">
            <div className="bg-dark-700/50 rounded-lg p-4 h-full">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-300">TransmitBuffers</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={transmitBuffers}
                    onChange={(e) => setTransmitBuffers(e.target.value)}
                    className="flex-1 bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                    placeholder="値を入力"
                  />
                  <button
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm"
                    onClick={() => handleBufferChange('transmit', transmitBuffers)}
                    disabled={!networkRegistryPath}
                  >
                    適用
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ReceiveBuffers設定 */}
          <div className="col-span-1">
            <div className="bg-dark-700/50 rounded-lg p-4 h-full">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-300">ReceiveBuffers</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={receiveBuffers}
                    onChange={(e) => setReceiveBuffers(e.target.value)}
                    className="flex-1 bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                    placeholder="値を入力"
                  />
                  <button
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm"
                    onClick={() => handleBufferChange('receive', receiveBuffers)}
                    disabled={!networkRegistryPath}
                  >
                    適用
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ReceiveBuffers設定の後に新しい設定項目を追加 */}
          <div className="col-span-1">
            <div className="bg-dark-700/50 rounded-lg p-4 h-full">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-300">MaxRssProcessors</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={maxRssProcessors}
                    onChange={(e) => setMaxRssProcessors(e.target.value)}
                    className="flex-1 bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                    placeholder="RSSキューの数と同じ値"
                  />
                  <button
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm"
                    onClick={() => handleMaxRssProcessorsChange(maxRssProcessors)}
                    disabled={!networkRegistryPath}
                  >
                    適用
                  </button>
                </div>
                <p className="text-xs text-gray-400">RSSキューの数と同じにしてください</p>
                <div className="text-xs text-primary-400">現在値: {maxRssProcessors}</div>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-dark-700/50 rounded-lg p-4 h-full">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-300">RssMaxProcNumber</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={rssMaxProcNumber}
                    onChange={(e) => setRssMaxProcNumber(e.target.value)}
                    className="flex-1 bg-dark-700 text-white border border-dark-600 rounded-md p-2 text-sm"
                    placeholder="論理プロセッサ数-2"
                  />
                  <button
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm"
                    onClick={() => handleRssMaxProcNumberChange(rssMaxProcNumber)}
                    disabled={!networkRegistryPath}
                  >
                    適用
                  </button>
                </div>
                <p className="text-xs text-gray-400">論理プロセッサ数-2の値にしてください</p>
                <div className="text-xs text-primary-400">現在値: {rssMaxProcNumber}</div>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-dark-700/50 rounded-lg p-4 h-full">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-300">ThreadedDpc設定</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">ThreadedDpcを無効にする</span>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                    <input
                      type="checkbox"
                      className="hidden"
                      id="threadedDpc"
                      checked={!threadedDpcEnabled}
                      onChange={(e) => handleThreadedDpcChange(!e.target.checked)}
                      disabled={!networkRegistryPath}
                    />
                    <label
                      htmlFor="threadedDpc"
                      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-dark-600 rounded-full transition-all duration-200 ${
                        !threadedDpcEnabled ? 'bg-white' : ''
                      }`}
                    >
                      <span
                        className={`absolute left-1 top-1 w-4 h-4 ${!threadedDpcEnabled ? 'bg-black' : 'bg-white'} rounded-full transition-transform duration-200 transform ${
                          !threadedDpcEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                <p className="text-xs text-gray-400">ThreadedDpcEnableとTxThreadedDpcEnableを設定します</p>
                <div className="text-xs text-primary-400">ThreadedDpcEnable: {threadedDpcValues.ThreadedDpcEnable} / TxThreadedDpcEnable: {threadedDpcValues.TxThreadedDpcEnable}</div>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-dark-700/50 rounded-lg p-4 h-full">
              <div className="flex flex-col space-y-3">
                <label className="text-sm font-medium text-gray-300">IntDelay設定</label>
                <div className="bg-dark-800/50 rounded-md p-3">
                  <div className="flex flex-col space-y-2">
                    <div className="text-xs text-gray-400">以下の値を0に設定します：</div>
                    <ul className="list-disc list-inside text-xs text-gray-300 ml-2 space-y-1">
                      <li>TxAbsIntDelay <span className='ml-2 text-primary-400'>{intDelayValues.TxAbsIntDelay}</span></li>
                      <li>TxIntDelay <span className='ml-2 text-primary-400'>{intDelayValues.TxIntDelay}</span></li>
                      <li>RxAbsIntDelay <span className='ml-2 text-primary-400'>{intDelayValues.RxAbsIntDelay}</span></li>
                      <li>RxIntDelay <span className='ml-2 text-primary-400'>{intDelayValues.RxIntDelay}</span></li>
                    </ul>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                    onClick={handleDisableIntDelay}
                    disabled={!networkRegistryPath}
                  >
                    すべて無効化
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
        </div>
      )}
    </div>
  );
};

export default NetworkPage; 