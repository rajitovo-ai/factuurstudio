-- Migration: Add database indices for performance optimization
-- These indices speed up the most common queries in the application

-- =============================================================================
-- APP_INVOICES indices
-- =============================================================================

-- Index for filtering invoices by user (most common query)
create index if not exists idx_app_invoices_user_id 
  on public.app_invoices (user_id);

-- Index for filtering by status (dashboard queries)
create index if not exists idx_app_invoices_user_status 
  on public.app_invoices (user_id, status);

-- Index for date range queries (reports, exports)
create index if not exists idx_app_invoices_user_issue_date 
  on public.app_invoices (user_id, issue_date desc);

-- Index for due date queries (overdue detection)
create index if not exists idx_app_invoices_due_date 
  on public.app_invoices (due_date) 
  where has_due_date = true;

-- =============================================================================
-- CUSTOMERS indices
-- =============================================================================

-- Index for fetching customers by user
create index if not exists idx_customers_user_id 
  on public.customers (user_id);

-- Index for searching customers by name
create index if not exists idx_customers_name 
  on public.customers (name);

-- Index for company name search
create index if not exists idx_customers_company 
  on public.customers (company_name) 
  where company_name is not null;

-- =============================================================================
-- PROFILES indices
-- =============================================================================

-- Index for profile lookups by user
create index if not exists idx_profiles_user_lookup 
  on public.profiles (id);

-- =============================================================================
-- SUBSCRIPTIONS indices
-- =============================================================================

-- Index for plan lookups (billing queries)
create index if not exists idx_subscriptions_plan 
  on public.subscriptions (plan) 
  where plan = 'pro';

-- Index for stripe status queries
create index if not exists idx_subscriptions_stripe_status 
  on public.subscriptions (stripe_status);

-- =============================================================================
-- SUPPORT_TICKETS indices
-- =============================================================================

-- Index for user's own tickets
create index if not exists idx_support_tickets_user_id 
  on public.support_tickets (user_id);

-- Index for admin ticket filtering by status
create index if not exists idx_support_tickets_status_created 
  on public.support_tickets (status, created_at desc);

-- =============================================================================
-- REFERRALS indices
-- =============================================================================

-- Index for referral lookups
create index if not exists idx_referrals_referrer_id 
  on public.referrals (referrer_id);

-- =============================================================================
-- ANALYTICS & MAINTENANCE
-- =============================================================================

-- Add comments for documentation
comment on index idx_app_invoices_user_id is 'Speeds up invoice list loading';
comment on index idx_app_invoices_user_status is 'Speeds up dashboard status counts';
comment on index idx_customers_user_id is 'Speeds up customer list loading';
comment on index idx_support_tickets_user_id is 'Speeds up support ticket history';
comment on index idx_subscriptions_plan is 'Speeds up pro user queries';
