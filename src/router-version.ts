import {
  useLocation as useLocationV6,
  useMatches as useMatchesV6,
  useNavigate as useNavigateV6,
} from 'react-router-dom';
import { useLocation as useLocationV7, useMatches as useMatchesV7, useNavigate as useNavigateV7 } from 'react-router';

export let useLocation = useLocationV7;
export let useMatches = useMatchesV7;
export let useNavigate = useNavigateV7;

export const changeVersion = (version: 7 | 6 = 7) => {
  useLocation = version === 7 ? useLocationV7 : useLocationV6;
  useMatches = version === 7 ? useMatchesV7 : useMatchesV6;
  useNavigate = version === 7 ? useNavigateV7 : useNavigateV6;
};
