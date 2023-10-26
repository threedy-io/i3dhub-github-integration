import React from "react";
import { Helmet } from "react-helmet";

/**
 *
 *
 * @ Links the webvis instance using the ScriptTag
 *
 */
const AttachWebvis = () => {
  const HUB_URL = process.env.REACT_APP_URl_HUB;
  const src = `${HUB_URL}repo/webvis/webvis.js?next`;

  return (
    <Helmet>
      <script
        type="text/javascript"
        id="webvisjs"
        src={src}
        async={true}
      ></script>
    </Helmet>
  );
};

export default AttachWebvis;
