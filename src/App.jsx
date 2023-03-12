import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import './App.css'
import { AgGridReact } from 'ag-grid-react'

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function App() {
  const gridRef = useRef();

  const numberFormatter = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  });

  const myValueFormatter = p => numberFormatter.format(p.value);

  const [initialData, setInitialData] = useState([
    { "id": "1", "akun": "8692026968", "bank": "BCA", "kode": "014", "nama": "Andi", "nominal": 7200000, "pesan": "Sukses!" }
  ]);

  const [rowData, setRowData] = useState(initialData);

  const [columnDefs, setColumnDefs] = useState([
    { field: 'id', width: 50, headerName: 'ID', filter: false },
    { field: '', width: 50, checkboxSelection: true, headerCheckboxSelection: true, },
    { field: 'akun', width: 130, headerName: 'AKUN' },
    { field: 'bank', width: 90, headerName: 'BANK' },
    { field: 'kode', width: 90, headerName: 'KODE' },
    { field: 'nama', width: 120, headerName: 'NAMA' },
    { field: 'nominal', width: 150, headerName: 'NOMINAL', valueFormatter: myValueFormatter },
    { field: 'pesan', width: 120, headerName: 'PESAN' }
  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
  }), []);

  // fetch('http://localhost:3001/initialData')
  //   .then(response => response.json())
  //   .then(data => setRowData(data))
  //   .catch(error => console.log(error));

  const [newRowData, setNewRowData] = useState({
    id: "",
    akun: "",
    bank: "",
    kode: "",
    nama: "",
    nominal: "",
    pesan: ""
  });

  const handleNewRowChange = useCallback(e => {
    const { name, value } = e.target;
    setNewRowData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }, []);

  const handleAddRow = useCallback(() => {
    setRowData(prevState => [...prevState, newRowData]);
    setNewRowData({
      id: "",
      akun: "",
      bank: "",
      kode: "",
      nama: "",
      nominal: "",
      pesan: ""
    });
  }, [newRowData]);

  const cellClickedListener = useCallback(e => {
    console.log('cellClicked', e);
  })

  useEffect(() => {
    fetch('http://localhost:3001/initialData')
      .then(result => result.json())
      .then(rowData => setRowData(rowData))
  }, []);

  const rejectClicked = useCallback(e => {
    gridRef.current.api.deselectAll();
  });

  const acceptClicked = useCallback(e => {
    gridRef.current.api.selectAll();
  });

  return (
    <div className='ag-theme-alpine' style={{ height: 400, width: 800 }}>
      <button onClick={rejectClicked}>Reject</button>
      <button onClick={acceptClicked}>Approve</button>
      <button onClick={handleAddRow}>Add</button>
      <AgGridReact rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} rowSelection='multiple' animateRows={true} onCellClicked={cellClickedListener} ref={gridRef} />
    </div>
  )
}

export default App