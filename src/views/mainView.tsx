import * as React from 'react'
import { AppBar, Button, Grid, TextField, Toolbar, Typography } from '@material-ui/core'
import DownloadIcon from '@material-ui/icons/CloudDownload'
import { useSnackbar } from 'notistack'
const wkt = require('wkt')

const { ipcRenderer } = window.require('electron');

const MainView: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [propertyIDs, setPropertyIDs] = React.useState('')
  const [forestStandVersion, setForestStandVersion] = React.useState('MV1.8');
  const [folderPath, setFolderPath] = React.useState('')

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

  const standVersionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForestStandVersion(event.target.value);
  };

  const IDchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPropertyIDs(event.target.value)
  }

  const openFileBrowser = async () => {
    const response = await ipcRenderer.invoke('openFileSystem')
    setFolderPath(response)
  }

  const getData = async () => {
    if (propertyIDs === '') {
      enqueueSnackbar('Please add property IDs', { variant: 'error' })
      return
    }
    if (folderPath === '') {
      enqueueSnackbar('Please select folder path', { variant: 'error' })
      return
    }

    const arrayOfIDs = propertyIDs.replace(/[\r\n\t]/g, "").split(',').filter(string => string)
    arrayOfIDs.forEach(async (ID: string, index: number) => {
      const fetchURL = 'https://beta-paikkatieto.maanmittauslaitos.fi/kiinteisto-avoin/simple-features/v1/collections/PalstanSijaintitiedot/items?crs=http%3A%2F%2Fwww.opengis.net%2Fdef%2Fcrs%2FEPSG%2F0%2F3067&kiinteistotunnuksenEsitysmuoto='
      const response = await fetch(fetchURL + ID)
      const data = await response.json()
      try {
        data.features.forEach(async (geometry: any, index: number) => {
          const WKTPolygon = wkt.stringify(geometry) as string
          const fetchURL = 'https://mtsrajapinnat.metsaan.fi/ATServices/ATXmlExportService/FRStandData/v1/ByPolygon'
          const response = await fetch(fetchURL, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            body: `wktPolygon=${encodeURIComponent(WKTPolygon)}&stdVersion=${forestStandVersion}`
          })
          enqueueSnackbar(`Downloading files for ID: ${ID} `, { variant: 'info' })
          const dataAsText = await response.text()
          ipcRenderer.invoke('saveXml', { filename: `data${index}.txt`, data: dataAsText }).then((result: any) => {
            console.log('SAVED!', result)
          })
        })
      } catch (error) {
        enqueueSnackbar(`Error during download: ${error}`, { variant: 'error' })
        console.log(error)
      }
    })
  }

  return (
    <div >
      <AppBar position='static' style={{ marginBottom: '20px' }}>
        <Toolbar>
          <Typography variant="h6" >
            SMK browser
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container direction='column' spacing={4} justifyContent='center' alignItems='center'>
        <Grid item xs={12}>
          <TextField
            id="outlined-multiline-static"
            label="Property IDs"
            multiline
            rows={4}
            value={propertyIDs}
            variant="outlined"
            onChange={IDchange}
            defaultValue="Default Value"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-select-currency-native"
            select
            label="Forest Stand"
            value={forestStandVersion}
            onChange={standVersionChange}
            SelectProps={{
              native: true,
            }}
            helperText="Please select your currency"
            variant="outlined"
            fullWidth
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
            onClick={() => openFileBrowser()}
            id="filled-read-only-input"
            label="Folder path"
            defaultValue="Hello World"
            value={folderPath}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant='outlined'
            onClick={() => getData()}
            endIcon={<DownloadIcon />}>
            Download all data
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default MainView