import React from 'react';
import { FeelbackPulse, PRESET_PULSE_HEART, FeelbackReaction, PRESET_GITHUB_EMOJI, FeelbackMessage, FeelbackTaggedMessage, PRESET_FEEDBACK, PRESET_LIKE_DISLIKE } from "@feelback/react";

export function FeelbackShowcase() {
  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: "column", gap: "42px", alignItems: "center", padding: "32px" }}>
      <h2>Feelback Showcase</h2>

      <div>
        <h4>Pulse</h4>
        <FeelbackPulse preset={PRESET_PULSE_HEART} showCount contentSetId="597f4543-e697-4c10-844b-c9ad33a2c524" />
      </div>

      <div>
        <h4>Emoji reactions</h4>
        <FeelbackReaction layout="picker" preset={PRESET_GITHUB_EMOJI} showCount contentSetId="cf0bdc41-4db8-4ddd-95cf-400b971d5169" />
      </div>

      <div>
        <h4>Simple message</h4>
        <FeelbackMessage layout="button-dialog" contentSetId="6a5c1dfb-ef88-4b16-ab6d-d91e9a69fee1" />
      </div>

      <div>
        <h4>Tagged message</h4>
        <FeelbackTaggedMessage layout="button-dialog" preset={PRESET_FEEDBACK} contentSetId="51ed5897-9a89-4570-ae41-e6610ba2fbe1" />
      </div>

      <div className="github-like">
        <h4>Github-like feedback</h4>
        <FeelbackTaggedMessage contentSetId="51ed5897-9a89-4570-ae41-e6610ba2fbe1"
          title="Was this page useful?"
          layout="reveal-message"
          preset={PRESET_LIKE_DISLIKE}
          withEmail
          placeholder={false}
          placeholderEmail={false}
          slots={{
            BeforeMessage:
              <div className="small-text mt-2">
                <b>Let us know the details</b>
                <span className="float-right">optional</span>
              </div>,
            BeforeEmail:
              <div className="small-text mt-2">
                <b>If we can contact you with more questions, please enter your email address</b>
                <span className="float-right">optional</span>
              </div>,
            BeforeFormButtons: <div className="small-text mt-2">If you need a reply, please contact support instead.</div>
          }}
        />
      </div>
    </div>
  );
}
