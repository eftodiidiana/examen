import { useEffect, useRef, useState } from 'react';
import validator from 'validator';
import moment from 'moment';

import './JobPosting.css'

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Messages } from 'primereact/messages';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';

const SERVER = 'http://localhost:3000'

function JobPosting() {

    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [name, setName]=useState('');
    const [description, setDescription]=useState('');
    const [deadline, setDeadline]=useState(null);
    const [isEdit, setIsEdit]=useState(false);
    const [selectedRow, setSelectedRow]=useState({});
    const [showDemandDialog, setShowDemandDialog]=useState(false);
    const [demands, setDemands]=useState([]);

    const [errors, setErrors] = useState({
        name: false,
        description: false,
        deadline: false
    });

    const messageError = useRef(null);
    const messageDeadline = useRef(null);
    const toastSuccess = useRef(null);

    const getJobPosting = async ()=>{
        try {
            const response = await fetch(`${SERVER}/api/jobPosting/${id}`);
            let data = await response.json();

            const deadlineAlert = { almostExpired: 0, expired: 0 }
            data.forEach(element => {
                if (moment(moment().format()).isAfter(element.deadline)) {
                    deadlineAlert.expired ++;
                } else if(moment(moment().format()).isAfter(moment(element.deadline).subtract(2, 'day'))) {
                    deadlineAlert.almostExpired ++;
                } 
            });

            messageDeadline.current.clear()
            if(deadlineAlert.almostExpired )
            {
                messageDeadline.current.show({ sticky: true, closable: false, severity: 'warn', detail: `Aveti ${deadlineAlert.almostExpired} jobPostiguri apropiate de deadline` });  
            }
            if (deadlineAlert.expired) {
                messageDeadline.current.show({ sticky: true, closable: false, severity: 'error', detail: `Aveti ${deadlineAlert.expired} JobPostinguri finisate` });
            }
     
            setList(data);
            setFilteredList(data);
        } catch (err) {
            console.warn(err);
        }
    }

    useEffect(()=>{
        getJobPosting();
    }, [])

    const deleteJobPosting = async (rowData)=>{
        const jobPostingId = rowData.id;
        try {
            if(rowData.Demands) {
                for(let i = 0; i < rowData.Demands.length; i++) {
                   let response = await fetch(`${SERVER}/api/demands/${rowData.Demands[i].id}`, {
                        method: 'DELETE'
                    });
                    if(!response.ok) {
                        throw response
                    }
                }
            }
           
            const response = await fetch(`${SERVER}/api/jobPosting/${jobPostingId}`, {
                method: 'DELETE'
            });
            if(!response.ok) {
                throw response
            }

           getJobPosting();
        } catch (err) {
            console.warn(err);
        }
    }

    const deleteDemand = async (id)=>{
        try {
            const response = await fetch(`${SERVER}/api/demands/${id}`, {
                method: 'DELETE'
            });
            if(!response.ok) {
                throw response
            }
            toastSuccess.current.show({severity: 'success', summary: 'Realizat', detail: 'Cerere trimisa cu succes'});

           getDemands();
        } catch (err) {
            console.warn(err);
        }
    }


    const deleteRow = (rowData) => {
        return(
            <Button onClick={() => deleteJobPosting(rowData)} icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" tooltip="Stergere"/>
        )
    }

    const editRow = (rowData) => {
        return(
            <Button onClick={() => {setShowAddDialog(true); setIsEdit(true); setSelectedRow(rowData)}} icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-text" tooltip="Editare"/>
        )
    }


    const onDeleteDemand = (rowData) => {
        return(
            <Button onClick={() => deleteDemand(rowData.id)}  className="p-button-outlined p-button-warning" label="Încheiere cerere"/>
        )
    }

    const cereri = (rowData) => {
        return(
            <Button label="Cereri" onClick={() => {setSelectedRow(rowData); setShowDemandDialog(true)}}  className=" p-button-info p-button-text" />
        )
    }

    const resetValues=()=>{
        setName('');
        setDescription('');
        setDeadline(null)
    }

    const onHide=()=>{
        setErrors({
            name: false,
            description: false,
            deadline: false
        })
        setShowAddDialog(false);
        resetValues();
    }

    const addJobPosting = async (newJobPosting) => {
        try {
            const response = await fetch(`${SERVER}/api/jobPosting/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newJobPosting)
            });
            if(!response.ok) {
                throw response
            }
            toastSuccess.current.show({severity: 'success', summary: 'Realizat', detail: 'JobPosting adaugat cu succes'});
    
        getJobPosting();
        } catch (err) {
            console.warn(err);
        }
      };

      const updateJobPosting = async (id, jobPosting)=> {
        try {
            const response = await fetch(`${SERVER}/api/jobPosting/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jobPosting)
            });
            if(!response.ok) {
                throw response
            }
            toastSuccess.current.show({severity: 'success', summary: 'Realizat', detail: 'JobPosting  modificat cu succes'});
            getJobPosting();
        } catch (err) {
            console.warn(err);
        }
    }


    const onAdd=()=>{
        messageError.current.clear();
        setErrors({
            name: false,
            description: false,
            deadline: false,
        })

        if(!name  || !description || !deadline )  {
            setErrors({
                name: !name ? true : false ,
                description: !description ? true : false,
                deadline: !deadline ? true : false
            })
            messageError.current.replace({severity: 'error', summary: 'Aveti campuri obligatorii necompletate'});
            return;
        }

        if(name && !validator.isLength(name, {
            min:3,
            max:50
        })) {
            setErrors({
                name: true,
            })
            messageError.current.replace({severity: 'error', summary: 'Denumirea trebuie sa fie intre 3 si 50 de caractere'});
            return;
        }
		
		if(description && !validator.isLength(description, {
            min:3,
            max:100
        })) {
            setErrors({
                name: true,
            })
            messageError.current.replace({severity: 'error', summary: 'Descrierea trebuie sa fie intre 3 si 100 de caractere'});
            return;
        }

        if(deadline && !validator.isDate(deadline)) {
            setErrors({
               deadline: true
            })
            messageError.current.replace({severity: 'error', summary: 'Data invalida'});
            return;
        }

        setShowAddDialog(false); 
        const jobPosting = {name, description, deadline };
        if(isEdit)
        {
            updateJobPosting(selectedRow.id, jobPosting);
        }else{
            addJobPosting(jobPosting);
        }
        resetValues();
    }

    const dialogAction = () => {
        return (
            <div>
                <Button label="Anulare"  onClick={() => onHide()} className="p-button-danger p-1 w-3" />
                <Button label={isEdit ? 'Salvare' : 'Adaugare'} className="p-button-success p-1 w-3" onClick={() => onAdd()}  />
            </div>
        );
    }

    const dialogActionDemand = () => {
        return (
            <div>
                <Button label="Inchide"  onClick={() => onHideDemand()} className="p-button-danger p-1 w-3" />
            </div>
        );
    }

    const onShow=()=>{
       if(isEdit){
        setName(selectedRow.name);
        if(selectedRow.description){
            setDescription(selectedRow.description);
        }
        const date = new Date(selectedRow.deadline)
        setDeadline(date);
       } 
       else{
        resetValues();
       }
    }

    const getDemands=async ()=>{
        try {
            const response = await fetch(`${SERVER}/api/jobPosting/${selectedRow.id}/demands`);
            const data = await response.json();
            setDemands(data);
            
        } catch (err) {
            console.warn(err);
        }
    }
    const onShowDemand=()=>{
        getDemands();
        
    }

    const onHideDemand=()=>{
        setShowDemandDialog(false);
    }

    const deadlineBody = (rowData) => {
        const deadlineClass = classNames({
            'good': true,
            'almostExpired': moment(moment().format()).isAfter( moment(rowData.deadline).subtract(2, 'day')),
            'expired': moment(moment().format()).isAfter(rowData.deadline)
        });
        return (
            <div className={deadlineClass}>
                {moment(rowData.deadline).format('DD.MM.YYYY')} 
            </div>
        );
    }

    const submissionBody = (rowData) => {
        return (
            <div>
                {moment(rowData.deadline).format('DD.MM.YYYY / HH:MM')} 
            </div>
        );
    }
    
    return (
    <div className='p-3'>
        <div className='flex justify-content-between mb-3 pb-3 align-items-center border-bottom' >
            <h3 className='mr-4'>JobPosting</h3>
            <Messages ref={messageDeadline}></Messages>
            <div>
                <Button label="Adaugare" icon="pi pi-plus" className="p-button-success p-button-sm text-right ml-2 mb-1" onClick={()=>{setShowAddDialog(true); setIsEdit(false)}}/>
            </div>
        </div>
        <DataTable value={filteredList} responsiveLayout="scroll" emptyMessage="Lista de JobPosting este goala"   >
            <Column field="name" header="Denumire" style={{ width: '20%' }}></Column>
            <Column field="description" header="Descriere" style={{ width: '20%' }}></Column>
            <Column field="deadline" header="Deadline" style={{ width: '20%' }} body={deadlineBody}></Column>
           <Column body={editRow} bodyStyle={{textAlign:'center'}} style={{ width: '15%' }}></Column>
            <Column body={deleteRow} style={{ width: '15%' }}></Column>
            <Column body={cereri} style={{ width: '10%' }}></Column>
        </DataTable>
        <Dialog header={isEdit? 'Editare JobPosting' : 'Adaugare JobPosting'} visible={showAddDialog} style={{ width: '30vw' }} footer={dialogAction()} onHide={() => onHide()} onShow={()=>onShow()}>
            <span className="p-float-label m-2 mb-4 mt-4">
                <InputText id="name" className={'w-100 ' + (errors.name ? 'p-invalid' : '' )} value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor="name">Denumire</label>          
            </span>
            <span className="p-float-label m-2 mb-4">
                <InputTextarea  id="description" rows={5}  value={description} onChange={(e) => setDescription(e.target.value)}  className='w-100'/>  
                <label htmlFor="description">Descriere</label>        
            </span> 
            <span className="p-float-label m-2 mb-4">
                <Calendar className={'w-100 ' + (errors.deadline ? 'p-invalid' : '' )} dateFormat="dd.mm.yy" id="deadline" value={deadline} onChange={(e) => setDeadline(e.value)} showIcon />
                <label htmlFor="deadline">Deadline</label>
            </span>
           
            <Messages className='m-2' ref={messageError}></Messages>
           
        </Dialog>

        <Dialog header='Cereri' visible={showDemandDialog} style={{ width: '40vw' }} footer={dialogActionDemand()} onHide={() => onHideDemand()} onShow={()=>onShowDemand()}>
            <DataTable value={demands} responsiveLayout="scroll" emptyMessage="Nici o cerere pentru acest JobPosting"   >
                <Column field="submission" header="Data cererii" style={{ width: '40%' }} body={submissionBody}></Column>
                <Column body={onDeleteDemand} style={{ width: '20%' }}></Column>
            </DataTable>
        </Dialog>

        <Toast ref={toastSuccess} />
    </div>
 )
}

export default JobPosting

