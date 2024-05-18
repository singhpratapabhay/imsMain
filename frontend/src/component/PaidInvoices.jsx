import React, { useEffect, useState } from 'react';
import "../pages/managersuplier.css";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from 'axios';
import { base_Url } from '../pages/api';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import InvoiceNav from './InvoiceNav';
import { useLocation } from 'react-router-dom';
import { SlEye } from "react-icons/sl";
import { BiEdit } from "react-icons/bi";
import Invoice from './Invoice';
const PaidInvoices = () => {
    const location = useLocation().pathname;
    const doc = new jsPDF();
    const [data, setData] = useState(null);
    const [viewData, setViewData] = useState(data);
    const [current, setCurrent] = useState(1)
    const [searchKeyWord, setSearchKeyWord] = useState("");
    const [viewToggle, setViewToggle] = useState(false);
    const [viewPayment, setViewPayment] =useState(false);
    const [viewPurchase, setViewPurchase] = useState(null);
    const allPurchase = async () => {
        try {
            const response = await axios.get(`https://ims-jspr.onrender.com/invoice/allInvoices`);
            if(response.data.result.length>0){
          let filterData =   response.data.result[0].arr.filter((val,i)=>{
                return val.paidStatus !== "partiallyPaid" && val.paidStatus!=="unpaid" 
            })

            setData(filterData);
            setViewData(filterData)
        }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        allPurchase();
    }, []);
    
console.log(data)
    const deleteHandler = async (id) => {
        await axios.delete(`https://ims-jspr.onrender.com/invoice/remove_invoice_details/${id}`).then((res) => {
            console.log(res.data);
            alert("deleted")
            allPurchase();

        }).catch((err) => console.log(err))
    }
    const pdfSaveHandler = () => {
      if (data.length < 1) return;
    
      let startY = 7; // Initial startY position
      const margin = 7; // Margin for each table
      const minTableHeight = 50; // Minimum height for each table
      const maxWidth = doc.internal.pageSize.width - margin * 2; // Maximum width for each table
      const avgRowHeight = 5; // Average row height (adjusted to a smaller value)
    
      // Add the document title outside the loop
      doc.setFontSize(10);
      doc.text(`Paid Invoices`, 10, startY);
    
      data.forEach((purchaseData, index) => {
          const customerDetail = purchaseData.customer_detail[0];
          const paymentData = purchaseData.payments[0];
    
          const headers = [
              ["Date", "Purchase No", "Supplier Name", "Total Price", "Paid Amount", "Status"]
          ];
          const body = [
              [
                  purchaseData.date,
                  purchaseData.purchase_no,
                  customerDetail.customer_name, // Assuming "customer_name" is the supplier name
                  purchaseData.totalPrice, // Total Price calculation
                  purchaseData.paidAmount,
                  purchaseData.status
              ]
          ];
    
          // Calculate the height of the first table based on available space
          let tableHeight = body.length * avgRowHeight;
    
          autoTable(doc, {
              head: headers,
              body: body,
              startY: startY + 4,
              margin: { left: margin, right: margin },
              tableWidth: maxWidth,
              styles: { cellPadding: 1, fontSize: 8, valign: 'middle', halign: 'center' },
              headStyles: { fillColor: [15, 96, 96], textColor: 255, fontSize: 8, fontStyle: 'bold', minCellHeight: 8 },
              bodyStyles: { minCellHeight: 8, alternateRowStyles: { fillColor: [255, 204, 153] } },
              height: tableHeight // Set the height of the table
          });
    
          // Calculate the height of the nested table based on available space
          const productsHeaders = ["Product Name", "Batch No", "HSN", "No of Units", "Per Unit Price","Discount", "Tax Percentage", "Price"];
          const productsBody = purchaseData.product.map(product => [
              product.product_Name,
              product.batchNo,
              product.hsn,
              product.noOfUnit,
              product.perUnitPrice,
              product.discount,
              product.taxPer,
              product.price
          ]);
          console.log(productsBody.length)
          let productsTableHeight = productsBody.length * avgRowHeight;
    
          // Add a nested table for products
          autoTable(doc, {
              head: [productsHeaders],
              body: productsBody,
              startY: startY + tableHeight + 15, // Start directly below the complete body of the first table
              margin: { left: margin, right: margin },
              tableWidth: maxWidth,
              styles: { cellPadding: 1, fontSize: 8, valign: 'middle', halign: 'center' },
              headStyles: { fillColor: [0, 123, 255], textColor: 255, fontSize: 8, fontStyle: 'bold', minCellHeight: 8 },
              bodyStyles: { minCellHeight: 8, alternateRowStyles: { fillColor: [255, 204, 153] } },
              height: productsTableHeight // Set the height of the table
          });
    
          // Update startY position for the next set of tables
          startY += tableHeight+ productsTableHeight + 25;
    
          // Check if the next table exceeds the page height and add a new page if needed
          if (startY + minTableHeight + 30 > doc.internal.pageSize.height && index !== data.length - 1) {
              doc.addPage();
              startY = 7; // Reset startY position for new page
          }
      });
    
      doc.save(`Invoices.pdf`);
    };
    

    const searchHandler = (e) => {
        console.log(e.target.value)
        if (e.target.value.length>0) {
            const filterData = data.filter((val) => {
                return val.purchase_no.includes(e.target.value);
            });
            setViewData(filterData);
        }else if(e.target.value.length===0){
            setViewData(data);
        }
        setSearchKeyWord(e.target.value)
    }
    const paginationPrevHandler =(page)=>{
        
        if(page<1) return;
      setCurrent(page);
    }
    const paginationNextHandler = (page)=>{
        if(page*10-9>data.length) return;
        setCurrent(page);
    }
    const [expandedRow, setExpandedRow] = useState(null);

    const handleRowClick = (id) => {
      setExpandedRow(expandedRow === id ? null : id);
    };
  return (<>
      {viewToggle ? <Invoice viewPurchase={viewPurchase} setViewToggle={setViewToggle} /> : <></>}

    <div className='purchase'>
    <InvoiceNav location={location} pdfSaveHandler={pdfSaveHandler} searchKeyWord={searchKeyWord} searchHandler={searchHandler}/>
    <div className='purchase-table'>
        <table>
            <thead>
                <tr>
                <th>S No.</th>
                                <th>ID</th>
                                <th>Date</th>
                                <th >Customer Name </th>
                                <th >Total Price</th>
                                <th>Paid status</th>
                                <th>Due</th>
                                <th>Paid</th>
                                <th>Status</th>
                                <th>Action</th>
                </tr>
            </thead>
            <tbody>
            {
                                 viewData && viewData.slice(current*10-10, current*10).map((val, i) => (
                                    <React.Fragment key={val.id} >
                                    <tr onClick={() => handleRowClick(val.id)}>
                                        <td>{(current-1)*10 +i + 1}</td>
                                        <td>{val.purchase_no}</td>
                                        <td>{val.date}</td>
                                        <td>{val.customer_detail[0].customer_name}</td>
                                        <td>{val.totalPrice }</td>
                                        <td>{val.paidStatus}</td>
                                        <td>{val.dueAmount}</td>
                                        <td>{val.paidAmount}</td>

                                        
                                        <td className={val.status==="Approved"?'approve':val.status==="Rejected"?"reject":"pending"}>{val.status}</td>
                                        <td  className='action'><SlEye className='visible'  onClick={()=>(setViewToggle(true), setViewPurchase(val))}/></td>
                                    </tr>
                                    {expandedRow === val.id && (
                                      <tr>
                                        <td colSpan="11"> {/* Increase colspan to match the number of columns */}
                                          <table className='internaltable'>
                                            <thead >
                                              <tr >
                                                <th >Product Name</th>
                                                <th >Batch No</th>                 
                                                <th>HSN</th>
                                                <th >No of Units</th>
                                                <th>Per Unit Price(₹)</th>
                                                <th>Tax Percentage(%)</th>
                                                <th>Discount(%)</th>
                                                <th>Price(₹)</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {val.product.map((product) => (
                                                <tr key={product.productId}>
                                                  <td>{product.product_Name}</td>
                                                  <td>{product.batchNo}</td>
                                                  <td>{product.hsn}</td>
                                                  <td>{product.noOfUnit}</td>
                                                  <td>{product.perUnitPrice}</td>
                                                  <td>{product.taxPer}</td>
                                                  <td>{product.discount}</td>

                                                  <td>{product.price}</td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                ))
                            }
            </tbody>
        </table>
    </div>
   {viewData?.length>10 &&  <div className='managersuplier-pagination'>
                      
                      <MdKeyboardArrowLeft onClick={() => paginationPrevHandler(current - 1)}/>
                      <li>{current}</li>
                      <MdKeyboardArrowRight onClick={()=>paginationNextHandler(current+1)}/>
                 
              </div>}
</div>
  </>
  
  )
}

export default PaidInvoices
