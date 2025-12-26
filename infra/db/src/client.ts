import { PrismaClient, Prisma } from '@prisma/client';

// Values: Re-export the Prisma namespace and common enums explicitly to satisfy Turbopack (Next.js 16)
// Turbopack cannot statically analyze 'export *' from the CommonJS @prisma/client module.
export {
    PrismaClient,
    Prisma,

    // Core Enums from schema.prisma
    AiActionStatus,
    ApiKeyStatus,
    AppRole,
    ApprovalStatus,
    BillingProvider,
    CampaignChannel,
    CampaignSendStatus,
    CampaignStatus,
    CampaignType,
    Channel,
    ChecklistCategory,
    ChecklistStatus,
    ConsentChannel,
    ConsentEventType,
    ConsentSource,
    ConsentStatus,
    ConsentType,
    CouponStatus,
    DLQStatus,
    DataRequestStatus,
    DataRequestType,
    DeliveryTaskStatus,
    DeviceStatus,
    DeviceType,
    Direction,
    DiscountAppliesTo,
    DiscountType,
    DisputeEvidenceType,
    DisputeProvider,
    DisputeStatus,
    EnforcementActionType,
    EnforcementScope,
    EvidenceFileType,
    EvidenceScope,
    FlagSeverity,
    FulfillmentStatus,
    IdempotencyStatus,
    InvoiceStatus,
    JobRunStatus,
    KycStatus,
    LegalKey,
    ListingStatus,
    MediaType,
    MessageIntent,
    MessageStatus,
    MessageType,
    MetricPeriod,
    MigrationStatus,
    OnboardingStatus,
    OrderStatus,
    OutboxEventStatus,
    PaymentStatus,
    PolicyStatus,
    PolicyType,
    ReportEntityType,
    ReportReason,
    ReportStatus,
    RestockAction,
    ReturnCondition,
    ReturnMethod,
    ReturnReason,
    ReturnResolution,
    ReturnStatus,
    ReviewStatus,
    RiskScope,
    RiskSeverity,
    RiskStatus,
    SubscriptionPlan,
    SubscriptionStatus,
    SupportCaseCategory,
    SupportCaseStatus,
    ThemeCategory,
    ThemeLicenseType,
    ThemeStatus,
    VirtualAccountStatus,
    WebhookDeliveryStatus,
    WebhookEndpointStatus
} from '@prisma/client';

// Types: Wildcard export for all generated types (models, inputs, etc.)
// Types are erased at build time and do not trigger Turbopack's CJS export errors.
export type * from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
