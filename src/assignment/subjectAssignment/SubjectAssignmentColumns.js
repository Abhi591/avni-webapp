import { split, map, groupBy, forEach, isEmpty, isNil } from "lodash";
import { getSyncAttributes } from "../reducers/SubjectAssignmentReducer";
import React from "react";
import Chip from "@material-ui/core/Chip";

export const getColumns = (metadata, filterCriteria) => {
  const { syncAttribute1, syncAttribute2 } = getSyncAttributes(metadata, filterCriteria);
  const fixedColumns = [
    {
      title: "Name",
      render: row => (
        <a href={`/#/app/subject?uuid=${row.uuid}`} target="_blank" rel="noopener noreferrer">
          {row.fullName}
        </a>
      )
    },
    {
      title: "Address",
      field: "addressLevel"
    },
    {
      title: "Programs",
      render: row => getFormattedPrograms(row.programs)
    },
    {
      title: "Assignment",
      render: row => getFormattedUserAndGroups(row.assignedTo)
    }
  ];
  addSyncAttributeColumnIfRequired(syncAttribute1, fixedColumns);
  addSyncAttributeColumnIfRequired(syncAttribute2, fixedColumns);

  return fixedColumns;
};

const addSyncAttributeColumnIfRequired = (syncAttribute, fixedColumns) => {
  if (!isNil(syncAttribute)) {
    fixedColumns.push({
      title: syncAttribute.name,
      field: syncAttribute.name
    });
  }
};

const getFormattedPrograms = programColorString => {
  if (isEmpty(programColorString)) return "";
  const programAndColorArray = split(programColorString, ",");
  return map(programAndColorArray, (singleProgramAndColor, index) => {
    const programAndColor = split(singleProgramAndColor, ":");

    return getChip(programAndColor[0], programAndColor[1], index);
  });
};

const getFormattedUserAndGroups = (userGroupString = "") => {
  if (isEmpty(userGroupString)) return "";
  const userGroupArray = map(split(userGroupString, ", "), ug => {
    const userAndGroup = split(ug, ":");
    return { user: userAndGroup[0], group: userAndGroup[1] };
  });
  const results = [];
  forEach(groupBy(userGroupArray, "user"), (v, k) =>
    results.push(`${k} (${map(v, ({ group }) => group).join(", ")})`)
  );
  return map(results, (result, index) => {
    return getChip(result, "#808080", index);
  });
};

const getChip = (label, colour, key) => {
  return (
    <Chip
      key={key}
      size="small"
      label={label}
      style={{
        margin: 2,
        backgroundColor: colour,
        color: "white"
      }}
    />
  );
};
