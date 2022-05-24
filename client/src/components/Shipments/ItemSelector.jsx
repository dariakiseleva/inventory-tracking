import React from 'react';
import "./../../styles/forms.css";
import Select from "react-dropdown-select";
import styled from '@emotion/styled';

export default function ItemSelector({availableItems, inventory, processAddItem}) {

    const clickAddItem = (item) => {
        processAddItem(item);
    }

    //Styling
    const StyledSelect = styled(Select)`
    .react-dropdown-select-dropdown {
        overflow: initial;
    }`;

    const customContentRenderer = () => (
        <div className="fancyPlaceholder">
          Click to select
        </div>
    );

    return (

        <StyledSelect
            className="fancySelector"
            options={availableItems.map(id => {return {value: id, label: inventory[id].name}})} 
            values={[]} 
            multi
            name="select"
            contentRenderer={customContentRenderer}
            onChange={(value) => clickAddItem(value[value.length-1].value)} 
        />
    )
}