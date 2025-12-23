'use client';

import { useState, useEffect } from 'react';
import { EducationStateManager, GuidanceEligibility } from '@vayva/education/state';

export function useEducation(userId: string, guidanceId: string) {
    const [eligibility, setEligibility] = useState<GuidanceEligibility>({
        shouldShow: false,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkEligibility();
    }, [userId, guidanceId]);

    const checkEligibility = async () => {
        try {
            const result = await EducationStateManager.checkEligibility(userId, guidanceId);
            setEligibility(result);
        } catch (error) {
            console.error('Failed to check education eligibility:', error);
        } finally {
            setLoading(false);
        }
    };

    const markShown = async () => {
        await EducationStateManager.markShown(userId, guidanceId);
        setEligibility({ shouldShow: false, reason: 'already_shown' });
    };

    const markCompleted = async () => {
        await EducationStateManager.markCompleted(userId, guidanceId);
        setEligibility({ shouldShow: false, reason: 'completed' });
    };

    const dismiss = async () => {
        await EducationStateManager.dismiss(userId, guidanceId);
        setEligibility({ shouldShow: false, reason: 'dismissed' });
    };

    return {
        shouldShow: eligibility.shouldShow,
        loading,
        markShown,
        markCompleted,
        dismiss,
    };
}
