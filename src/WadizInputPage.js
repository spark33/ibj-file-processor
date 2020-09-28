import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import "./App.css";
import ReactDataSheet from "react-datasheet";
import "react-datasheet/lib/react-datasheet.css";
import { readExcelFile, getColumnIndex } from "./utils";
import { Container, Box, Typography } from "@material-ui/core";
import SimpleTabs from "./SimpleTabs";
import { useWadizContext } from "./WadizContext";
import { clone } from 'lodash';

const WadizInputPage = () => {

  const { activeTab, setActiveTab } = useWadizContext()
  const [inputData, setInputData] = useState()
  const [outputData, setOutputData] = useState()

  const transformData = () => {
    const inputHeaderRow = inputData[0]
    let calculatedData = [];
    const PACKAGE_SIZE = 2;

    // Helper Variables
    let funderNameIndex = getColumnIndex(inputHeaderRow, '서포터 성명')

    // Transform Header Row
    const outputHeaderRow = clone(inputHeaderRow)
    outputHeaderRow.splice(funderNameIndex + 1, 0, '서포터 성명 2')

    inputData.slice(1).forEach((row, i) => {
      // Row helper variables
      let calculatedRow = clone(row);
      let quantity = calculatedRow[getColumnIndex(inputHeaderRow, '수량')].value
      let deliveryOption = calculatedRow[getColumnIndex(inputHeaderRow, '옵션조건')].value
      let productName = calculatedRow[getColumnIndex(inputHeaderRow, '리워드')].value

      // 서포터 성명 칼럼 카피
      calculatedRow.splice(funderNameIndex + 1, 0, clone(row[funderNameIndex]))

      /*
        옵션조건이 단일배송지이고 수량이 1 보다 클 경우
      */
      if(deliveryOption === '단일배송지' && quantity > 1) {
        Array(Math.floor(quantity / PACKAGE_SIZE)).fill().forEach((_,i) => {
          let newRow = clone(calculatedRow)
          newRow[getColumnIndex(outputHeaderRow, '리워드')].value = '[패밀리팩] ' + productName
          calculatedData.push(newRow)
        })
        calculatedRow[getColumnIndex(outputHeaderRow, '수량')].value = 1
        calculatedData.push(calculatedRow)
      /*
        옵션조건이 여러배송지이고 수량이 1 보다 클 경우
      */
      } else if (deliveryOption === '여러배송지' && quantity > 1) {
        Array(quantity).fill().forEach((_,i) => {
          let newRow = clone(calculatedRow)
          if(i > 0) {
            newRow[getColumnIndex(outputHeaderRow, '배송지 주소')].value = ""
          }
          newRow[getColumnIndex(outputHeaderRow, '수량')].value = 1
          calculatedData.push(newRow)
        })
      } else {
        calculatedData.push(calculatedRow)
      }
    })

    setOutputData([outputHeaderRow, ...calculatedData])
  }

  useEffect(() => {
    if(inputData) {
      transformData()
    }
  }, [inputData])

  // https://www.programmersought.com/article/4000147640/
  const onExcelImport = fileInput => {
    // Get the uploaded file object
    const { files } = fileInput.target;
    // Read the file through the FileReader object
    const fileReader = new FileReader();
    readExcelFile(fileReader, files);
    fileReader.onloadend = () => {
      setInputData(fileReader.loadedFileData)
      setActiveTab(1)
    }
  }

  const HelpTabContent = (props) => (
    <Box {...props}>
      <Typography>This is the help tab content.</Typography>
    </Box>
  )

  return (
    <Container component={Box} py={8}>
      <Typography variant="h5">와디즈 작업용 시트</Typography>
      <Box mt={2}>
        <SimpleTabs activeTab={activeTab} setActiveTab={setActiveTab}>
          <Box label="Upload">
            <input id="file-upload" type="file" accept=".xlsx, .xls" onChange={onExcelImport} style={{ display: "none" }}/>
            <label htmlFor="file-upload">
              <Button variant="contained" color="primary" component="span">
                결제배송정보 업로드
              </Button>
            </label>
          </Box>
          { inputData &&
            <Box label="Input Data Preview">
              <Typography>
                This is the data that was imported from the file upload. Feel free to change any values. All changes will update the output data in real time.
              </Typography>
              <ReactDataSheet
                data={inputData}
                valueRenderer={cell => cell.value ? cell.value.toString() : '' }
                onCellsChanged={changes => {
                  const grid = inputData.map(row => [...row]);
                  changes.forEach(({ cell, row, col, value }) => {
                    grid[row][col] = { ...grid[row][col], value };
                  });
                  setInputData(grid)
                }}
              />
            </Box>
          }
          { outputData &&
            <Box label="Output Data">
              <Typography>This is the output tab.</Typography>
              <ReactDataSheet
                data={outputData}
                valueRenderer={cell => cell.value ? cell.value.toString() : '' }
                onCellsChanged={changes => {
                  const grid = inputData.map(row => [...row]);
                  changes.forEach(({ cell, row, col, value }) => {
                    grid[row][col] = { ...grid[row][col], value };
                  });
                  setInputData(grid)
                }}
              />
            </Box>
          }
          { inputData && 
            <Box label="Configurations">
              Configurations tab
            </Box>
          }
          <HelpTabContent label="Help" />
        </SimpleTabs>
      </Box>
    </Container>
  );
}

export default WadizInputPage;
