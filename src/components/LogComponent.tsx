import * as React from 'react'
import { createStyles, makeStyles } from '@material-ui/styles'
import { TextField, Grid, List } from '@material-ui/core'

interface Log {
  type: string,
  message: string
}

interface LogComponentInterface {
  logData: Log[]
}

const LogComponent: React.FC<LogComponentInterface> = ({ logData }) => {
  const classes = useStyles()
  const [textFieldWidth, setTextFieldWidth] = React.useState(window.innerWidth * 0.55)

  const handleResize = () => {
    setTextFieldWidth(window.innerWidth * 0.55)
  }
  window.addEventListener('resize', handleResize)

  console.log('log message: ', logData[0]?.message)
  return (
    <>
      <div className={classes.LogContainer} style={{ width: textFieldWidth, height: '200px', maxHeight: '300px' }}>
        <List style={{ maxHeight: '100%', overflow: 'hidden', height: '100px' }}>
          <Grid container direction='column'>
            {logData.map((log: Log) => {
              return (
                <Grid item xs={12}>
                  <div style={{ color: log.type === 'error' ? 'red' : 'black' }}>
                    {log.message}
                  </div>
                </Grid>
              )
            })}
          </Grid>
        </List>
      </div>
      {/* <TextField
        id="outlined-textarea"
        label="Multiline Placeholder"
        placeholder="Placeholder"
        multiline
        variant='outlined'
        value={text}
        style={{ width: textFieldWidth }}
        maxRows={20}
      /> */}
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    LogContainer: {
      border: 'solid 1px',
      borderColor: 'rgb(184, 184, 184)',
      borderRadius: 5,
      padding: '5px',
    }
  }))

export default LogComponent