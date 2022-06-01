import { createTheme } from '@mui/material/styles';
import { LinkProps } from '@mui/material/Link';
import LinkBehavior from '../components/LinkBehavior';

const theme = createTheme({
  palette: {
    mode: 'light'
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior
      } as LinkProps
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior
      }
    }
  }
});

export default theme;
