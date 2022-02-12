import {Route, Routes } from 'react-router-dom'
import JobPosting from './jobPosting/JobPosting'
import Candidate from './candidate/Candidate'
import Demand from './demand/Demand'
import Home from './home/Home'
import NavBar from './nav/NavBar'


function Main() {
 return (
     <div >
        <NavBar/>

        <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/jobPosting' element={<JobPosting/>}></Route>
            <Route path='/candidate' element={<Candidate/>}></Route>
            <Route path='/demand' element={<Demand/>}></Route>
            

        </Routes>

     </div>
 )
}

export default Main

