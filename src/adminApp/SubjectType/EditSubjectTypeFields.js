import React from "react";
import { AvniTextField } from "../../common/components/AvniTextField";
import { AvniSelect } from "../../common/components/AvniSelect";
import _ from "lodash";
import Types from "./Types";
import MenuItem from "@material-ui/core/MenuItem";
import { AvniImageUpload } from "../../common/components/AvniImageUpload";
import { AvniSwitch } from "../../common/components/AvniSwitch";
import { AvniSelectForm } from "../../common/components/AvniSelectForm";
import { findRegistrationForms } from "../domain/formMapping";
import { AvniFormLabel } from "../../common/components/AvniFormLabel";
import GroupRoles from "./GroupRoles";
import Editor from "react-simple-code-editor";
import {
  sampleSubjectProgramEligibilityCheckRule,
  sampleSubjectSummaryRule
} from "../../formDesigner/common/SampleRule";
import { highlight, languages } from "prismjs/components/prism-core";
import PropTypes from "prop-types";

const EditSubjectTypeFields = props => {
  const { subjectType, onRemoveFile, onSetFile, formList, groupValidationError, dispatch } = props;

  return (
    <>
      <AvniTextField
        id="name"
        label="Name"
        autoComplete="off"
        value={subjectType.name}
        onChange={event => dispatch({ type: "name", payload: event.target.value })}
        toolTipKey={"APP_DESIGNER_SUBJECT_TYPE_NAME"}
      />
      <p />
      <AvniSelect
        label="Select Type *"
        value={_.isEmpty(subjectType.type) ? "" : subjectType.type}
        onChange={event => dispatch({ type: "type", payload: event.target.value })}
        style={{ width: "200px" }}
        required
        options={Types.types.map(({ type }, index) => (
          <MenuItem value={type} key={index}>
            {type}
          </MenuItem>
        ))}
        toolTipKey={"APP_DESIGNER_SUBJECT_TYPE_SELECT_TYPE"}
      />
      <p />
      <AvniImageUpload
        onSelect={onSetFile}
        label={"Icon"}
        toolTipKey={"APP_DESIGNER_SUBJECT_TYPE_ICON"}
        width={75}
        height={75}
        oldImgUrl={subjectType.iconFileS3Key}
        allowUpload={true}
        onDelete={() => onRemoveFile(true)}
        displayDelete={true}
      />
      <p />
      <AvniSwitch
        checked={!!subjectType.active}
        onChange={event => dispatch({ type: "active", payload: event.target.checked })}
        name="Active"
        toolTipKey={"APP_DESIGNER_SUBJECT_TYPE_ACTIVE"}
      />
      <p />
      <AvniSelectForm
        label={"Registration Form"}
        value={_.get(subjectType, "registrationForm.formName")}
        onChange={selectedForm =>
          dispatch({
            type: "registrationForm",
            payload: selectedForm
          })
        }
        formList={findRegistrationForms(formList)}
        toolTipKey={"APP_DESIGNER_SUBJECT_TYPE_SELECT_FORM"}
      />
      <p />
      {Types.isGroup(subjectType.type) && (
        <>
          <AvniFormLabel
            label={Types.isHousehold(subjectType.type) ? "Household Roles" : "Group Roles"}
            toolTipKey={"APP_DESIGNER_SUBJECT_TYPE_GROUP_ROLES"}
          />
          <GroupRoles
            groupRoles={subjectType.groupRoles}
            type={subjectType.type}
            dispatch={dispatch}
            error={groupValidationError}
            edit={true}
            memberSubjectType={subjectType.memberSubjectType}
          />
        </>
      )}
      <p />
      <AvniFormLabel label={"Subject Summary Rule"} toolTipKey={"SUBJECT_SUMMARY_RULE"} />
      <Editor
        value={subjectType.subjectSummaryRule || sampleSubjectSummaryRule()}
        onValueChange={event => dispatch({ type: "subjectSummaryRule", payload: event })}
        highlight={code => highlight(code, languages.js)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 15,
          height: "auto",
          borderStyle: "solid",
          borderWidth: "1px"
        }}
      />
      <p />
      <AvniFormLabel
        label={"Subject Program Eligibility Check Rule"}
        toolTipKey={"SUBJECT_PROGRAM_ELIGIBILITY_CHECK_RULE"}
      />
      <Editor
        value={
          subjectType.programEligibilityCheckRule || sampleSubjectProgramEligibilityCheckRule()
        }
        onValueChange={event => dispatch({ type: "programEligibilityCheckRule", payload: event })}
        highlight={code => highlight(code, languages.js)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 15,
          height: "auto",
          borderStyle: "solid",
          borderWidth: "1px"
        }}
      />
    </>
  );
};

EditSubjectTypeFields.propTypes = {
  subjectType: PropTypes.object.isRequired,
  onSetFile: PropTypes.func.isRequired,
  onRemoveFile: PropTypes.func.isRequired,
  formList: PropTypes.array.isRequired,
  groupValidationError: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default EditSubjectTypeFields;
