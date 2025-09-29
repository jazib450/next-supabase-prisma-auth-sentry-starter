-- 1) Enable RLS (default becomes DENY ALL)
alter table public."Conversation" enable row level security;
alter table public."Message"      enable row level security;

-- 2) Conversation policies (owner-only on userId)

-- Read own conversations
create policy "conversation_select_own"
  on public."Conversation"
  for select
  using (auth.uid() = "userId");

-- Create a conversation only as yourself
create policy "conversation_insert_own"
  on public."Conversation"
  for insert
  with check (auth.uid() = "userId");

-- Update only your conversations
create policy "conversation_update_own"
  on public."Conversation"
  for update
  using (auth.uid() = "userId")
  with check (auth.uid() = "userId");

-- Delete only your conversations
create policy "conversation_delete_own"
  on public."Conversation"
  for delete
  using (auth.uid() = "userId");

-- 3) Message policies (authorize by owning the parent Conversation)
-- Safer than relying on Message.userId because assistant/system rows should still be visible to the conversation owner.

-- Helper predicate: does the current user own this message's conversation?
-- We'll inline this with EXISTS for performance.

-- Read messages for conversations you own
create policy "message_select_via_conversation_owner"
  on public."Message"
  for select
  using (
    exists (
      select 1
      from public."Conversation" c
      where c.id = "Message"."conversationId"
        and c."userId" = auth.uid()
    )
  );

-- Insert messages only into conversations you own AND (optionally) ensure author field matches you for 'user' messages.
create policy "message_insert_via_conversation_owner"
  on public."Message"
  for insert
  with check (
    exists (
      select 1
      from public."Conversation" c
      where c.id = "Message"."conversationId"
        and c."userId" = auth.uid()
    )
    and "userId" = auth.uid()
  );

-- Update messages only within conversations you own
create policy "message_update_via_conversation_owner"
  on public."Message"
  for update
  using (
    exists (
      select 1
      from public."Conversation" c
      where c.id = "Message"."conversationId"
        and c."userId" = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public."Conversation" c
      where c.id = "Message"."conversationId"
        and c."userId" = auth.uid()
    )
  );

-- Delete messages only within conversations you own
create policy "message_delete_via_conversation_owner"
  on public."Message"
  for delete
  using (
    exists (
      select 1
      from public."Conversation" c
      where c.id = "Message"."conversationId"
        and c."userId" = auth.uid()
    )
  );

-- 4) Lock down Prisma migrations table (defense-in-depth)
alter table public."_prisma_migrations" enable row level security;
create policy "_prisma_migrations_deny_all"
  on public."_prisma_migrations" for all
  using (false) with check (false);