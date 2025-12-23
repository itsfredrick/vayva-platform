/**
 * Vayva Education Package
 * 
 * Template-driven in-app education with contextual guidance.
 */

// State management
export { EducationStateManager, StateTransitions } from './state';
export type { EducationState, UserEducationRecord, GuidanceEligibility } from './state';

// Activation adapter
export { ActivationAdapter, EducationProgression } from './activation-adapter';
export type { GuidanceLevel, ActivationAwareGuidance } from './activation-adapter';

// Registry
export {
    EducationRegistry,
    getTemplateEducation,
    getWorkflowGuidance,
    getEmptyStateGuidance,
    getFirstActionHint,
    getWorkflowStallNudge,
    getExplanation,
} from './registry';
export type { EducationMap } from './registry';

// Template maps
export { RetailSellingEducation } from './templates/retail-selling';
export { SoloServicesEducation } from './templates/solo-services';
