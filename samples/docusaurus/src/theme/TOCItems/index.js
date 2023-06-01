import React from 'react';
import TOCItems from '@theme-original/TOCItems';
import { FeelbackTaggedMessage, PRESET_FEEDBACK } from "@feelback/react";


export default function TOCItemsWrapper(props) {
  return (
    <>
      <TOCItems {...props} />

      <div style={{ padding: "0 16px" }}>
        <FeelbackTaggedMessage contentSetId="your-content-set-id-from-panel"
          layout="button-dialog"
          preset={PRESET_FEEDBACK}
        />
      </div>
    </>
  );
}
