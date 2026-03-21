# Factuur Studio - Actie Checklist

Markeer hieronder wat je wilt dat ik eerst fix/build. Zet een `[x]` voor items die je prioriteit zijn.

---

## 🔴 CRITICAL (Aanbevolen nu te doen)

### Advertentie Copy Cleanup
- [ ] **Fix duplicaten in ADVERTENTIE_TEKSTEN.md**
  - [ ] Verwijder dubbele "Variant B - Benefit-Driven" in Nextdoor (lines 88-106 & 109-121)
  - [ ] Verwijder dubbele "Variant B - Problem-Aware" in LinkedIn/Google Ads
  - [ ] Replace alle "FactuurGenerator" → "Factuur Studio" (minstens 5x)
  - [ ] Fix typo `www.factuurstudio.nlten` → `www.factuurstudio.nl`
  - [ ] Fix broken heading `## 8. R**Factuur Studio**` → `## 8. Referral / Indirect Marketing`
  - [ ] Fix mensled TikTok section (2 varianten proper scheiden)

### Stripe Flow Validatie
- [ ] **Test complete signup → Pro upgrade flow**
  - [ ] Register new email → Dashboard laden
  - [ ] Click "Upgrade naar Pro"
  - [ ] Stripe checkout openen → Complete payment
  - [ ] Return to dashboard → Plan should show "Pro maandelijks" or "Pro jaarlijks"
  - [ ] Sync button drukken (fallback test)

---

## 🟡 HIGH PRIORITY (Deze week)

### Marketing Infrastructure
- [ ] **Pricing page maken** (`/pricing` route)
  - [ ] Show free vs pro features comparison
  - [ ] Include "No credit card needed" badge
  - [ ] Link to dashboard / sign up CTA

- [ ] **Email Templates setup**
  - [ ] Welcome email (confirmation + quick start)
  - [ ] Password reset template
  - [ ] Upgrade confirmation (post-payment)

- [ ] **Landing page improvements**
  - [ ] Add FAQ section (top 5 questions)
  - [ ] Add trust badges (🇳🇱 Dutch company, GDPR, secure)
  - [ ] Add "Works with [Accounting software icons]"
  - [ ] Social proof counter ("2,347 facturen gemaakt dit maand")

### Analytics & Tracking
- [ ] **Install analytics** (choose one: Plausible, Fathom, or Mixpanel)
  - [ ] Track signup conversions
  - [ ] Track payment completion
  - [ ] Track plan downgrades (why?)

---

## 🟢 MEDIUM PRIORITY (Nice-to-have soon)

### Code Quality
- [ ] **Complete ADVERTENTIE_TEKSTEN.md sections**
  - [ ] Add Google Ads copy (3 variants with headlines)
  - [ ] Add WhatsApp marketing templates (5 messages)
  - [ ] Add Email signature templates
  - [ ] Add Reddit / HackerNews tone variants

- [ ] **Export & Feature enhancements**
  - [ ] Add CSV export (invoices list)
  - [ ] Add PDF export (invoice history)
  - [ ] Add Excel import (bulk invoice creation)

### Customer Experience
- [ ] **Add support resources**
  - [ ] Help/Support link in sidebar
  - [ ] Embed Intercom or Crisp chat widget
  - [ ] Create simple knowledge base (3-5 articles)

- [ ] **Payment experience**
  - [ ] Add PDF receipt email (post-payment)
  - [ ] Show payment history in Settings
  - [ ] Add "Manage subscription" → Stripe portal link

---

## 🔵 LOW PRIORITY (Optional / Future)

### Feature Ideas
- [ ] **Automation**
  - [ ] Auto-send payment reminders (7 days before due)
  - [ ] Auto-mark invoices as "Late" (30+ days unpaid)
  - [ ] Recurring invoices (subscription-like)

- [ ] **Integrations**
  - [ ] Slack notifications (new invoice, payment received)
  - [ ] Google Calendar sync (invoice due dates)
  - [ ] Zapier / Make.com support

- [ ] **Advanced Features**
  - [ ] Invoice templates (design customization)
  - [ ] Multi-currency support (EUR, USD, GBP)
  - [ ] Bank transaction matching (auto-reconciliation)
  - [ ] Invoice API for third parties

### Polish
- [ ] **Mobile PWA** (installable app)
- [ ] **Dark mode** support
- [ ] **Multi-language** (EN, DE, FR)

---

## 📋 HOW TO USE THIS CHECKLIST

1. **Check boxes** voor items die je wilt prioriteren
2. **Reply met:** `Doe dit:` + list of checked items
3. Ik zal ze sequentieel uitvoeren en progress updaten

**Example:**
```
Doe dit:
- Fix duplicaten in ADVERTENTIE_TEKSTEN.md
- Test complete Stripe flow
- Maak pricing page
```

---

## 🎯 Recommended Order (haalbaarheid)

**DEZE WEEK:**
1. Opschonen ADVERTENTIE_TEKSTEN.md (30 min)
2. Test Stripe flow compleet (15 min)
3. Pricing page bouwen (1.5 uur)
4. Email templates (1 uur)

**VOLGENDE WEEK:**
5. Analytics setup (30 min)
6. FAQ + Trust badges (1 uur)
7. CSV export feature (2 uur)
8. Chat widget + support (1 uur)
