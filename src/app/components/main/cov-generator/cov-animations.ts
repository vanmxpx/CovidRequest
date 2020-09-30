/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
    animate,
    state,
    style,
    transition,
    trigger,
    AnimationTriggerMetadata,
} from '@angular/animations';

/**
 * Animations used by the Material tabs.
 * @docs-private
 */
export const covAnimations: {
    readonly translateTab: AnimationTriggerMetadata;
    readonly changePane: AnimationTriggerMetadata;
} = {
    /** Animation translates a tab along the X axis. */
    translateTab: trigger('translateTab', [
        // Note: transitions to `none` instead of 0, because some browsers might blur the content.
        state('center', style({ transform: 'none',  visibility: 'visible' })),

        // If the tab is either on the left or right, we additionally add a `min-height` of 1px
        // in order to ensure that the element has a height before its state changes. This is
        // necessary because Chrome does seem to skip the transition in RTL mode if the element does
        // not have a static height and is not rendered. See related issue: #9465
        state('top', style({ transform: 'translate3d(0, -100%, 0)', minHeight: '0px', visibility: 'hidden' })),
        state('bottom', style({ transform: 'translate3d(0, 100%, 0)', minHeight: '0px',  visibility: 'hidden' })),

        transition('* => *',
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)'))
    ]),
    changePane: trigger('changePane', [
        // Note: transitions to `none` instead of 0, because some browsers might blur the content.
        state('opened', style({ transform: 'none',  visibility: 'visible' })),

        // If the tab is either on the left or right, we additionally add a `min-height` of 1px
        // in order to ensure that the element has a height before its state changes. This is
        // necessary because Chrome does seem to skip the transition in RTL mode if the element does
        // not have a static height and is not rendered. See related issue: #9465
        state('closeLeft', style({ transform: 'translate3d(-100%, 0, 0)', minWidth: '0px', visibility: 'hidden' })),
        state('closeRight', style({ transform: 'translate3d(100%, 0, 0)', minWidth: '0px',  visibility: 'hidden' })),

        transition('* => *',
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)'))
    ])
};