import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import { FeelbackTaggedMessage, PRESET_FEELING } from "@feelback/react";

export default function FooterWrapper(props) {
  return (
    <>
      <Footer {...props} />

      <hr />
      <FeelbackTaggedMessage contentSetId="your-content-set-id-from-panel"
        layout="inline"
        preset={PRESET_FEELING}
        title="Did this doc help you?"
      />
    </>
  );
}
