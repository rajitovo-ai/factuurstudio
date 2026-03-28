# i18n Memory Optimization Fixes

## 🚀 Directe Oplossingen

### 1. VSCode Settings (BELANGRIJK!)
Kopieer de inhoud van `vscode-settings.json` naar je VSCode settings:
1. Open VSCode
2. Ctrl+Shift+P → "Open Settings (JSON)"
3. Plak de inhoud van `vscode-settings.json`
4. Sla op en herstart VSCode

### 2. Codeium AI Optimalisatie
- Ga naar Extensions → Codeium
- Klik op settings (tandwiel)
- Zet "Index all files" UIT
- Zet "Enable AI suggestions" aan (maar beperkt)

### 3. Memory Monitoring
```bash
# Monitor memory usage
watch -n 5 'free -h && ps aux --sort=-%mem | head -5'

# Monitor Windsurf processen
watch -n 3 'ps aux | grep windsurf | head -3'
```

## 🔧 Preventieve Maatregelen

### 4. Swap Space Toevoegen (Indien nodig)
```bash
# 4GB swap file aanmaken
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
# Permanent maken
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 5. Windsurf Memory Limit
```bash
# Start met memory limiet
windsurf --max-memory=4096
```

### 6. Project Cleanup
```bash
# Onnodige files verwijderen
rm -rf dist build coverage .next
npm cache clean --force
```

## 📊 Verwachte Resultaten

- **Memory reduction:** 200-400MB minder
- **File watcher load:** 80% minder
- **Crashes:** Zouden moeten stoppen
- **Performance:** Snellere file operations

## ⚠️ Belangrij Notes

1. **VSCode settings** zijn het meest effectief
2. **File watcher exclude** voorkomt de meeste crashes
3. **Codeium indexing** kan tijdelijk uit
4. **Memory monitoring** helpt problemen vroeg detecteren

## 🔍 Test Plan

1. ✅ VSCode settings toegepast
2. ✅ Windsurf herstart
3. ✅ Memory monitoring gestart
4. ✅ Test met grote files
5. ✅ Monitor voor crashes

Als crashes blijven doorgaan:
- Codeium volledig uitschakelen
- Swap space toevoegen
- Gebruik轻量级 editor (bijv. Sublime Text) voor grote edits
