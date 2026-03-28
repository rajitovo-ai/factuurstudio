-- Migration: Add secure admin plan mutation RPC
-- This replaces the client-side vulnerable setUserPlan function

-- Drop existing function if it exists (to avoid parameter name conflicts)
drop function if exists public.admin_set_user_plan(uuid, text);

create or replace function public.admin_set_user_plan(
  target_user_id uuid,
  new_plan text
)
returns void
language plpgsql
security definer
as $$
declare
  caller_email text;
  admin_emails text[];
begin
  -- Get the caller's email from JWT claims
  caller_email := auth.email();
  
  -- Get admin emails from environment variable (set via Supabase dashboard)
  -- Format: comma-separated list
  admin_emails := string_to_array(coalesce(current_setting('app.settings.admin_emails', true), ''), ',');
  
  -- Check if caller is admin
  if not (caller_email = any(admin_emails)) then
    raise exception 'Unauthorized: only admins can change user plans';
  end if;
  
  -- Validate plan value
  if new_plan not in ('free', 'pro') then
    raise exception 'Invalid plan: must be "free" or "pro"';
  end if;
  
  -- Update the subscription
  insert into public.subscriptions (user_id, plan, updated_at)
  values (target_user_id, new_plan, now())
  on conflict (user_id) 
  do update set 
    plan = new_plan,
    updated_at = now();
    
end;
$$;

-- Grant execute permission to authenticated users
-- The function itself checks admin status internally
grant execute on function public.admin_set_user_plan(uuid, text) to authenticated;

-- Add comment for documentation
comment on function public.admin_set_user_plan(uuid, text) is 
  'Admin-only function to set a user plan. Requires the caller to be in the admin_emails list.';
