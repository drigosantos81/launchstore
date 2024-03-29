DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE DATABASE launchstore;

CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "category_id" int NOT NULL,
  "user_id" int,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "old_price" int,
  "price" int NOT NULL,
  "quantity" int DEFAULT 0,
  "status" int DEFAULT 1,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "path" text NOT NULL,
  "product_id" int
);

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "files" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "cpf_cnpj" text UNIQUE NOT NULL,
  "cep" text,
  "address" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

-- Foreign Key
ALTER TABLE "products" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

  -- Connect pg simple table
  CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL COLLATE "default",
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL
  )

  WITH (OIDS=FALSE);
  ALTER TABLE "session" 
  ADD CONSTRAINT "session_pkey" 
  PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

/* ==== DELETE CASCADE ==*/
ALTER TABLE "products"
DROP CONSTRAINT products_user_id_fkey,
ADD CONSTRAINT product_user_id_fkey
FOREIGN KEY ("user_id")
REFERENCES "users" ("id")
ON DELETE CASCADE;

ALTER TABLE "files"
DROP CONSTRAINT files_product_id_fkey,
ADD CONSTRAINT files_product_id_fkey
FOREIGN KEY ("product_id")
REFERENCES "products" ("id")
ON DELETE CASCADE;

-- Para rodar o seeds
DELETE FROM products;
DELETE FROM users;
DELETE FROM files;

-- Reiniciar a sequência do auto_increment da tabelas ids
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;

-- Tabela para salvar as vendas (pedidos)
CREATE TABLE "orders" (
	"id" SERIAL PRIMARY KEY,
  "seller_id" int NOT NULL,
  "buyer_id" int NOT NULL,
  "product_id" int NOT NULL,
  "price" int NOT NULL,
  "quantity" int DEFAULT 0,
  "total" int NOT NULL,
  "status" text NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

ALTER TABLE "orders" ADD FOREIGN KEY ("seller_id") REFERENCES "users" ("id");
ALTER TABLE "orders" ADD FOREIGN KEY ("buyer_id") REFERENCES "users" ("id");
ALTER TABLE "orders" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

-- TRIGGERS
-- Create Procedure
CREATE FUNCTION trigger_set_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END
  $$ LANGUAGE plpgsql;

-- Auto updated_at products
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Auto updated_at users
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Auto updated_at orders
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();