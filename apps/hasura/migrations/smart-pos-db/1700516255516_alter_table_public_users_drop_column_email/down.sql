alter table "public"."users" add constraint "users_email_key" unique (email);
alter table "public"."users" alter column "email" drop not null;
alter table "public"."users" add column "email" text;
