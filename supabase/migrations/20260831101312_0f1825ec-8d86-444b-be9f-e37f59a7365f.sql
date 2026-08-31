revoke all on function public.update_updated_at_column() from anon, authenticated;
revoke all on function public.has_role(uuid, public.app_role) from anon;
revoke all on function public.claim_first_admin() from anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;