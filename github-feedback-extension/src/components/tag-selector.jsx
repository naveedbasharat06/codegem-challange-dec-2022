import styled from "@emotion/styled";
import React from "react";
import {Chip} from "./chip";

const TagWrapper = styled.div`
  display: flex;
  width: 75%;
  margin: 10px 0;
  flex-wrap: wrap;

  ${Chip} {
    margin: 5px 5px;
  }
`;

export const TagSelector = ({selected, onTagClicked, onTagRemoved, ...rest}) => {
    let dismissOverride = "dismissOverride" in rest;

    return (
        <TagWrapper>
            {selected && selected.map(tag =>
                <Chip key={tag.id}
                      onDismiss={() => onTagRemoved(tag)}
                      dismissible={dismissOverride ? rest.dismissOverride : tag.dismissible}
                      onClick={() => onTagClicked && onTagClicked(tag)}
                      active={!!tag.active}>
                    {tag.tag_name}
                </Chip>)}
        </TagWrapper>
    );
};
