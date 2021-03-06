import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Typography,
  Grid,
  Switch,
  TextField,
  FormControlLabel,
  Box,
} from '@material-ui/core';
// Custom hooks
import useStyles from '../../../hooks/useStyles';
// Components
import FormCheckboxes from '../../FormCheckboxes/FormCheckboxes';

// Opened by clicking the edit icon on FormatsAccordion
// Edits some logistical information for the provider, like the formats they
// see clients, insurance, license number, etc
function EditProviderFormatsDialog({
  handleSubmit,
  dialogOpen,
  handleCancel,
  handleInputs,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    accepting_clients,
    sliding_scale,
    license_number,
    state,
  } = useSelector((store) => store.forms.providerAnswers);

  const handleBooleans = (key, boolean) => {
    dispatch({
      type: 'SET_PROVIDER_PERSONAL_DETAILS',
      payload: { key, value: !boolean },
    });
  };

  return (
    <Dialog
      open={dialogOpen === 'formats'}
      onClose={handleCancel}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Edit Formats/Insurance</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography>I offer therapy in these formats:</Typography>
            <FormCheckboxes category={'formats'} />
            <Box py={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={accepting_clients}
                    onChange={() =>
                      handleBooleans('accepting_clients', accepting_clients)
                    }
                  />
                }
                label="I'm accepting new clients"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={sliding_scale}
                    onChange={() =>
                      handleBooleans('sliding_scale', sliding_scale)
                    }
                  />
                }
                label="I offer sliding scale payments"
              />
            </Box>
            <Typography>My {state} license number is:</Typography>
            <TextField
              variant="outlined"
              label="License Number"
              className={classes.inputs}
              value={license_number || ''}
              onChange={handleInputs('license_number')}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography>I accept insurance from these companies:</Typography>
            <FormCheckboxes category={'insurance'} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditProviderFormatsDialog;
