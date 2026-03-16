# Backupinformatie

## Waarom backup nodig is
Code-backups en database-backups zijn twee verschillende dingen:
- Git/GitHub backup bewaart je code.
- Database backup bewaart je echte gebruikersdata.

Je hebt beide nodig.

## Drie niveaus van database-backup (Supabase)

### 1. Point-in-time recovery (PITR)
- Automatische, continue backups via WAL.
- Herstel naar een specifiek tijdstip.
- Meestal beschikbaar op betaalde plannen.

### 2. Geplande SQL dumps (`pg_dump`)
- Dagelijkse of wekelijkse dump van de database.
- Opslaan op externe opslag (S3, Drive, andere veilige locatie).
- Goed als extra, onafhankelijke backup naast PITR.

### 3. Handmatige snapshots/export
- Handig als noodoplossing.
- Minder geschikt als structurele strategie.

## Aanbevolen frequentie
- Dagelijks: volledige dump.
- Wekelijks: extra weekly dump.
- Retentie: 
  - daily: 30 dagen
  - weekly: 12 weken
  - monthly: 12 maanden

## Praktische minimale setup
1. PITR aanzetten (indien beschikbaar in je Supabase plan).
2. Extra automatische dump (cron of GitHub Actions).
3. Backups buiten Supabase bewaren.
4. Periodiek restore-test uitvoeren.

## Belangrijkste valkuilen
- Alleen code backupen (en database vergeten).
- Nooit restore-test doen.
- Geen retentiebeleid instellen.
- Backups op dezelfde plek bewaren als productie.

## Snelle checklist
- [ ] Code backup in GitHub aanwezig
- [ ] Database backup actief
- [ ] Retentie ingesteld
- [ ] Restore-test minimaal 1x per kwartaal
- [ ] Toegang tot backups beperkt en veilig

## Context van dit project
- Code-backup branch aangemaakt: `backup-2026-03-16-1328`
- Database draait op Supabase
- SQL migraties zijn uitgevoerd

