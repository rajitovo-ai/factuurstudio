# Blog Posts Validatie Checklist

Voordat je wijzigingen pusht naar `src/data/blogPosts.ts`:

## 1. Syntax Check
```bash
npx tsc --noEmit src/data/blogPosts.ts
```

## 2. Build Check  
```bash
npm run build
```

## 3. Veelvoorkomende valkuilen checken

### Backticks in content
Zoek naar niet-geëscapete backticks:
```bash
grep -n "^- \`" src/data/blogPosts.ts
grep -n "^\`\`\`" src/data/blogPosts.ts | grep -v "\\\`\\\`\\\`"
```

### Post structuur verifiëren
Elke post moet eindigen met:
```javascript
    ]
  },
```

### old_string residu checken
```bash
grep -n "old_string:" src/data/blogPosts.ts
```

## 4. Template literal regels

| Scenario | Correct | Fout |
|----------|---------|------|
| Inline code | `\\`code\\`` | `` `code` `` |
| Code block start | `\\`\\`\\`` | `` ``` `` |
| Code block end | `\\`\\`\\`` | `` ``` `` |

## 5. Automatische pre-commit hook (optioneel)

Voeg toe aan `.husky/pre-commit` of `package.json` scripts:
```json
"validate:blog": "npx tsc --noEmit src/data/blogPosts.ts"
```

---

## Wat te doen bij fouten

1. **Stop direct** - commit geen kapotte code
2. Identificeer het type fout:
   - Parse error = syntax probleem
   - "Unexpected token" = waarschijnlijk backticks
   - "Declaration expected" = missende sluiting
3. Fix **één probleem per keer**
4. Test met `npm run build`
5. Commit pas als de build slaagt
