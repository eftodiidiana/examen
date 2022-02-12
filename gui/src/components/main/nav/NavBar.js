import {useNavigate} from 'react-router-dom'
import user from '../../../shared/Auth'

import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';

function NavBar() {
    const items = [{
            label: 'Acasa',
            icon: 'pi pi-home',
            command: () => {
                navigateTo('/')
            }
        }, {
            label: 'JobPosting',
            icon: 'pi pi-search',
            command: () => {
                navigateTo('/jobPosting')
            }
        }, {
            label: 'Candidate',
            icon: 'pi pi-users',
            command: () => {
                navigateTo('/candidate')
            }
        },
        {
            label: 'Demand',
            icon: 'pi pi-bookmark',
            command: () => {
                navigateTo('/demand')
            }
        }
    ]
}

export default NavBar

