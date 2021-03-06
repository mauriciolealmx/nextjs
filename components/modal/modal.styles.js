import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  paper: {
    top: `40%`,
    left: `40%`,
    transform: `translate(-40%, -40%)`,
    position: 'absolute',
    width: 350,
    height: 320,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },

  title: {
    fontSize: '16px',
    textAlign: 'center',
  },

  textField: {
    width: '28ch',
  },

  cancelButton: {
    marginTop: '10px',
    padding: '9px 20px',
    backgroundColor: '#aa0000',
    fontWeight: 'bold',
    color: '#fff',
  },

  createButton: {
    fontWeight: 'bold',
    marginLeft: '10px',
    marginTop: '10px',
    padding: '9px 20px',
    backgroundColor: '#1d3e54',
    color: '#fff',
  },

  actionsRoot: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));
