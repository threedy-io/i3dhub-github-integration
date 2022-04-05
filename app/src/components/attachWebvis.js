import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

/**
 *
 * @param token : Access token returned by the Github api.
 * @ Links the webvis instance using the ScriptTag
 * and passes the authorization token to webvis to authorize the data.
 */
const AttachWebvis = ({ token }) => {
  const HUB_URL = process.env.REACT_APP_URl_HUB;
  const src = `${HUB_URL}repo/webvis/webvis.js`;
  const webvis = window.webvis;

  const passAuth = () => {
    webvis.changeSetting(webvis.SettingStrings.ADDITIONAL_REQUEST_HEADERS, {
      Authorization: `Bearer ${token}`,
    });
  };

  useEffect(() => {
    if (webvis !== undefined) {
      passAuth();
    }
  });

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

AttachWebvis.propTypes = {
  token: PropTypes.string.isRequired,
};

export default AttachWebvis;
