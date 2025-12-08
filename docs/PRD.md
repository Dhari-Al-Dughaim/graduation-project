# Project Requirements & Design Plan (RDP)

## 1. Project Overview

### 1.1 Project Title
**AI-Assisted Restaurant Order & Tracking System via Web + WhatsApp (Arabic + English)**

### 1.2 Purpose
Build a **Laravel + Inertia + React + MySQL** system enabling customers to browse meals, order, pay through a simulated gateway, and track delivery via WhatsApp, with full Arabic/English support.

### 1.3 Scope
Includes: customer workflow, admin dashboard, WhatsApp integration, fake Upayment payment, tracking system, seeders, models, full-stack implementation.

---

## 2. Technology Stack
- **Backend**: Laravel, MySQL, Eloquent, HTTP Client
- **Frontend**: Inertia.js, React.js, Redux Toolkit, TailwindCSS, shadcn/ui
- **Integrations**: UltraMsg (WhatsApp), Upayment (fake payment simulation)
- **Localization**: Laravel localization (lang files/resources), Inertia shared locale, i18n-friendly UI components

---

## 3. System Actors
- Customer
- Admin
- System Integrations (WhatsApp bot, fake payments)

---

## 4. High-Level Workflows
### 4.1 Customer Web Journey
Home → Cart → Checkout → Payment → Success/Failure → Tracking → Rating

### 4.2 WhatsApp Workflow
User queries bot:
- STATUS <orderNumber>
- ETA <orderNumber>
- TRACK <orderNumber>
- RATE <orderNumber> <1–5>

System pushes updates automatically.

---

## 5. Functional Requirements

### 5.1 Customer-Side Web Pages
- HomePage (meals listing) — bilingual content
- Cart Page (RTK-managed)
- Checkout Page
- Payment Page (simulated)
- Order Success / Failure pages
- Order Tracking page
- Global language switcher (top right) on customer layout; persists selection per user/session and updates Inertia locale

### 5.2 Admin Panel
- Login
- Order list page
- Order detail page
- Status update actions (trigger WhatsApp messages)
- Language switcher (top right) in admin layout; applies to backend validation messages and UI labels

### 5.3 WhatsApp Integration
Webhook for incoming messages  
Outgoing messages for:
- Invoice
- Status update
- ETA
- Rating request

---

## 6. Database Schema
**Tables Included**:
customers, meals, orders, order_items, payments, ratings, delivery_trackings, whatsapp_messages (optional log), admins

Multi-language fields: meals, categories (if added), and other user-facing content should have Arabic and English fields or translatable columns/JSON; factories/seeders must populate both.

---

## 7. Backend Architecture
Controllers:
- HomeController, CheckoutController, PaymentController, OrderTrackingController
- Admin\OrderController
- Webhook\WhatsappWebhookController

Services:
- WhatsAppNotificationService
- PaymentService

Localization:
- Localization middleware and locale resolver (query param, user preference, or session) powering Inertia shared props.
- Validation requests and responses return Arabic/English messages based on active locale.
- Resources/DTOs expose bilingual fields when needed; avoid mixing locales in a single response.

---

## 8. Frontend Architecture (React + Inertia + RTK)
- Pages stored in `/resources/js/Pages`
- Redux slices:
  - cartSlice, orderSlice, mealsSlice, userSlice, uiSlice
- Inertia shared props via middleware (includes locale and translations bundle for current locale)
- Language switcher component lives in shared layout (top right) and syncs locale to backend via Inertia visit; persists choice.
- UI copy sourced from translation files/hooks; avoid hardcoded strings in components.

---

## 9. UI/UX (Tailwind + shadcn)
- Component-driven clean interface for both customer and admin.
- Bidirectional support: layouts/styles account for RTL when Arabic is active (e.g., `dir="rtl"` toggle, logical padding/margin utilities).
- Ensure shadcn components render correctly in both LTR/RTL; verify focus/keyboard flows in both locales.

---

## 10. Seeders & Factories
Meaningful fake data for meals, customers, orders, ratings, admin.
- Seeders/factories must populate Arabic and English copies of user-facing strings (meal names/descriptions, categories, addresses where shown).
- Default admin/user locale seeded for testing; cover both locales in sample data.

---

## 11. Non-Functional Requirements
- Performance, security, usability, reliability.
- Localization completeness: all pages, forms, validation errors, notifications, and WhatsApp templates have Arabic/English text; fallback to default locale only if missing.

---

## 12. Testing
- Feature tests for workflows (cover both locales where applicable, especially validation and Inertia props).
- Unit tests for integrations
- Snapshot/DOM assertions ensure language switcher toggles texts/RTL state.

---

## 13. Risks & Constraints
WhatsApp sandbox dependency  
Fake payment must be clearly documented

---

## 14. Future Enhancements
Real driver tracking, promotions, dashboards, deeper localization tooling (e.g., per-user language preferences stored in profile, content translation management UI).

---
