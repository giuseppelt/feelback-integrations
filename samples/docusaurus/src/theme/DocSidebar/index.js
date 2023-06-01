import React from 'react';
import DocSidebar from '@theme-original/DocSidebar';
import { FeelbackYesNo, PRESET_LIKE_DISLIKE } from "@feelback/react";

export default function DocSidebarWrapper(props) {
  return (
    <div className="feelback-sidebar" style={{ position: "relative", height: "100%" }}>
      <DocSidebar {...props} />

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "1rem" }}>
        <FeelbackYesNo contentSetId="your-content-set-id"
          textQuestion="Is this page useful?"
          preset={PRESET_LIKE_DISLIKE}
        />
      </div>
    </div>
  );
}
