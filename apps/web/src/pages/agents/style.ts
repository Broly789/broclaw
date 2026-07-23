import { createStyles } from 'antd-style';

const useStyles = createStyles({
  col: {
    display: 'flex',
  },
  addButton: {
    width: '100%',
    minHeight: 240,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '.ant-card-body': {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: 16,
    },
    '.ant-card-actions': {
      padding: '4px 0',
    },
  },
});

export default useStyles;
