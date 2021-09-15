import * as React from 'react'
import { createStyles, makeStyles } from '@material-ui/styles'
import { AppBar, Grid, TextField } from '@material-ui/core'

const { ipcRenderer, dialog } = window.require('electron');

const MainView: React.FC = () => {
  const classes = useStyles()

  const currencies = [
    {
      value: 'MV1.6',
      label: 'MV1.6',
    },
    {
      value: 'MV1.7',
      label: 'MV1.7',
    },
    {
      value: 'MV1.8',
      label: 'MV1.8',
    },
    {
      value: 'latest',
      label: 'latest',
    },
  ];

  const [propertyIDs, setPropertyIDs] = React.useState('')
  const [forestStandVersion, setForestStandVersion] = React.useState('MV1.8');
  const [folderPath, setFolderPath] = React.useState('')

  const standVersionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForestStandVersion(event.target.value);
  };

  const IDchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPropertyIDs(event.target.value)
  }

  const folderPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderPath(event.target.value)
  }

  const openFileBrowser = async () => {
    const response = await ipcRenderer.invoke('openFileSystem')
    setFolderPath(response)
  }


  return (
    <div >
      <AppBar></AppBar>

      <Grid container direction='column' spacing={4}>
        <Grid item xs={12}>
          <TextField
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            rows={4}
            value={propertyIDs}
            variant="outlined"
            onChange={IDchange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-select-currency-native"
            select
            label="Native select"
            value={forestStandVersion}
            onChange={standVersionChange}
            SelectProps={{
              native: true,
            }}
            helperText="Please select your currency"
            variant="outlined"
          >
            {currencies.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            id="filled-required"
            label="Required"
            value={folderPath}
            variant="filled"
          />
          <button onClick={() => openFileBrowser()}>openFileBrowser</button>
        </Grid>
      </Grid>
    </div>
  )
}

const useStyles = makeStyles(() =>
  createStyles({

  }))

export default MainView