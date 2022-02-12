import { useEffect, useRef, useState } from 'react';
import validator from 'validator';

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Messages } from 'primereact/messages';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';

const SERVER = 'http://localhost:3000'

function Candidate() {

    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [name, setName]=useState('');
    const [cv, setCv]=useState('');
    const [email, setEmail]=useState('');
    const [isEdit, setIsEdit]=useState(false);
    const [selectedRow, setSelectedRow]=useState({});

    const [errors, setErrors] = useState({
        name: false,
        cv: false,
        email: false,
    });

    const messageError = useRef(null);
    const toastSuccess = useRef(null);

    const getCandidate= async ()=>{
        try {
            const jobPostingId = jobPosting.jobPosting.id;
            const response = await fetch(`${SERVER}/api/jobPosting/${jobPostingId}/candidate`);
            let data = await response.json();

            setList(data);
        } catch (err) {
            console.warn(err);
        }
    }

    useEffect(()=>{
        getCandidate();
    }, [])

    const deleteCandidate = async (rowData)=>{
        const candidateId = rowData.id;
        try {
            if(rowData.JobPosting) {
                for(let i = 0; i < rowData.JobPosting.length; i++) {
                   let response = await fetch(`${SERVER}/api/jobPosting/${rowData.JobPosting[i].id}`, {
                        method: 'DELETE'
                    });
                    if(!response.ok) {
                        throw response
                    }
                }
            }
           
            const response = await fetch(`${SERVER}/api/candidate/${candidateId}`, {
                method: 'DELETE'
            });
            if(!response.ok) {
                throw response
            }

           getCandidate();
        } catch (err) {
            console.warn(err);
        }
    }


    const deleteRow = (rowData) => {
        return(
            <Button onClick={() => deleteCandidate(rowData)} icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" tooltip="Stergere"/>
        )
    }

    const editRow = (rowData) => {
        return(
            <Button onClick={() => {setShowAddDialog(true); setIsEdit(true); setSelectedRow(rowData)}} icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-text" tooltip="Editare"/>
        )
    }

    const resetValues=()=>{
        setName('');
        setCv('');
        setEmail('')
    }

    const onHide=()=>{
        setErrors({
            name: false,
            cv: false,
            email: false
        })
        setShowAddDialog(false);
        resetValues();
    }

    const addCandidate = async (newFood) => {
        try {
            const jobPostingId = jobPosting.jobPosting.id;
            const response = await fetch(`${SERVER}/api/jobPosting/${jobPostingId}/candidate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newJobPosting)
            });
            if(!response.ok) {
                throw response
            }
            toastSuccess.current.show({severity: 'success', summary: 'Realizat', detail: 'Candidat adaugat cu succes'});
    
        getCandidate();
        } catch (err) {
            console.warn(err);
        }
      };

      const updateCandidate = async (id, candidate)=> {
        try {
            const response = await fetch(`${SERVER}/api/candidate/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(food)
            });
            if(!response.ok) {
                throw response
            }

            toastSuccess.current.show({severity: 'success', summary: 'Realizat', detail: 'Candidat modificat cu succes'});
            getCandidate();
        } catch (err) {
            console.warn(err);
        }
    }


    const onAdd=()=>{
        messageError.current.clear();
        setErrors({
            name: false,
            cv: false,
            email: false
        })

        if(!name  || !cv || !email )  {
            setErrors({
                name: !name ? true : false ,
                cv: !cv ? true : false,
                email: !email ? true : false
            })
            messageError.current.replace({severity: 'error', summary: 'Aveti campuri obligatorii necompletate'});
            return;
        }

        if(name && !validator.isLength(name, {
            min:5,
            max:40
        })) {
            setErrors({
                name: true,
            })
            messageError.current.replace({severity: 'error', summary: 'Denumirea trebuie sa fie intre 5 si 40 de caractere'});
            return;
        }

		if(cv && !validator.isLength(cv, {
            min:100,
            max:1000
        })) {
            setErrors({
                name: true,
            })
            messageError.current.replace({severity: 'error', summary: 'CV-ul trebuie sa fie intre 100 si 1000 de caractere'});
            return;
        }


        if(email && !validator.isEmail(email)) {
            setErrors({
               email: true
            })
            messageError.current.replace({severity: 'error', summary: 'Email invalid'});
            return;
        }

        setShowAddDialog(false); 
        const candidate={name, cv, email };
        if(isEdit)
        {
            updateCandidate(selectedRow.id, candidate);
        }else{
            addCandidate(candidate);
        }

        resetValues();
    }

    const dialogAction = () => {
        return (
            <div>
                <Button label="Anulare"  onClick={() => onHide()} className="p-button-danger p-1 w-3" />
                <Button label={isEdit ? 'Salvare' : 'Adăugare'} className="p-button-success p-1 w-3" onClick={() => onAdd()}  />
            </div>
        );
    }

    const onShow=()=>{
       if(isEdit){
        setName(selectedRow.name);
        if(selectedRow.description){
            setDescription(selectedRow.description);
        }
		setEmail(selectedRow.email);
        setCategory(selectedRow.category);
       } 
       else{
        resetValues();
       }
    }

    return (
    <div className='p-3'>
        <div className='flex justify-content-between mb-3 pb-3 align-items-center border-bottom' >
            <h3 className='mr-4'>Candidate</h3>
            <div>
                <Button label="Adaugare" icon="pi pi-plus" className="p-button-success p-button-sm text-right ml-2 mb-1" onClick={()=>{setShowAddDialog(true); setIsEdit(false)}}/>
            </div>
        </div>
        <DataTable value={filteredList} responsiveLayout="scroll" emptyMessage="Lista de candidati este goală"   >
            <Column field="name" header="Denumire" style={{ width: '25%' }}></Column>
            <Column field="cv" header="CV" style={{ width: '40%' }}></Column>
            <Column field="email" header="Email" style={{ width: '25%' }}></Column>
            <Column body={editRow} bodyStyle={{textAlign:'center'}} style={{ width: '15%' }}></Column>
            <Column body={deleteRow} style={{ width: '15%' }}></Column>
        </DataTable>
        <Dialog header={isEdit? 'Editare candidat' : 'Adăugare candidat'} visible={showAddDialog} style={{ width: '30vw' }} footer={dialogAction()} onHide={() => onHide()} onShow={()=>onShow()}>
            <span className="p-float-label m-2 mb-4 mt-4">
                <InputText id="name" className={'w-100 ' + (errors.name ? 'p-invalid' : '' )} value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor="name">Nume*</label>          
            </span>
            <span className="p-float-label m-2 mb-4">
                <InputTextarea  id="cv" rows={5}  value={cv} onChange={(e) => setCv(e.target.value)}  className='w-100'/>  
                <label htmlFor="cv">CV</label>        
            </span>
            <span className="p-float-label m-2 mb-4">
                <InputTextarea  id="email" rows={5}  value={email} onChange={(e) => setEmail(e.target.value)}  className='w-100'/>  
                <label htmlFor="email">Email</label>        
            </span>
            <Messages className='m-2' ref={messageError}></Messages>
           
        </Dialog>
        <Toast ref={toastSuccess} />
    </div>
 )
}

export default Candidate