-- Fix for Storefront 406 Error (Missing RLS Policy)
-- This policy allows public (anon) users to fetch store details by ID/Slug
-- Required for the Storefront to load theme configuration and metadata

-- 1. Drop existing policy if it exists to avoid conflicts
drop policy if exists "Enable read access for all users" on "public"."stores";

-- 2. Create the permissive policy for public read access
create policy "Enable read access for all users"
on "public"."stores"
as permissive
for select
to public
using (true);
