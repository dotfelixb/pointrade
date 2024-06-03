--CREATE DATABASE pointtrade;

CREATE SCHEMA trade;

CREATE TABLE IF NOT EXISTS trade.users
(
	id TEXT PRIMARY KEY,
	username TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL, 
	email TEXT NOT NULL UNIQUE,
	emailconfirmed bool DEFAULT FALSE,
	lockedout bool DEFAULT FALSE,
	deleted bool DEFAULT FALSE,
	createdby TEXT NOT NULL,
	createdat timestamptz NULL DEFAULT now(),
	updatedby TEXT,
	updatedat timestamptz NULL
);


CREATE TABLE IF NOT EXISTS trade.users_audit
(
	id TEXT PRIMARY KEY,
	userid TEXT NOT NULL,
	auditaction TEXT NOT NULL,
	auditdata jsonb,	
	createdby TEXT NOT NULL,
	createdat timestamptz NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trade.currency
(
	id TEXT PRIMARY KEY,
	code TEXT NOT NULL,
	symbol TEXT,
	deleted bool DEFAULT FALSE,
	createdby TEXT NOT NULL,
	createdat timestamptz NULL DEFAULT now(),
	updatedby TEXT,
	updatedat timestamptz NULL
);

INSERT INTO trade.currency (id, code, symbol, createdby)
VALUES ('dollar', 'USD', '$', 'system'),
	('pound', 'GBP', '£', 'system'),
 	('euro', 'EUR', '€', 'system'),
 	('cedi', 'GHS', '₵', 'system');


CREATE TABLE IF NOT EXISTS trade.rates
(
	id SERIAL PRIMARY KEY,
	currencyid TEXT NOT NULL,
	baserate float,
	deleted bool DEFAULT FALSE,
	createdby TEXT NOT NULL,
	createdat timestamptz NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trade.wallets
(
	userid TEXT NOT NULL,
	currencyid TEXT NOT NULL,
	balance NUMERIC DEFAULT 0.0,
	balanceat timestamptz DEFAULT now(),
	deleted bool DEFAULT FALSE,
	createdby TEXT NOT NULL,
	createdat timestamptz NULL DEFAULT now(),
	updatedby TEXT,
	updatedat timestamptz NULL,
	CONSTRAINT wallets_user_currency UNIQUE (userid, currencyid)
);


CREATE TABLE IF NOT EXISTS trade.wallet_audit
(
	id TEXT PRIMARY KEY,
	userid TEXT NOT NULL,
	currencyid TEXT NOT NULL,
	auditaction TEXT NOT NULL,
	auditdata jsonb,	
	createdby TEXT NOT NULL,
	createdat timestamptz NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS  trade.transactions
(
	id TEXT PRIMARY KEY,
	issuerid TEXT NOT NULL,
	issueeid TEXT NOT NULL,
	issuercurrencyid TEXT NOT NULL,
	issueecurrencyid TEXT NOT NULL,
	issuedkey TEXT NOT NULL UNIQUE,
	rate float,
	amount NUMERIC NOT NULL,
	processed bool DEFAULT FALSE,
	deleted bool DEFAULT FALSE,
	createdby TEXT NOT NULL,
	createdat timestamptz NULL DEFAULT now(),
	updatedby TEXT,
	updatedat timestamptz NULL
);

CREATE TABLE IF NOT EXISTS trade.transaction_legs
(
	id bigserial PRIMARY KEY,
	transactionid TEXT NOT NULL,
	userid TEXT NOT NULL,
	currencyid TEXT NOT NULL,
	amount NUMERIC NOT NULL,
	leg TEXT NOT NULL,
	createdby TEXT NOT NULL,
	createdat timestamptz NULL DEFAULT now(),
	updatedby TEXT,
	updatedat timestamptz NULL
);

CREATE TABLE IF NOT EXISTS trade.transactions_audit
(
	id TEXT PRIMARY KEY,
	transactionid TEXT NOT NULL,
	auditaction TEXT NOT NULL,
	auditdata jsonb,	
	createdby TEXT NOT NULL,
	createdat timestamptz NULL DEFAULT now()
);
