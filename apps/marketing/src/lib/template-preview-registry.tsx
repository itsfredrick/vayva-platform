import React from "react";
import { AAFashionHome } from "@/components/storefront/AAFashionHome";
import { BloomeHome } from "@/components/storefront/BloomeHome";
import { CreativeMarketStore } from "@/components/storefront/CreativeMarketStore";
import { DigitalVaultStore } from "@/components/storefront/DigitalVaultStore";
import { EventTicketsPro } from "@/components/storefront/EventTicketsPro";
import { ConferencePro } from "@/components/storefront/ConferencePro";
import { RSVPMate } from "@/components/storefront/RSVPMate";
import { GizmoTechHome } from "@/components/storefront/GizmoTechHome";
import { GourmetDiningFood } from "@/components/storefront/GourmetDiningFood";
import { BrewBeanCoffee } from "@/components/storefront/BrewBeanCoffee";
import { SliceLifePizza } from "@/components/storefront/SliceLifePizza";
import { SugarRushBakery } from "@/components/storefront/SugarRushBakery";
import { GlowSalon } from "@/components/storefront/GlowSalon";
import { FitPhysique } from "@/components/storefront/FitPhysique";
import { CleanPro } from "@/components/storefront/CleanPro";
import { LensFolio } from "@/components/storefront/LensFolio";
import { SoundWave } from "@/components/storefront/SoundWave";
import { SaaSStarter } from "@/components/storefront/SaaSStarter";
import { LearnHubCourses } from "@/components/storefront/LearnHubCourses";
import { CoachLife } from "@/components/storefront/CoachLife";
import { WorkshopHub } from "@/components/storefront/WorkshopHub";
import { BulkTrade } from "@/components/storefront/BulkTrade";
import { SupplierNetwork } from "@/components/storefront/SupplierNetwork";
import { VendorHive } from "@/components/storefront/VendorHive";
import { EstatePrime } from "@/components/storefront/EstatePrime";
import { AgentPortfolio } from "@/components/storefront/AgentPortfolio";
import { GiveFlow } from "@/components/storefront/GiveFlow";
import { CharityGala } from "@/components/storefront/CharityGala";
import { ProConsultBooking } from "@/components/storefront/ProConsultBooking";
import { QuickBitesFood } from "@/components/storefront/QuickBitesFood";
import { SkillAcademyCourses } from "@/components/storefront/SkillAcademyCourses";
import { StandardRetailHome } from "@/components/storefront/StandardRetailHome";
import { WellnessBooking } from "@/components/storefront/WellnessBooking";
import { StoreShell } from "@/components/storefront/store-shell";

import { OneProductPro } from "@/components/storefront/OneProductPro";

// Map of Template IDs (from registry) to actual React Components
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
    "vayva-standard": StandardRetailHome,
    "vayva-aa-fashion": AAFashionHome,
    "vayva-bloome-home": BloomeHome,
    "vayva-gizmo-tech": GizmoTechHome,
    "vayva-bookly-pro": ProConsultBooking, // or WellnessBooking based on specific ID
    "vayva-chopnow": QuickBitesFood,
    "vayva-gourmet": GourmetDiningFood,
    "vayva-coffee": BrewBeanCoffee,
    "vayva-pizza": SliceLifePizza,
    "vayva-bakery": SugarRushBakery,
    "vayva-salon": GlowSalon,
    "vayva-fitness": FitPhysique,
    "vayva-cleaning": CleanPro,
    "vayva-lens-folio": LensFolio,
    "vayva-sound-wave": SoundWave,
    "vayva-saas-starter": SaaSStarter,
    "vayva-file-vault": DigitalVaultStore,
    "vayva-ticketly": EventTicketsPro,
    "vayva-conference": ConferencePro,
    "vayva-rsvp": RSVPMate,
    "vayva-eduflow": LearnHubCourses,
    "vayva-coach": CoachLife,
    "vayva-workshop": WorkshopHub,
    "vayva-bulktrade": BulkTrade,
    "vayva-supplier": SupplierNetwork,
    "vayva-markethub": CreativeMarketStore,
    "vayva-vendorhive": VendorHive,
    "vayva-estate": EstatePrime,
    "vayva-agent": AgentPortfolio,
    "vayva-giveflow": GiveFlow,
    "vayva-charity": CharityGala,
    "vayva-oneproduct": OneProductPro, // Updated
};

// Alternate map for "Best Match" logic if IDs don't match exactly
// (e.g. allowing users to preview alternative food templates)
export const ALTERNATE_PREVIEWS = {
    food_luxury: GourmetDiningFood,
    education_skill: SkillAcademyCourses,
    service_wellness: WellnessBooking
};

export function getTemplateComponent(templateId: string) {
    return COMPONENT_MAP[templateId] || StandardRetailHome;
}
