import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  geometry,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// --- ENUMS ---

export const communityVisibilityEnum = pgEnum("community_visibility", [
  "PUBLIC",
  "PRIVATE",
]);

export const communityRoleEnum = pgEnum("community_role", [
  "OWNER",
  "ADMIN",
  "MEMBER",
]);

export const initiativeTypeEnum = pgEnum("initiative_type", [
  "CROWDFUNDING",
  "WHOLESALE",
]);

export const initiativeStatusEnum = pgEnum("initiative_status", [
  "ACTIVE",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
  "PROCESSING",
]);

// --- TABLES ---
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const communities = pgTable(
  "communities",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),
    title: text("title").notNull(),
    description: text("description").notNull(),
    visibility: communityVisibilityEnum("visibility")
      .default("PUBLIC")
      .notNull(),
    avatarUrl: text("avatar_url"),
    coverUrl: text("cover_url"),
    address: text("address"),
    location: geometry("location", { type: "point", mode: "xy", srid: 4326 }),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("communities_owner_id_idx").on(t.ownerId),
    index("communities_location_gist_idx").using("gist", t.location),
  ],
);

export const initiatives = pgTable(
  "initiatives",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),
    communityId: uuid("community_id")
      .notNull()
      .references(() => communities.id, { onDelete: "cascade" }),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    type: initiativeTypeEnum("type").notNull(),
    status: initiativeStatusEnum("status").default("ACTIVE").notNull(),
    deadline: timestamp("deadline", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("initiatives_community_id_status_idx").on(t.communityId, t.status),
    index("initiatives_status_deadline_idx").on(t.status, t.deadline),
    index("initiatives_created_by_user_id_idx").on(t.createdByUserId),
  ],
);

export const crowdfundingInitiatives = pgTable(
  "crowdfunding_initiatives",
  {
    initiativeId: uuid("initiative_id")
      .primaryKey()
      .references(() => initiatives.id, { onDelete: "cascade" }),
    targetAmount: bigint("target_amount", { mode: "number" }).notNull(),
    minContribution: integer("min_contribution").notNull(),
    maxContribution: integer("max_contribution").notNull(),
  },
  (t) => [
    check("target_amount_positive_check", sql`${t.targetAmount} > 0`),
    check(
      "contribution_range_check",
      sql`${t.minContribution} <= ${t.maxContribution} AND ${t.minContribution} > 0`,
    ),
  ],
);

export const wholesaleInitiatives = pgTable(
  "wholesale_initiatives",
  {
    initiativeId: uuid("initiative_id")
      .primaryKey()
      .references(() => initiatives.id, { onDelete: "cascade" }),
    wholesaleMaxQuantity: integer("wholesale_max_quantity").notNull(),
    wholesaleTiers: jsonb("wholesale_tiers")
      .$type<Array<{ minQuantity: number; price: number }>>()
      .notNull(),
  },
  (t) => [
    check(
      "wholesale_max_qty_positive_check",
      sql`${t.wholesaleMaxQuantity} > 0`,
    ),
  ],
);

export const memberships = pgTable(
  "memberships",
  {
    communityId: uuid("community_id")
      .notNull()
      .references(() => communities.id, { onDelete: "cascade" }),
    memberId: text("member_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: communityRoleEnum("role").default("MEMBER").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    primaryKey({ columns: [t.communityId, t.memberId] }),
    index("memberships_member_id_idx").on(t.memberId),
  ],
);

// --- DRIZZLE RELATIONS ---

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  memberships: many(memberships),
  ownedCommunities: many(communities, { relationName: "community_owner" }),
  createdInitiatives: many(initiatives, { relationName: "initiative_creator" }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const communitiesRelations = relations(communities, ({ one, many }) => ({
  owner: one(user, {
    fields: [communities.ownerId],
    references: [user.id],
    relationName: "community_owner",
  }),
  memberships: many(memberships),
  initiatives: many(initiatives),
}));

export const initiativesRelations = relations(initiatives, ({ one }) => ({
  community: one(communities, {
    fields: [initiatives.communityId],
    references: [communities.id],
  }),
  createdBy: one(user, {
    fields: [initiatives.createdByUserId],
    references: [user.id],
    relationName: "initiative_creator",
  }),
  crowdfundingInitiative: one(crowdfundingInitiatives),
  wholesaleInitiative: one(wholesaleInitiatives),
}));

export const crowdfundingInitiativesRelations = relations(
  crowdfundingInitiatives,
  ({ one }) => ({
    initiative: one(initiatives, {
      fields: [crowdfundingInitiatives.initiativeId],
      references: [initiatives.id],
    }),
  }),
);

export const wholesaleInitiativesRelations = relations(
  wholesaleInitiatives,
  ({ one }) => ({
    initiative: one(initiatives, {
      fields: [wholesaleInitiatives.initiativeId],
      references: [initiatives.id],
    }),
  }),
);

export const membershipsRelations = relations(memberships, ({ one }) => ({
  community: one(communities, {
    fields: [memberships.communityId],
    references: [communities.id],
  }),
  member: one(user, {
    fields: [memberships.memberId],
    references: [user.id],
  }),
}));
