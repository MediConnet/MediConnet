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
      sx={{ '& .MuiTabs-flexContainer': { gap: 1 } }}
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
  px: 3,
  backgroundColor: '#f1f5f9',
  '&.Mui-selected': {
    backgroundColor: '#fff',
    border: '1.5px solid #0f172a',
    fontWeight: 600,
  },
};
