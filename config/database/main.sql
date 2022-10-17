/*
 Navicat Premium Data Transfer

 Source Server         : Nestjs Monolith
 Source Server Type    : SQLite
 Source Server Version : 3030001
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3030001
 File Encoding         : 65001

 Date: 17/10/2022 21:30:42
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for auth
-- ----------------------------
DROP TABLE IF EXISTS "auth";
CREATE TABLE "auth" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "user_id" integer NOT NULL,
  "token" varchar NOT NULL,
  "refresh_token" varchar NOT NULL,
  "created_date" datetime,
  "modified_date" datetime,
  "is_deleted" boolean NOT NULL DEFAULT (0)
);

-- ----------------------------
-- Records of auth
-- ----------------------------

-- ----------------------------
-- Table structure for ref_permissions
-- ----------------------------
DROP TABLE IF EXISTS "ref_permissions";
CREATE TABLE "ref_permissions" (
  "id" INTEGER NOT NULL,
  "name" TEXT,
  "created_date" TEXT,
  "modified_date" TEXT DEFAULT NULL,
  "is_deleted" integer DEFAULT 0,
  PRIMARY KEY ("id")
);

-- ----------------------------
-- Records of ref_permissions
-- ----------------------------
INSERT INTO "ref_permissions" VALUES (1, 'Admin', NULL, NULL, 0);

-- ----------------------------
-- Table structure for sqlite_sequence
-- ----------------------------
DROP TABLE IF EXISTS "sqlite_sequence";
CREATE TABLE "sqlite_sequence" (
  "name",
  "seq"
);

-- ----------------------------
-- Records of sqlite_sequence
-- ----------------------------
INSERT INTO "sqlite_sequence" VALUES ('user', 1);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS "user";
CREATE TABLE "user" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "users_group_id" integer NOT NULL,
  "name" varchar NOT NULL,
  "password" varchar NOT NULL
);

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO "user" VALUES (1, 1, 'superadmin', '$2a$10$6x81Z5jxljjGoZiPXcdEiOPKnPQEYetPxZkGOaLd/GCKXuBvwH7Vu');

-- ----------------------------
-- Table structure for user_group
-- ----------------------------
DROP TABLE IF EXISTS "user_group";
CREATE TABLE "user_group" (
  "id" INTEGER NOT NULL,
  "name" TEXT,
  "created_date" TEXT DEFAULT NULL,
  "modified_date" text DEFAULT NULL,
  "is_deleted" integer(1) DEFAULT 0,
  PRIMARY KEY ("id")
);

-- ----------------------------
-- Records of user_group
-- ----------------------------
INSERT INTO "user_group" VALUES (1, 'ADMIN', NULL, NULL, 0);

-- ----------------------------
-- Table structure for user_permissions
-- ----------------------------
DROP TABLE IF EXISTS "user_permissions";
CREATE TABLE "user_permissions" (
  "id" INTEGER NOT NULL,
  "user_group_id" INTEGER,
  "path" TEXT,
  "action" TEXT,
  "created_date" TEXT,
  "modified_date" TEXT,
  "is_active" integer,
  "permission_id" INTEGER,
  PRIMARY KEY ("id")
);

-- ----------------------------
-- Records of user_permissions
-- ----------------------------

-- ----------------------------
-- Auto increment value for user
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 1 WHERE name = 'user';

PRAGMA foreign_keys = true;
