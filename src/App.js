import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import "./App.css";
import ReactDataSheet from "react-datasheet";
import "react-datasheet/lib/react-datasheet.css";
import { readExcelFile } from "./utils";
import { Container, Box, Typography } from "@material-ui/core";
import SimpleTabs from "./SimpleTabs";

function App() {

  const [inputData, setInputData] = useState()
  const [outputData, setOutputData] = useState()

  // https://www.programmersought.com/article/4000147640/
  const onExcelImport = fileInput => {
    // Get the uploaded file object
    const { files } = fileInput.target;
    // Read the file through the FileReader object
    const fileReader = new FileReader();
    readExcelFile(fileReader, files);
    fileReader.onloadend = () => {
      // console.log(fileReader.loadedFileData)
      setInputData(fileReader.loadedFileData)
    }
  }

  const HelpTabContent = (props) => (
    <Box {...props}>
      <Typography>This is the help tab content.</Typography>
    </Box>
  )

  return (
    <Container component={Box} py={8}>
      <Box display="flex">
        <input id="file-upload" type="file" accept=".xlsx, .xls" onChange={onExcelImport} style={{ display: "none" }}/>
        <label htmlFor="file-upload">
          <Button variant="contained" color="primary" component="span">
            Upload File
          </Button>
        </label>
        <Box px={4}>
        { inputData ?
          <SimpleTabs>
              <Box label="Input Data">
                <Typography>
                  This is the data that was imported from the file upload. Feel free to change any values. All changes will update the output data in real time.
                </Typography>
                <ReactDataSheet
                  data={inputData}
                  valueRenderer={cell => cell.value.toString() }
                  onCellsChanged={changes => {
                    const grid = inputData.map(row => [...row]);
                    changes.forEach(({ cell, row, col, value }) => {
                      grid[row][col] = { ...grid[row][col], value };
                    });
                    setInputData(grid)
                  }}
                />
              </Box>
            { outputData &&
              <Box label="Output Data">
                <Typography>This is the output tab.</Typography>
              </Box>
            }
            <HelpTabContent label="Help" />
          </SimpleTabs>
        : <HelpTabContent />}
        </Box>
      </Box>
    </Container>
  );
}

export default App;
