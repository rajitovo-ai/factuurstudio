# Email Verzending Setup - Requirements Checklist

> Vereisten voor het implementeren van factuur email verzending via Resend.com

---

## Benodigd van jou:

### 1. Resend.com Account & API Key

- [ ] Account aanmaken op [resend.com](https://resend.com)
- [ ] Domein verifiëren: `factuurstudio.nl`
- [ ] API key genereren (format: `re_xxxxxxxxxxxx`)
- [ ] API key doorsturen voor Supabase secrets

### 2. Supabase Secret (ik regel dit)

```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx
```

### 3. Afzender Email Adres

Keuze:
- [ ] `facturen@factuurstudio.nl`
- [ ] `noreply@factuurstudio.nl`
- [ ] `info@factuurstudio.nl`
- [ ] Anders: ________________

### 4. Email Template Voorkeur

- [ ] **A)** Eenvoudige tekst-email met factuur link
- [ ] **B)** HTML email met logo en styling
- [ ] **C)** Beide (tekst + HTML fallback)

### 5. Email Geschiedenis Bijhouden?

- [ ] Ja = database tabel voor email logs
- [ ] Nee = alleen verzenden, geen historie

---

## Wat ik bouw zodra bovenstaand compleet is:

1. Supabase Edge Function `send-invoice-email`
2. "Verzend per email" knop in factuur overzicht
3. Automatische status update naar "verzonden"
4. Email templates in NL en EN (i18n)
5. PDF attachment support (indien gewenst)

---

## Resend.com Setup Stappen (voor referentie):

1. Ga naar [resend.com](https://resend.com)
2. Sign up / Login
3. Click "Domains" → "Add Domain"
4. Voeg `factuurstudio.nl` toe
5. Volg DNS verificatie instructies
6. Ga naar "API Keys" → "Create API Key"
7. Kopieer de key (begint met `re_`)
8. Stuur deze key veilig door

---

*Aangemaakt: 28 maart 2026*
