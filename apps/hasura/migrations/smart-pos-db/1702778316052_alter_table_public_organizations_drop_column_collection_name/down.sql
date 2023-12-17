alter table "public"."organizations" add constraint "organizations_collection_name_key" unique (collection_name);
alter table "public"."organizations" alter column "collection_name" drop not null;
alter table "public"."organizations" add column "collection_name" text;
