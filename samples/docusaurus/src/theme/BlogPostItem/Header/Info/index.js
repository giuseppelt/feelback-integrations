import React from 'react';
import Info from '@theme-original/BlogPostItem/Header/Info';
import { FeelbackPulse, PRESET_PULSE_HEART } from "@feelback/react";


export default function InfoWrapper(props) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Info {...props} />
      <div style={{ marginLeft: "0.4em" }}>
        <FeelbackPulse preset={PRESET_PULSE_HEART} contentSetId="7cd3d541-35e9-44f5-b3c4-b847226c3c32" showCount />
      </div>
    </div>
  )
}
