import * as React from 'react'
import { createStyles, makeStyles } from '@material-ui/styles'
import { AppBar, Button, Grid, TextField, Toolbar, IconButton, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
const wkt = require('wkt')

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

  const openFileBrowser = async () => {
    const response = await ipcRenderer.invoke('openFileSystem')
    setFolderPath(response)
  }

  const getData = () => {
    const arrayOfIDs = propertyIDs.replace(/[\r\n\t]/g, "").split(',')
    arrayOfIDs.forEach(async (ID: string) => {
      const fetchURL = 'https://beta-paikkatieto.maanmittauslaitos.fi/kiinteisto-avoin/simple-features/v1/collections/PalstanSijaintitiedot/items?crs=http%3A%2F%2Fwww.opengis.net%2Fdef%2Fcrs%2FEPSG%2F0%2F3067&kiinteistotunnuksenEsitysmuoto='
      const response = await fetch(fetchURL + ID)
      const data = await response.json()
      console.log('1. Fetch: ', data)

      try {
        data.features.forEach(async (geometry: any, index: number) => {
          const WKTPolygon = wkt.stringify(geometry)
          const fetchURL = 'https://mtsrajapinnat.metsaan.fi/ATServices/ATXmlExportService/FRStandData/v1/ByPolygon?'
          const response = await fetch(fetchURL, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            body: `wktPolygon=${WKTPolygon}&stdVersion=${forestStandVersion}`
          })
          const dataAsText = await response.text()
          console.log(dataAsText)


          ipcRenderer.invoke('saveXml', { filename: `data${index}.txt`, data: dataAsText }).then((result: any) => {
            console.log('SAVED!', result)
          })
        })

      } catch (error) {
        console.log(error)
      }
    })
  }


  return (
    <div >
      <AppBar position='static' style={{ marginBottom: '20px' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" >
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Grid container direction='column' spacing={4} justifyContent='center' alignItems='center'>
        <Grid item xs={12}>
          <TextField
            id="outlined-multiline-static"
            label="Multiline"
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
            id="filled-read-only-input"
            label="Folder path"
            defaultValue="Hello World"
            value={folderPath}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            fullWidth
          />
          <button onClick={() => openFileBrowser()}>openFileBrowser</button>
          <button onClick={() => getData()}>Get data!</button>
        </Grid>
      </Grid>
    </div>
  )
}

const useStyles = makeStyles(() =>
  createStyles({

  }))

export default MainView