import React, { useCallback, useState } from "react";
import Styled from "styled-components";
import PropTypes from "prop-types";
import DescriptionIcon from "@material-ui/icons/Description";

/**
 *
 * @param name : file name
 * @param owner : Repository owner
 * @ returns the file name and it's icon
 */
const Repo = ({ name, owner }) => {
  const [nodeId, setNodeId] = useState(undefined);

  const checkboxHandle = useCallback(async (e) => {
    e.preventDefault();

    let context = window.webvis.getContext("default_context");

    if (context) {

      if (typeof nodeId === "undefined") {

        const REPOSITORY_NAME = process.env.REACT_APP_REPOSITORY_NAME;
        let fileName = name.split(".");

        // adds the data to the webvis APP
        const newNodeId = await context.add({
          label: fileName[0],
          dataURI: `urn:github:3d-data:${owner}:${REPOSITORY_NAME}:${fileName[0]}:${fileName[1]}`,
        });
        setNodeId(newNodeId);
        context.setProperty(newNodeId, "enabled", true);
      } else {
        setNodeId(undefined);
        await context.remove(nodeId);
      }
    }
  }, [nodeId, name, owner]);

  return (
    <Wrapper>
      <AddRemoveBtn>
        <input type="radio" id="fileUrn" name="repo.name" />
        <span
          id={"checkmark"}
          className={typeof nodeId === "undefined" ? "checkmark" : "checkmarks"}
          onClick={checkboxHandle}
        ></span>
      </AddRemoveBtn>
      <span className={"file-icon"}>
        <DescriptionIcon />
      </span>
      <span className={"file-name"}>{name}</span>
    </Wrapper>
  );
};

export default Repo;

const Wrapper = Styled.div`
  padding-left: 27px;
  margin-left: 5px;
  >span:nth-child(3){
    color: white;
  }
`;
const AddRemoveBtn = Styled.label`
  
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
 

> input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}


/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 5px;
  left: -30px;
  border: 2px solid lightgrey;
  background-color: #fff;
  font-size: 12px;
  height: 1.5em;
  width: 1.5em;
  border-radius: 999px;
}
 .checkmarks {
  position: absolute;
  top: 5px;
  left: -30px;
  border: 2px solid lightgrey;
  background-color: #fff;
  font-size: 12px;
  height: 1.5em;
  width: 1.5em;
  border-radius: 999px;
}
.checkmark:after,
.checkmark:before  {
    content: '';
    display: block;
    background-color: grey;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .checkmarks:after,
.checkmarks:before {
    content: '';
    display: block;
    background-color: grey;
    position: absolute;
    top: 20%;
    left: 45%;
    transform: rotate(90deg);

  }
  .checkmark:before  {
    height: 1em;
    width: 0.2em;
  }
  .checkmarks:before {
    height: 1em;
    width: 0.2em;
  }

  .checkmark:after  {
    height: 0.2em;
    width: 1em;
  }
 `;
Repo.propTypes = {
  name: PropTypes.string.isRequired,
};
