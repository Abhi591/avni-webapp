import React, { useEffect, useState } from "react";
import EditIcon from "@material-ui/icons/Edit";
import http from "common/utils/httpClient";
import { Redirect } from "react-router-dom";
import Box from "@material-ui/core/Box";
import { Title } from "react-admin";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import { ShowSubjectType } from "../WorkFlow/ShowSubjectType";
import { get } from "lodash";
import { findProgramEnrolmentForm, findProgramExitForm } from "../domain/formMapping";
import { BooleanStatusInShow } from "../../common/components/BooleanStatusInShow";
import { Audit } from "../../formDesigner/components/Audit";
import RuleDisplay from "../components/RuleDisplay";

const ProgramShow = props => {
  const [program, setProgram] = useState({});
  const [editAlert, setEditAlert] = useState(false);
  const [formMappings, setFormMappings] = useState([]);
  const [subjectType, setSubjectType] = useState([]);

  useEffect(() => {
    http
      .get("/web/program/" + props.match.params.id)
      .then(response => response.data)
      .then(result => {
        setProgram(result);
      });

    http
      .get("/web/operationalModules")
      .then(response => {
        const formMap = response.data.formMappings;
        formMap.map(l => (l["isVoided"] = false));
        setFormMappings(formMap);
        setSubjectType(response.data.subjectTypes);
      })
      .catch(error => {});
  }, []);

  return (
    <>
      <Box boxShadow={2} p={3} bgcolor="background.paper">
        <Title title={"Program: " + program.name} />
        <Grid container item sm={12} style={{ justifyContent: "flex-end" }}>
          <Button color="primary" type="button" onClick={() => setEditAlert(true)}>
            <EditIcon />
            Edit
          </Button>
        </Grid>
        <div className="container" style={{ float: "left" }}>
          <div>
            <FormLabel style={{ fontSize: "13px" }}>Name</FormLabel>
            <br />
            <span style={{ fontSize: "15px" }}>{program.name}</span>
          </div>
          <p />
          <div>
            <FormLabel style={{ fontSize: "13px" }}>Subject Type</FormLabel>
            <br />
            <ShowSubjectType
              rowDetails={program}
              subjectType={subjectType}
              formMapping={formMappings}
              entityUUID="programUUID"
            />
          </div>
          <p />
          <div>
            <FormLabel style={{ fontSize: "13px" }}>Colour</FormLabel>
            <br />
            <div
              style={{
                width: "20px",
                height: "20px",
                border: "1px solid",
                background: program.colour
              }}
            >
              &nbsp;
            </div>
          </div>
          <p />
          <BooleanStatusInShow status={program.active} label={"Active"} />

          <div>
            <FormLabel style={{ fontSize: "13px" }}>Program Subject Label</FormLabel>
            <br />
            <span style={{ fontSize: "15px" }}>{program.programSubjectLabel}</span>
          </div>
          <p />
          <div>
            <FormLabel style={{ fontSize: "13px" }}>Enrolment Form</FormLabel>
            <br />
            <span style={{ fontSize: "15px" }}>
              <a
                href={`#/appdesigner/forms/${get(
                  findProgramEnrolmentForm(formMappings, program),
                  "formUUID"
                )}`}
              >
                {get(findProgramEnrolmentForm(formMappings, program), "formName")}
              </a>
            </span>
          </div>
          <p />
          <div>
            <FormLabel style={{ fontSize: "13px" }}>Exit Form</FormLabel>
            <br />
            <span style={{ fontSize: "15px" }}>
              <a
                href={`#/appdesigner/forms/${get(
                  findProgramExitForm(formMappings, program),
                  "formUUID"
                )}`}
              >
                {get(findProgramExitForm(formMappings, program), "formName")}
              </a>
            </span>
          </div>
          <p />
          <div>
            <FormLabel style={{ fontSize: "13px" }}>Organisation Id</FormLabel>
            <br />
            <span style={{ fontSize: "15px" }}>{program.organisationId}</span>
          </div>
          <p />
          <RuleDisplay
            fieldLabel={"Enrolment Summary Rule"}
            ruleText={program.enrolmentSummaryRule}
          />
          <p />
          <RuleDisplay
            fieldLabel={"Enrolment Eligibility Check Rule"}
            ruleText={program.enrolmentEligibilityCheckRule}
          />
          <p />
          <Audit {...program} />
        </div>

        {editAlert && <Redirect to={"/appDesigner/program/" + props.match.params.id} />}
      </Box>
    </>
  );
};

export default ProgramShow;
