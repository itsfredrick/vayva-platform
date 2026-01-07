/**
 * STORE CONFIGURATION SERVICE
 *
 * This service manages the storefront configuration, including templates,
 * branding, navigation, and domains. It maps high-level config objects
 * to the underlying Prisma schema.
 */

import { prisma } from "@vayva/db";
import { assertFeatureEnabled } from "@/lib/env-validation";
import {
  StoreConfig,
  StoreTemplate,
  StoreBranding,
  StorePage,
  StoreNavigation,
  StorePolicy,
  StoreDomain,
} from "@/types/control-center";
import { getNormalizedTemplates } from "@/lib/templates-registry";

/**
 * Fetches the complete configuration for a store.
 * Maps settings JSON and relations to a StoreConfig object.
 */
async function getStoreConfig(storeId: string): Promise<StoreConfig | null> {
  assertFeatureEnabled("CONTROL_CENTER_ENABLED");

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: {
      storeTemplateSelection: true,
      domainMapping: { take: 1 },
      merchantPolicies: true,
    },
  }) as any;

  if (!store) return null;

  const settings = (store.settings as any) || {};
  const templateSelection = store.storeTemplateSelection;

  return {
    templateId: templateSelection?.templateId || "default",
    branding: {
      storeName: store.name,
      logoUrl: store.logoUrl || undefined,
      accentColor: settings.brandColor || "#000000",
      fontHeading: settings.fontHeading || "Inter",
      fontBody: settings.fontBody || "Inter",
    },
    pages: [], // Pages implementation pending StorefrontDraft migration
    navigation: settings.navigation || { header: [], footer: [] },
    policies: (store.merchantPolicies || []).map((p: any) => ({
      type: p.type as any,
      title: p.title,
      content: p.content,
      isEnabled: p.isEnabled,
    })),
    domains: {
      subdomain: store.slug,
      customDomain: store.domainMapping?.[0]?.domain,
      status: (store.domainMapping?.[0]?.status as any) || "active",
    },
    isPublished: store.isLive,
  };
}

/**
 * Updates the active template for a store.
 */
async function updateTemplate(storeId: string, templateId: string) {
  assertFeatureEnabled("CONTROL_CENTER_ENABLED");

  return await prisma.storeTemplateSelection.upsert({
    where: { storeId },
    create: {
      storeId,
      templateId,
      version: "1.0.0",
      config: {},
    },
    update: {
      templateId,
      appliedAt: new Date(),
    },
  });
}

/**
 * Fetches available templates from the registry.
 */
async function getTemplates(): Promise<StoreTemplate[]> {
  return getNormalizedTemplates() as any;
}

/**
 * Updates store branding and visual settings.
 */
async function updateBranding(storeId: string, branding: Partial<StoreBranding>) {
  assertFeatureEnabled("CONTROL_CENTER_ENABLED");

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: { settings: true },
  });

  if (!store) throw new Error("Store not found");

  const currentSettings = (store.settings as any) || {};

  return await prisma.store.update({
    where: { id: storeId },
    data: {
      name: branding.storeName,
      logoUrl: branding.logoUrl,
      settings: {
        ...currentSettings,
        brandColor: branding.accentColor || currentSettings.brandColor,
        fontHeading: branding.fontHeading || currentSettings.fontHeading,
        fontBody: branding.fontBody || currentSettings.fontBody,
      },
    },
  });
}

export const ControlCenterService = {
  getStoreConfig,
  getTemplates,
  updateTemplate,
  updateBranding,
  // Pages logic will be implemented in the next phase of Storefront Builder
  getPages: async () => [],
  createPage: async () => { throw new Error("Page builder pending migration"); },
  updatePage: async () => { throw new Error("Page builder pending migration"); },
  publishStore: async (storeId: string) => {
    return await prisma.store.update({
      where: { id: storeId },
      data: { isLive: true },
    });
  },

  /**
   * Fetches the number of templates owned by the store.
   */
  getOwnedTemplateCount: async (storeId: string) => {
    return await prisma.merchantTheme.count({
      where: { storeId },
    });
  },

  /**
   * Adds a template to the store's library if limits allow.
   */
  addToLibrary: async (storeId: string, templateId: string, maxAllowed: number) => {
    assertFeatureEnabled("CONTROL_CENTER_ENABLED");

    // 1. Check if already owned
    const existing = await prisma.merchantTheme.findUnique({
      where: {
        storeId_templateId: {
          storeId,
          templateId,
        },
      },
    });

    if (existing) return existing;

    // 2. Check limits
    const count = await prisma.merchantTheme.count({ where: { storeId } });

    if (count >= maxAllowed) {
      throw new Error("PLAN_LIMIT_REACHED");
    }

    // 3. Add to library
    return await prisma.merchantTheme.create({
      data: {
        storeId,
        templateId,
        status: "DRAFT",
        config: {},
      },
    });
  },
};
