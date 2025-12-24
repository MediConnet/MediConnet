import { Tabs, Tab } from '@mui/material';
import {
  Person,
  Description,
  Medication,
  Work,
} from '@mui/icons-material';

export const ProfileTabs = ({ value, onChange }: any) => {
  return (
    <Tabs
      value={value}
      onChange={(_, v) => onChange(v)}
      TabIndicatorProps={{ style: { display: 'none' } }}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        '& .MuiTabs-flexContainer': { gap: { xs: 0.5, sm: 1 } },
        '& .MuiTabs-scrollButtons': {
          '&.Mui-disabled': { opacity: 0.3 },
        },
      }}
    >
      <Tab icon={<Person />} label="Información" value="info" sx={tabStyle} />
      <Tab icon={<Description />} label="Historial" value="history" sx={tabStyle} />
      <Tab icon={<Medication />} label="Medicación" value="medication" sx={tabStyle} />
      <Tab icon={<Work />} label="Profesional" value="professional" sx={tabStyle} />
    </Tabs>
  );
};

const tabStyle = {
  textTransform: 'none',
  borderRadius: 2,
  px: { xs: 2, sm: 3 },
  py: { xs: 1, sm: 1.5 },
  minHeight: { xs: 40, sm: 48 },
  fontSize: { xs: '0.75rem', sm: '0.875rem' },
  backgroundColor: '#f1f5f9',
  '&.Mui-selected': {
    backgroundColor: '#fff',
    border: '1.5px solid #0f172a',
    fontWeight: 600,
  },
  '& .MuiSvgIcon-root': {
    fontSize: { xs: 18, sm: 20 },
  },
};
