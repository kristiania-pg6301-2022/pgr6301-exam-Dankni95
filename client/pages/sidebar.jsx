import { Button, Grid } from "@mui/material";
import React from "react";

export default ({ user, socket }) => {
  function handleSubmitQuery(e) {
    socket.send(JSON.stringify({ category: e.target.value }));
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <Button
          onClick={(e) => {
            handleSubmitQuery(e);
          }}
          value=""
        >
          All
        </Button>
        <Grid item xs={8}>
          <Button
            value="Politics"
            onClick={(e) => {
              handleSubmitQuery(e);
            }}
          >
            Politics
          </Button>
        </Grid>
        <Button
          value="Economics"
          onClick={(e) => {
            handleSubmitQuery(e);
          }}
        >
          Economics
        </Button>
        <Grid item xs={8}>
          <Button
            value="Sport"
            onClick={(e) => {
              handleSubmitQuery(e);
            }}
          >
            Sport
          </Button>
        </Grid>
        <Button
          value="Health"
          onClick={(e) => {
            handleSubmitQuery(e);
          }}
        >
          Health
        </Button>
      </Grid>
    </Grid>
  );
};
