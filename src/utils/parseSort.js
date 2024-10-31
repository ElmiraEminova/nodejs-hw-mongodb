import { SORT_ORDER } from "../constans/constans.js";

const parseSort = ({ sortBy, sortField, sortOrder }) => {
    const parseSortOrder = SORT_ORDER.includes(sortOrder) ? sortOrder : SORT_ORDER[0];
    const parseSortBy = sortField.includes(sortBy) ? sortBy : "_id";
    return {
        sortBy: parseSortBy,
        sortOrder: parseSortOrder
    };
};

export default parseSort;
