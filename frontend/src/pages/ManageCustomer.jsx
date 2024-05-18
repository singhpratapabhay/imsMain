import React, { useEffect, useState } from 'react';
import "./managersuplier.css";

import CustomerForm from '../component/CustomerForm';
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from 'axios';
import { base_Url } from './api';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GoDownload } from "react-icons/go";
import avatar  from "../images/avatar.jpg"
const ManageCustomer = () => {
    const doc = new jsPDF();
    const [formToggle, setFormToggle] = useState(false);
    const [data, setData] = useState(null);
    const [viewData, setViewData] = useState(data);
    const [current, setCurrent] = useState(1);
    const [searchKeyWord, setSearchKeyWord] = useState("");
    const [editData, setEditData] = useState("");

    const allClient = async () => {
        try {
            const response = await axios.get(`${base_Url}/client/allCustomer`);
            setViewData(response.data.result)
            setData(response.data.result);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        allClient();
        console.log("hello")
    }, []);

    const editHandler = (item) => {
        setEditData(item);
        console.log(item)
        setFormToggle(true);
    }

    const deleteHandler = async (id) => {
        await axios.delete(`${base_Url}/client/delete_Customer/${id}`).then((res) => {
            console.log(res.data);
            alert("deleted")
            allClient();
        }).catch((err) => console.log(err))
    }
    const pdfSaveHandler = () => {
        if (data && data.length < 1) {
            return;
        }
    
        if (data && Array.isArray(data)) {
            doc.setFontSize(10);
            doc.text(`Customer Data`, 5, 5);
    
            const headers = [
                ["No.", 'Customer Name', 'Profile', "Contact No.", 'Customer Email', 'Customer Address']
            ];
            const body = data.map((val, i) => [
                (i + 1),
                val.customer_name,
                '', // Placeholder for the image; will be added separately
                val.customer_contact_no,
                val.customer_email,
                val.customer_address
            ]);
    
            autoTable(doc, {
                head: headers,
                body: body,
                startY: 8, // Adjust startY based on the heading's height
                startX: 8,
                margin: { left: 5, right: 5 },
                tableWidth: 'auto',
                styles: { cellPadding: 2, fontSize: 8, valign: 'middle', halign: 'center' },
                headStyles: { fillColor: [15, 96, 96], textColor: 255, fontSize: 8, fontStyle: 'bold', minCellHeight: 10 },
                bodyStyles: { minCellHeight: 10, alternateRowStyles: { fillColor: [255, 204, 153] } },
            });
    
            // Add images separately
            data.forEach((val, i) => {
                const imageX = 68; // Adjust X-coordinate for the image
                const imageY = 19.5 + (i * 10); // Adjust Y-coordinate for the image
    
                doc.addImage(val.customer_image.url, 'JPEG', imageX, imageY, 8, 8); // Adjust width and height as needed
            });
    
            doc.save(`Customer Data`);
        }
    };
    
    
    
    
    
    
    
    
    
    
    
    
    const searchHandler = (e) => {
        console.log(e.target.value)
        if (e.target.value.length>0) {
            const filterData = data.filter((val) => {
                return val.customer_name.toLowerCase().includes(e.target.value.toLowerCase());
            });
            setViewData(filterData);
        }else if(e.target.value.length===0){
            setViewData(data);
        }
        setSearchKeyWord(e.target.value)
    }

    const paginationPrevHandler = (page) => {
        if (page < 1) return;
        setCurrent(page);
    }

    const paginationNextHandler = (page) => {
        if (page * 10 - 9 > data.length) return;
        setCurrent(page);
    }

    return (
        <>
            {formToggle ? <CustomerForm editData={editData} setEditData={setEditData} allClient={allClient} setFormToggle={setFormToggle} /> : <></>}
            <div className='purchase'>
            <div className='purchase-button'>
        <ul>
    
            
        <li className="subactive" >All Customer</li>
       


        <div className='download-container' >
        <GoDownload onClick={pdfSaveHandler}/>
        </div>
        
        </ul>
        <div className='input-container'><input placeholder='Customer Name' value={searchKeyWord} onChange={(e) => searchHandler(e)}  /></div>
          </div>
                <div className='purchase-table'>
                <button  className='newPurchase' onClick={() => setFormToggle(true)}>Add Customer</button>
                    <table>
                        <thead>
                            <tr>
                                <th >S.No.</th>
                                <th >Customer Name</th>
                                <th >Profile</th>
                                <th >Mobile No.</th>
                                <th >Email </th>
                                <th >Address</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                viewData && viewData.slice(current * 10 - 10, current * 10).map((val, i) => (
                                    <tr key={val.id}>
                                        <td>{(current - 1) * 10 + i + 1}</td>
                                        <td>{val.customer_name}</td>
                                        <td className='profile-image-container'><div className='profile-image'><img src={val.customer_image.url===""?`${avatar}`:`${val.customer_image.url}`} alt='profile' /></div></td>
                                        <td>{val.customer_contact_no}</td>
                                        <td>{val.customer_email}</td>
                                        <td style={{width: "263px"}}>{val.customer_address}</td>
                                        <td><MdOutlineModeEdit className='visible supplier' onClick={() => editHandler(val)} /><RiDeleteBinLine className='rejected supplier' onClick={() => deleteHandler(val._id)} /></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {viewData?.length > 10 && <div className='managersuplier-pagination'>
                      
                      <MdKeyboardArrowLeft onClick={() => paginationPrevHandler(current - 1)}/>
                      <li>{current}</li>
                      <MdKeyboardArrowRight onClick={()=>paginationNextHandler(current+1)}/>
                 
              </div>}
            </div>
        </>
    );
}

export default ManageCustomer;
