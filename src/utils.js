import XLSX from "xlsx";

// https://www.programmersought.com/article/4000147640/
export const readExcelFile = (fileReader, files) => {
  console.log('Reading Excel file...')
  fileReader.onload = event => {
    try {
      const { result } = event.target;
      // Read the entire excel table object in binary stream
      // https://github.com/SheetJS/sheetjs/issues/703
      const workbook = XLSX.read(result, { type: "binary", cellDates: true, raw: false });
      let data = []; // store the acquired data
      // Traverse each worksheet for reading (here only the first table is read by default)
      for (const sheet in workbook.Sheets) {
        if (workbook.Sheets.hasOwnProperty(sheet)) {
          // Convert excel to json data using the sheet_to_json method
          // https://github.com/SheetJS/sheetjs/issues/159
          let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { defval: "" })
          // Store the header row information first to follow https://github.com/nadbm/react-datasheet standards
          let formattedSheetData = [Object.keys(sheetData[0]).map(headerCellValue => { return { value: headerCellValue, readOnly: true }; })]
          // Load all rows' values with the same format
          sheetData.forEach(row => { 
            formattedSheetData.push(Object.values(row).map(cellValue => { return { value: cellValue }; })) 
          })
          data = data.concat(formattedSheetData);
          break; // If you only take the first table, uncomment this line
        }
      }
      fileReader.loadedFileData = data;
    } catch (e) {
      // Here you can throw a related prompt with a file type error incorrect.
      alert("File could not be parsed. It may have been the wrong file type.");
      return;
    }
  };
  // Open the file in binary mode
  fileReader.readAsBinaryString(files[0]);
}