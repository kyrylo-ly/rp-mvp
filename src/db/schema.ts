import { relations, sql } from "drizzle-orm";
import {
  bigint,
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
    ownerId: text("owner_id").notNull(),
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
    createdByUserId: text("created_by_user_id").notNull(),
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
    memberId: text("member_id").notNull(),
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

export const communitiesRelations = relations(communities, ({ many }) => ({
  memberships: many(memberships),
  initiatives: many(initiatives),
}));

export const initiativesRelations = relations(initiatives, ({ one }) => ({
  community: one(communities, {
    fields: [initiatives.communityId],
    references: [communities.id],
  }),
  crowdfundingInitiative: one(crowdfundingInitiatives, {
    fields: [initiatives.id],
    references: [crowdfundingInitiatives.initiativeId],
  }),
  wholesaleInitiative: one(wholesaleInitiatives, {
    fields: [initiatives.id],
    references: [wholesaleInitiatives.initiativeId],
  }),
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
}));
