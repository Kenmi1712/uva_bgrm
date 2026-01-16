import {
  get_geoentity_param_values,
  get_geoentities,
} from "./gs-client-0.3.js";
let chartLineColor = {
  max: "blue",
  min: "red",
  mean: "grey",
};

async function generateHighChartPolygonDataObj(dict) {
  let res = await fetch("https://vedas.sac.gov.in/ridam_server2b/info/", {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify({
      layer: "T0S0I1",
      args: {
        dataset_id: dict.datasetId,
        filter_nodata: "no",
        polygon: [
          [72.01537856672108, 24.295575511828382],
          [72.04693818343043, 24.291381541380478],
          [72.0250246945276, 24.25174853402273],
          [72.00573243539486, 24.2669516716168],
          [72.01537856672108, 24.295575511828382],
        ],
        indexes: [1],
        from_time: "20230601",
        to_time: "20240615",
        interval: 10,
        merge_method: dict.operation,
      },
    }),
    method: "POST",
  });

  let result = await res.json();
  let data = result["result"];

  return data;
}

async function getHighChartPolygon(layerConfig) {
  let data = "";
  let tools = layerConfig.tools[0];

  if (layerConfig.tools) {
    data = await tools.generateChartData(layerConfig.replaceDictionary);
    tools.series["data"] = data;
  }

  Highcharts.chart("chart-container", {
    title: {
      text: tools.series.title,
    },
    xAxis: {
      categories: tools.series.data[0],
    },
    yAxis: {
      title: {
        text: "Rainfall  (mm)",
      },
    },
    series: [
      {
        name: "Tokyo",
        data: data,
      },
    ],
  });
}
//Date range for algo, i.e what is first value,last value and date to display. As data is coming in +5.30GMT, giving date to display (required date+one day)(Ex required date is 5, give 6)
let date_range_dict = {
  5: [
    [1, 5, 3],
    [6, 10, 8],
    [11, 15, 13],
    [16, 20, 18],
    [21, 25, 23],
    [26, 31, 28],
  ],
  10: [
    [1, 10, 6],
    [11, 20, 16],
    [21, 31, 26],
  ],
  15: [
    [1, 15, 9],
    [15, 31, 24],
  ],
  30: [[1, 31, 16]],
};

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
async function getChartDataFromInfoAlgo(obj) {
  const filterConfig = {
    filter_nodata: obj.filter_nodata || "yes",
  };
  console.log(`27Feb receiving object in get chart`, obj);

  let bodyArgs = {
    dataset_id: obj.datasetId ? obj.datasetId : obj.dict.datasetId,
    filter_nodata: filterConfig.filter_nodata,
    lon: obj.lon,
    lat: obj.lat,
    indexes: [1],
    from_time: "19700101",
    to_time: "20300615",
  };

  if (obj.dict.compositeDateOptions && obj.dict.compositeDateOptions != 1) {
    // If compositeDateOptions exists
    let dateRange = date_range_dict[obj.dict.compositeDateOptions];
    bodyArgs.composite = true;
    bodyArgs.composite_operation = obj.operation
      ? obj.operation
      : obj.dict.operation;
    bodyArgs.composite_timestamp_profile = {
      profile_type: "date_range",
      date_range: dateRange,
    };
  } else {
    // If compositeDateOptions does not exist
    bodyArgs.composite = false;
  }

  let res = await fetch("https://vedas.sac.gov.in/ridam_server3/info/", {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      layer: "T5S1I3",
      args: bodyArgs,
    }),
    method: "POST",
  });

  let result = await res.json();
  let data = result["result"];
  // console.log

  return data;
}

async function getChartData(obj) {
  const filterConfig = {
    filter_nodata: obj.filter_nodata || "yes",
  };

  let bodyArgs = {
    dataset_id: obj.datasetId ? obj.datasetId : obj.dict.datasetId,
    filter_nodata: filterConfig.filter_nodata,
    lon: obj.lon,
    lat: obj.lat,
    indexes: [1],
    from_time: "19700101",
    to_time: "20300615",
  };

  if (obj.dict.compositeDateOptions && obj.dict.compositeDateOptions != 1) {
    // If compositeDateOptions exists
    let dateRange = date_range_dict[obj.dict.compositeDateOptions];
    bodyArgs.composite = true;
    bodyArgs.composite_operation = obj.operation
      ? obj.operation
      : obj.dict.operation;
    bodyArgs.composite_timestamp_profile = {
      profile_type: "date_range",
      date_range: dateRange,
    };
  } else {
    // If compositeDateOptions does not exist
    bodyArgs.composite = false;
  }

  let res = await fetch("https://vedas.sac.gov.in/ridam_server3/info/", {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      layer: "T0S0I0",
      args: bodyArgs,
    }),
    method: "POST",
  });

  let result = await res.json();
  let data = result["result"];

  return data;
}
export function processChartData(data, chartDataConfig) {
  console.log("5 data", data);
  let processedData = data.map((x) => {
    let dt = new Date(x[0]);
    let GMTTimeToMinus = 330 * 60 * 1000; // Data is in the form of +5:30 GMT. Hence minus 5:30 hours from the time.
    let timeStamp = dt.getTime() - GMTTimeToMinus;
    let val = x[1][0];
    // console.log('Raw value:', val,chartDataConfig, chartDataConfig && chartDataConfig.valueConvertor);
    // if (val < 0 ){
    //   return null;
    // }
    if (chartDataConfig && chartDataConfig.valueConvertor) {
      // console.log('Before conversion:', val);
      val = chartDataConfig.valueConvertor(val);
      // console.log('After conversion:', val);
    }

    if (
      chartDataConfig.datasetId == "T3S2P3" ||
      chartDataConfig.datasetId == "T3S1P2"
    ) {
      if (val && val !== null) {
        return [timeStamp, parseFloat(val.toFixed(2))];
      } else {
        return null;
      }
    } else if (chartDataConfig.datasetId == "T5S1P10") {
      if (val && val <= 3) {
        return [timeStamp, parseFloat(val.toFixed(2))];
      } else {
        return null;
      }
    } else if (chartDataConfig.datasetId == "T3S2P4") {
      if (val && val >= 0) {
        return [timeStamp, parseFloat(val.toFixed(2))];
      } else {
        return null;
      }
    } else {
      return [timeStamp, val];
    }
  });

  // Remove any null or undefined values from processed data
  processedData = processedData.filter((x) => x !== null && x !== undefined);
  // console.log('11Processed Data:', processedData);
  return processedData;
}
export function createSeparateArraysForXandYAxis(data, chartDataConfig) {
  let xAxisCategory = [];
  let processedData = data.map((x) => {
    let dt = new Date(x[0]);
    let GMTTimeToMinus = 330 * 60 * 1000; // Data is in the form of +5:30 GMT. Hence minus 5:30 hours from the time.
    let timeStamp = dt.getTime() - GMTTimeToMinus;
    let val = x[1][0];
    // console.log('Raw value:', val,chartDataConfig, chartDataConfig && chartDataConfig.valueConvertor);

    if (chartDataConfig && chartDataConfig.valueConvertor) {
      // console.log('Before conversion:', val);
      val = chartDataConfig.valueConvertor(val);
      // console.log('After conversion:', val);
    }

    if (
      chartDataConfig.datasetId == "T3S2P3" ||
      chartDataConfig.datasetId == "T3S1P2"
    ) {
      if (val && val !== null) {
        xAxisCategory.push(timeStamp);
        return parseFloat(val.toFixed(2));
      } else {
        return null;
      }
    } else if (chartDataConfig.datasetId == "T3S2P4") {
      if (val && val >= 0) {
        return [timeStamp, parseFloat(val.toFixed(2))];
      } else {
        return null;
      }
    } else {
      xAxisCategory.push(timeStamp);
      return val;
    }
  });

  // Remove any null or undefined values from processed data
  processedData = processedData.filter((x) => x !== null && x !== undefined);
  // console.log('11Processed Data:', processedData);
  return [xAxisCategory, processedData];
}

export function processChartDatanbr(data, chartDataConfig) {
  let processedData = data
    .map((x) => {
      let dt = new Date(x[0]);
      let timestamp = dt.getTime();
      let val = x[1][0];
      if (chartDataConfig && chartDataConfig.valueConvertor) {
        // console.log('Before conversion:', val);
        val = chartDataConfig.valueConvertor(val);
        // console.log('After conversion:', val);
      }
      return val !== 0 ? [timestamp, val] : null;
    })
    .filter((entry) => entry !== null);

  return processedData;
}

export function processMODISInpaintedChartData(data) {
  let processedData = data.map((x) => {
    let dt = new Date(x[0]);
    let timeStamp = dt.getTime();
    let val = x[1][0] / 10000;
    return [timeStamp, val];
  });

  return processedData;
}

export function processMODISInpaintedChartDataIF1(data) {
  // data = data.filter((x) => x > -3000);
  //
  let processedData = data
    .filter((x) => x[1][0] > -3000)
    .map((x) => {
      let dt = new Date(x[0]);
      let timeStamp = dt.getTime();
      let val = x[1][0] / 10000;
      return [timeStamp, val];
    });

  return processedData;
}

/*function processChartDatanbr(data) {
  let processedData = data
    .map((x) => {
      let dt = new Date(x[0]);
      let timestamp = dt.getTime();

      let val = x[1][0];

      return val !== 0 ? [timestamp, val] : null;
    })
    .filter((entry) => entry !== null);

  return processedData;
}
*/

export async function getProcessedDataFromRidam(layerConfig, tool, lon, lat) {
  let data = "";
  let tools = tool;
  let processedData = "";
  let locInfo = "";
  let series = [];

  if (tools.showAllMergeOperationSeries) {
    let operations = layerConfig.parameters.operation.options;

    for (let op = 0; op < operations.length - 1; op++) {
      data = await getChartData({
        dict: layerConfig.replaceDictionary,
        lon: lon,
        lat: lat,
        operation: operations[op].val,
      });
      processedData = processChartData(data);
      series.push({
        marker: {
          fillColor: "transparent",
        },
        name: operations[op].lbl,
        color: chartLineColor[operations[op].val],
        data: processedData,
      });
    }
  } else {
    data = await getChartData({
      dict: layerConfig.replaceDictionary,
      lon: lon,
      lat: lat,
      operation: "",
    });
    console.log("Processded data 26", processedData);
    processedData = processChartData(data);
    series.push({ name: tools.chart.name, data: processedData });
  }

  app.chartDataPending = false;
  locInfo = await getAddress(lon, lat);

  return [series, locInfo];
}

export function getYoYSeriesCalendarYear(data, chartDataConfig) {

  const IST_OFFSET = 330 * 60 * 1000; // IST offset in ms
  const yeardata = {};
  let dti = 0;

  while (dti < data.length) {
    let dateObj, value;

    if (Array.isArray(data[dti])) {
      dateObj = new Date(data[dti][0] + IST_OFFSET);
      value = data[dti][1];
    } else {
      dateObj = new Date(data[dti] + IST_OFFSET);
      value = data[dti + 1];
    }

    const actualYear = dateObj.getUTCFullYear();

    // Normalize date to fixed year 1970 for x-axis alignment
    const normalizedTimestamp = Date.UTC(
      1970,
      dateObj.getUTCMonth(),
      dateObj.getUTCDate()
    );

    if (!yeardata[actualYear]) yeardata[actualYear] = [];
    yeardata[actualYear].push([normalizedTimestamp, value]);

    dti++;
  }

  const series = [];
  const years = Object.keys(yeardata).sort();

  for (let i = 0; i < years.length; i++) {
    const year = years[i];
    series.push({
      type: "spline",
      name: year === "2099" ? "Normal" : year,
      data: yeardata[year],
      tooltip: {
        xDateFormat: "%d %b", // Show day and month
        pointFormatter: function () {
          return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${this.y}</b><br/>`;
        },
      },
      marker: { enabled: false },
      lineWidth: years.length - i < 2 ? 6 : 2,
      visible: years.length - i < 4,
    });
  }

  return series;
}


export function getYoYSeries(data, chartDataConfig) {
  // console.log(`Data in Yoy series`,data);
  var dti = 0;
  // console.log(`Data in Yoy series`,data[dti]);
  var yeardata = {};
  while (dti < data.length) {
    // console.log(`Data in while loop`);
    if (Array.isArray(data[dti])) {
      data[dti][0] = new Date(data[dti][0]); // assuming data[dti] is [timestamp, value]
    } else {
      // If it's a number or any other format, wrap it in an array first
      data[dti] = [new Date(data[dti]), data[dti + 1]]; // adjust based on data structure
    }

    var madj = 0;

    if (data[dti][0].getMonth() < 5) {
      madj = -1;
    }
    if (yeardata[(data[dti][0].getYear() + 1900 + madj).toString()]) {
      // yeardata[(data[dti][0].getYear() + 1900 + madj).toString()].push([Date.UTC(1970 - madj, data[dti][0].getUTCMonth(), data[dti][0].getUTCDate()), data[dti][1]]);
      yeardata[(data[dti][0].getYear() + 1900 + madj).toString()].push([
        Date.UTC(
          1970 - madj,
          data[dti][0].getUTCMonth(),
          data[dti][0].getUTCDate()
        ),
        data[dti][1],
      ]);
    } else {
      yeardata[(data[dti][0].getYear() + 1900 + madj).toString()] = [];

      yeardata[(data[dti][0].getYear() + 1900 + madj).toString()].push([
        Date.UTC(
          1970 - madj,
          data[dti][0].getUTCMonth(),
          data[dti][0].getUTCDate()
        ),
        data[dti][1],
      ]);
    }

    dti++;
  }

  var series = [];
  // console.log(`25 Feb Year data `,yeardata);
  var yearKeys = Object.keys(yeardata);
  // console.log(`25 Feb years key`,yearKeys);
  for (var yki = 0; yki < yearKeys.length; yki++) {
    var lwidth = yearKeys.length - yki < 2 ? 6 : 2;
    var vsb = yearKeys.length - yki < 4 ? true : false;

    // console.log(`yeardata[yearKeys[yki]]`,yeardata[yearKeys[yki]]);

    data = yeardata[yearKeys[yki]];

    // console.log(`Data is`,data);
    // console.log("chartDataConfig name",yearKeys[yki] , (parseInt(yearKeys[yki].slice(-2), 10) + 1), chartDataConfig.name);
    series.push({
      type: "spline",
      // name: yearKeys[yki] + "-" + (parseInt(yearKeys[yki].slice(-2), 10) + 1)+' ('+chartDataConfig.name+')',
      name: yearKeys[yki] + "-" + (parseInt(yearKeys[yki].slice(-2), 10) + 1),

      data: data,
      tooltip: {
        xDateFormat:
          "%d, %b ," +
          (yearKeys[yki] + "-" + (parseInt(yearKeys[yki], 10) + 1)),
      },
      marker: { enabled: false },
      //  color:param[click_count%param.length],
      lineWidth: lwidth,
      visible: vsb,
    });
  }

  console.log(`25 Feb series is`, series);
  return series;
}

export async function generateHighChartObjForS2NDVIProfileWithCMASK(
  layerConfig,
  tools,
  lon,
  lat
) {
  let series = [];
  let format = tools.params.chartType.selectedOption.format;
  let chartDataConfig = layerConfig.chartDataConfig;

  let combinedData = new Map();

  for (let i = 0; i < chartDataConfig.length; i++) {
    let dataObj = chartDataConfig[i];

    if (dataObj.name === "Sentinel-2") {
      let ndviData = await getChartData({
        datasetId: dataObj.datasetId,
        dict: layerConfig.replaceDictionary,
        lon: lon,
        lat: lat,
        operation: "",
      });

      let processedNdviData = processChartData(ndviData, dataObj);

      for (let item of processedNdviData) {
        let timestamp = new Date(item[0]).getTime();
        let value = item[1];

        if (!combinedData.has(timestamp)) {
          combinedData.set(timestamp, { ndvi: null, cloud: null });
        }
        combinedData.get(timestamp).ndvi = value;
      }
    }
  }

  try {
    let cloudMaskData = await getChartDataFromInfoAlgo({
      dict: layerConfig.replaceDictionary,
      lon: lon,
      lat: lat,
      datasetId: "T0S5P1",
      operation: "min",
    });

    const CLOUD_MATCH_THRESHOLD = 1 * 24 * 60 * 60 * 1000; // 3 days
    let cloudMap = new Map();

    // Process Cloud Mask Data
    for (let item of cloudMaskData) {
      let timestamp = new Date(item[0]).getTime();
      let value = item[1];

      if (value === 1) {
        cloudMap.set(timestamp, 1);
      }
    }

    // Match Cloud Data with NDVI Data
    for (let [cloudTimestamp, cloudValue] of cloudMap) {
      let matched = false;

      let closestTimestamp = null;
      let closestTimestampDiff = Infinity;

      for (let [ndviTimestamp, data] of combinedData) {
        const diff = Math.abs(cloudTimestamp - ndviTimestamp);

        // Find closest matching timestamp within threshold
        if (diff <= CLOUD_MATCH_THRESHOLD && diff < closestTimestampDiff) {
          closestTimestamp = ndviTimestamp;
          closestTimestampDiff = diff;
        }
      }

      // If a match is found, replace cloud mask with NDVI value at that timestamp
      if (closestTimestamp !== null) {
        let values = combinedData.get(closestTimestamp);
        values.cloud = cloudValue; // Cloud mask present (1)
        matched = true;
      }

      // If no match is found, still add the cloud timestamp with null NDVI value
      if (!matched) {
        combinedData.set(cloudTimestamp, { ndvi: null, cloud: cloudValue });
      }
    }
  } catch (error) {
    console.error(`Error fetching Cloud Mask data:`, error);
  }

  let ndviSeries = [];
  let cloudSeries = [];

  // Build series for NDVI and Cloud Mask (Scatter Plot for Cloud Mask)
  combinedData.forEach((values, timestamp) => {
    if (values.ndvi !== null) {
      ndviSeries.push([timestamp, values.ndvi]);
    }

    if (values.cloud !== null && values.cloud === 1) {
      cloudSeries.push([timestamp, values.ndvi !== null ? values.ndvi : null]); 
    }
  });

  series.push({
    type: "spline",
    name: tools.chart.name,
    data: ndviSeries,
    marker: { fillColor: "transparent" },
  });

  series.push({
    type: "scatter",
    name: "Cloud Mask",
    color: "#FF5733",
    data: cloudSeries,
    marker: {
      radius: 4, 
      symbol: "circle",
    },
    zIndex: 20,
    yAxis: 0,
    tooltip: {
      xDateFormat: "%d, %b, %Y", 
      pointFormat: `<b>{point.x:%d, %b, %Y}</b><br>{point.series.name}: {point.y}`, 
    },
  });

  let finalSeries = [];

  // Process YoY Series if needed
  if (tools.params.chartType.selectedOption.id === "YoYSeries") {
    let yoyNdviSeries = getYoYSeries(ndviSeries, layerConfig).map((series) => ({
      ...series,
      name: `${series.name}(NDVI)`,
      type: "spline",
     
    }));

    let yoyCloudSeries = getYoYSeries(cloudSeries, layerConfig).map(
      (series) => ({
        ...series,
        name: "Cloud Mask",
        type: "scatter", 
        color: "#FF5733",
        marker: { radius: 4, symbol: "circle" },
        lineWidth: 0,
        zIndex: 20,
        yAxis: 0,
        tooltip: {
          xDateFormat: "%d, %b, %Y", 
          pointFormat: `<b>{point.x:%d, %b, %Y}</b><br>{point.series.name}: {point.y}`, 
        },
      })
    );

    finalSeries.push(...yoyNdviSeries, ...yoyCloudSeries);
  } else {
    finalSeries.push(...series);
  }

  let locInfo = await getAddress(lon, lat);
  console.log("locinfo:", locInfo, "chartname:", tools.chart.name);
  let highChartObj = returnHighChartObj({
    locInfo:
      "<span style='color:rgb(4 136 208);font-weight:bold'>" +
      tools.chart.name +
      "</span><br>" +
      locInfo,
    format: format,
    yAxisTitle: tools.chart.yAxisTitle,
    yMin: tools.chart.yMin,
    yMax: tools.chart.yMax,
    series: finalSeries,
    
  });

  return highChartObj;
}

export async function generateHighChartObjFromRidam(
  layerConfig,
  tools,
  lon,
  lat
) {
  console.log(`28 Feb tools`, tools);
  let data = "";
  let processedData = "";
  let locInfo = "";
  let series = [];
  let format = tools.params.chartType.selectedOption.format;
  let chartDataConfig = layerConfig.chartDataConfig;

  if (tools.showAllMergeOperationSeries) {
    let operations = layerConfig.parameters.operation.options;

    // Add for loop here for more than one dataset
    let dataObj = chartDataConfig[0];
    for (let op = 0; op < operations.length - 1; op++) {
      data = await getChartData({
        dict: layerConfig.replaceDictionary,
        lon: lon,
        lat: lat,
        operation: operations[op].val,
        filter_nodata: "yes",
      });
      console.log(`Data is`, data);
      processedData = processChartData(data, dataObj);
      if (tools.params.chartType.selectedOption.id == "YoYSeries") {
        let yoySeries = getYoYSeries(processedData, dataObj);
        series.push(...yoySeries);
        // format = "{value:%d-%b}";
      } else {
        series.push({
          marker: {
            fillColor: "transparent",
          },
          type: chartDataConfig.type,
          name: operations[op].lbl,
          color: chartLineColor[operations[op].val],
          data: processedData,
          connectNulls: true,
        });
      }

      console.log(`Procesed chart daa`, processedData);
    }
  } else {
    for (let i = 0; i < chartDataConfig.length; i++) {
      let dataObj = chartDataConfig[i];

      data = await getChartData({
        dict: layerConfig.replaceDictionary,
        datasetId: dataObj.datasetId,
        lon: lon,
        lat: lat,
        operation: "",
      });

      if (tools.params.chartType.selectedOption.id === "YoYSeries") {
        processedData = processChartData(data, dataObj);

        let yoySeries = getYoYSeries(processedData, dataObj);

        // Enable connectNulls in your charting library configuration
        yoySeries = yoySeries.map((series) => ({
          ...series,
          connectNulls: true, // Automatically connect null values
        }));
        series.push(...yoySeries);
        // format = "{value:%d-%b}";
      } else {
        let processedData = processChartData(data, dataObj);

        if (dataObj.category) {
          let categories = dataObj.category;
          let local_data = [];

          for (let i = 0; i < processedData.length; i++) {
            for (let j = 0; j < categories.length; j++) {
              if (processedData[i][1] == categories[j].val) {
                local_data.push({
                  x: processedData[i][0],
                  y: processedData[i][1],
                  color: categories[j].colour,
                });
              }
            }
          }

          series.push({
            marker: {
              enabled: false,
            },
            name: dataObj.name,
            type: dataObj.type,
            data: local_data,
            connectNulls: true,
          });
        } else {
          series.push({
            marker: {
              enabled: false,
            },
            name: dataObj.name,
            type: dataObj.type,
            data: processedData,
            connectNulls: true,
          });
        }
      }
    }
  }

  // Handle merged series
  console.log(`28 Feb series is`, series);

  const categorizedData = {};

  // Categorize data based on the prefix of the "name" field
  series.forEach((item) => {
    // Extract the prefix before the first "("
    const key = item.name.split(" (")[0];

    // If the key doesn't exist, create an array
    if (!categorizedData[key]) {
      categorizedData[key] = [];
    }

    // Push the current item into the respective category
    categorizedData[key].push(item);
  });

  console.log("Categorized data", categorizedData);

  for (let seriesData of Object.values(categorizedData)) {
    console.log("Year is", seriesData);

    // Check if seriesData has more than one item
    if (seriesData.length > 1) {
      // Loop through the series array
      for (let i = 0; i < seriesData.length - 1; i++) {
        const currentSeries = seriesData[i];
        const nextSeries = seriesData[i + 1];

        // Extract the year part from the series name
        const currentSeriesNameOnlyYear = currentSeries.name.split(" ")[0];
        const nextSeriesNameOnlyYear = nextSeries.name.split(" ")[0];

        // If years match, proceed with comparing data
        if (currentSeriesNameOnlyYear === nextSeriesNameOnlyYear) {
          console.log("28 Feb entered in if loop");
          const currentData = currentSeries.data;
          const nextData = nextSeries.data;

          // Loop through currentData and nextData to find matching times
          for (let j = 0; j < currentData.length; j++) {
            for (let k = 0; k < nextData.length; k++) {
              if (currentData[j][0] == nextData[k][0]) {
                console.log("Time matched", currentData[j][0], nextData[k][0]);

                // Check if the value in nextData should be updated or deleted
                if (nextData[k][1] == 2 || nextData[k][1] == 4) {
                  nextData[k][1] = currentData[j][1];
                  nextSeries.type = "scatter";
                  nextSeries.lineWidth = 0;
                  nextSeries.marker = {
                    symbol: "circle",
                    radius: 5,
                    fillColor: "#FF0000",
                  };
                } else {
                  // Delete the entry in nextData if it doesn't meet the criteria
                  console.log(
                    "28 Feb entered in else loop",
                    k,
                    nextData.splice(k, 1)
                  );
                  k--; // Adjust the index after removal to prevent skipping elements
                }
              }
            }
          }
        }
      }
    }
  }

  app.chartDataPending = false;
  locInfo = await getAddress(lon, lat);

  let highChartObj = returnHighChartObj({
    locInfo:
      "<span style='color:rgb(4 136 208);font-weight:bold;font-size:14px;'>" +
      tools.chart.name +
      "</span><br>" +
      locInfo,
    format: format,
    yAxisTitle: tools.chart.yAxisTitle,
    yMax: tools.chart.yMax,
    yMin: tools.chart.yMin,

    series: series,
    tooltip: {
      dateTimeLabelFormats: {
        day: "{value:%d-%b-%Y}",
      },
    },
    // legend: {
    //   layout: 'horizontal',
    //   align: 'center',
    //   verticalAlign: 'bottom',
    //   itemMarginTop: 5,
    //   itemMarginBottom: 5,
    //   itemStyle: {
    //     fontSize: '12px',
    //     fontWeight: 'normal'
    //   }
    // }
  });

  return highChartObj;
}

function createHighchartsConfig(
  data,
  isYoY = false,
  parameter_name = "NDVI",
  title
) {
  const series = [];
  let chartTitle = "";
  // title = "";
  console.log("locaon from func", title);

  for (const locationKey in data) {
    const location = data[locationKey];
    const paramValues = location.param_values["21"];

    // chartTitle = location;

    const yearlyData = {};
    var num_series = 0;

    // Organize data by year
    for (const timestamp in paramValues) {
      const date = new Date(parseInt(timestamp) * 1000);
      let value = paramValues[timestamp].value.mean / (250).toFixed(2);

      if (value === 0) value = null;

      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      // For YoY, normalize date
      if (isYoY) {
        const baseYear = 1971;
        const adjustedYear = month >= 5 ? baseYear : baseYear + 1;
        const normalizedDate = new Date(adjustedYear, month, day).getTime();

        const agriYear =
          month >= 5 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
        if (!yearlyData[agriYear]) {
          yearlyData[agriYear] = [];
          num_series++;
        }
        yearlyData[agriYear].push([normalizedDate, value]);
      } else {
        if (!yearlyData["All Data"]) {
          yearlyData["All Data"] = [];
          num_series++;
        }
        yearlyData["All Data"].push([date.getTime(), value]);
      }
    }

    // Create series
    for (const year in yearlyData) {
      yearlyData[year].sort((a, b) => a[0] - b[0]);
      series.push({
        name: isYoY ? year : parameter_name,
        data: yearlyData[year],
        type: "line",
        visible: series.length >= Math.max(0, num_series - 3),
        marker: { radius: 2 }, // Reduced dot size
      });
    }
  }

  // Highcharts config object
  return {
    chart: { type: "line" },
    title: { text: title },
    xAxis: {
      type: "datetime",
      labels: {
        formatter: function () {
          const date = new Date(this.value); // Convert the timestamp
          return isYoY
            ? Highcharts.dateFormat("%b", date) // For YoY, show month only
            : Highcharts.dateFormat("%Y-%b", date); // Otherwise, show year-month
        },
        rotation: 0, // Rotate the labels for better readability
      },
    },
    yAxis: { title: { text: parameter_name } },
    tooltip: {
      formatter: function () {
        // Format the tooltip value to two decimal places
        const value = this.y.toFixed(2);
        return `${this.series.name}: ${value}`;
      },
    },

    series: isYoY ? series : [series[0]],
  };
}

export async function generateHighChartObjModisDistrict(
  layerConfig,
  tools,
  lon,
  lat,
  map
) {
  console.log(`28 Feb tools`, tools);
  let data = "";
  let processedData = "";
  let locInfo = "";
  let series = [];
  let format = tools.params.chartType.selectedOption.id;
  let chartDataConfig = layerConfig.chartDataConfig;
  var feature = "";
  console.log("Hello from district chart function calleddd");

  locInfo = await getAddress(lon, lat);
  console.log("dist", locInfo);
  const regex = /([A-Za-z\s]+ District, [A-Za-z\s]+)/;
  const locationText = String(locInfo.match(regex)?.[0] || "");
  console.log("locc is", locationText);

  var serverdat = await get_geoentity_param_values({
    geoentity_source_id: "19",
    prefix: "C91",
    params: "21",
    bbox: [lon, lat, lon + 0.000000001, lat + 0.0000001],
  });

  console.log("data is ", format);

  return createHighchartsConfig(
    serverdat,
    format != "fullSeries",
    "NDVI",
    locationText
  );
}

export async function generateHighChartObjModisTehsil(
  layerConfig,
  tools,
  lon,
  lat
) {
  console.log(`28 Feb tools`, tools);
  let data = "";
  let processedData = "";
  let locInfo = "";
  let series = [];
  let format = tools.params.chartType.selectedOption.id;
  let chartDataConfig = layerConfig.chartDataConfig;
  var feature = "";
  console.log("Hello from district chart function calleddd");
  locInfo = await getAddress(lon, lat);
  console.log("dist", locInfo);
  const regex = /([A-Za-z\s]+, [A-Za-z\s]+ District, [A-Za-z\s]+)/;
  const locationText = String(locInfo.match(regex)?.[0] || "");
  console.log("location is ", locationText);

  var geoentity_id = await get_geoentities({
    geoentity_source_id: "20",
    prefix: "C91",
    parents: null,
    bbox: [lon, lat, lon + 0.000000001, lat + 0.0000001],
  });

  console.log(geoentity_id);

  var serverdat = await get_geoentity_param_values({
    geoentity_source_id: "20",
    geoentity_id: geoentity_id[0].geoentity_id,
    params: "21",
  });

  console.log("data is ", format);

  return createHighchartsConfig(
    serverdat,
    format != "fullSeries",
    "NDVI",
    locationText
  );
}

export async function generateHighChartObjModisVillage(
  layerConfig,
  tools,
  lon,
  lat
) {
  console.log(`28 Feb tools`, tools);
  let data = "";
  let processedData = "";
  let locInfo = "";
  let series = [];
  let format = tools.params.chartType.selectedOption.id;
  let chartDataConfig = layerConfig.chartDataConfig;
  var feature = "";
  console.log("Hello from district chart function calleddd");

  locInfo = await getAddress(lon, lat);
  console.log("dist", locInfo);
  const regex = /([A-Za-z\s]+, [A-Za-z\s]+, [A-Za-z\s]+ District, [A-Za-z\s]+)/;
  const locationText = String(locInfo.match(regex)?.[0] || "");

  console.log("locc is", locationText);

  var geoentity_id = await get_geoentities({
    geoentity_source_id: 21,
    prefix: "C91",
    parents: null,
    bbox: [lon, lat, lon + 0.000000001, lat + 0.0000001],
  });

  console.log(geoentity_id);

  var serverdat = await get_geoentity_param_values({
    geoentity_source_id: "21",
    geoentity_id: geoentity_id[0].geoentity_id,
    params: "21",
  });

  console.log("data is ", format);

  return createHighchartsConfig(
    serverdat,
    format != "fullSeries",
    "NDVI",
    locationText
  );
}

// export async function generateHighChartObjFromRidam(
//   layerConfig,
//   tools,
//   lon,
//   lat
// ) {
//   let data = "";

//   let processedData = "";
//   let locInfo = "";
//   let series = [];
//   let format = "{value:%d-%b-%Y}";
//   if (tools) {
//     if (tools.allMergeOperations) {
//       let operations = layerConfig.parameters.operation.options;

//       for (let op = 0; op < operations.length - 1; op++) {
//         data = await getChartData({
//           dict: layerConfig.replaceDictionary,
//           lon: lon,
//           lat: lat,
//           operation: operations[op].val,
//         });
//         processedData = processChartData(data);
//         series.push({
//           marker: {
//             fillColor: "transparent",
//           },
//           name: operations[op].lbl,
//           color: chartLineColor[operations[op].val],
//           data: processedData,
//         });
//       }
//     } else {
//       data = await getChartData({
//         dict: layerConfig.replaceDictionary,
//         lon: lon,
//         lat: lat,
//         operation: "",
//       });

//       processedData = processChartData(data);

//       if (tools.params.chartType.selectedOption.id == "YoYSeries") {

//         series = getYoYSeries(processedData);

//         format = "{value:%d-%b}";
//       } else {
//         series.push({ name: tools.chart.name, data: processedData });
//       }

//     }

//     app.chartDataPending = false;
//     locInfo = await getAddress(lon, lat);
//   }

//   let highChartObj = returnHighChartObj({
//     locInfo:
//       "<span style='color:rgb(4 136 208);font-weight:bold'>" +
//       tools.chart.name +
//       "</span><br>" +
//       locInfo,
//     format: format,
//     yAxisTitle: tools.chart.yAxisTitle,
//     series: series,
//   });

//   return highChartObj;
// }

// export async function returnHighChartObj(obj) {
//   return {
//     title: {
//       text: obj.locInfo,
//     },
//     xAxis: {
//       type: "datetime",
//       labels: {
//         format: obj.format,
//       },
//       title: {
//         text: "Date",
//       },
//     },
//     yAxis: {
//       title: {
//         text: obj.yAxisTitle,
//       },
//     },

//     series: obj.series,
//   };
// }

export async function generateHighChartObjFromRidamForMODISInpainted(
  layerConfig,
  selectedTool,
  lon,
  lat
) {
  let data = "";
  let tools = selectedTool;
  let processedData = "";
  let locInfo = "";
  let series = [];
  let format = tools.params.chartType.selectedOption.format;
  console.log(`3March  format`, tools, format);

  console.log(`3March Layerconfig`, layerConfig);
  let chartDataConfig = layerConfig.chartDataConfig;
  let chartDataConfigLength = chartDataConfig.length;
  for (let i = 0; i < chartDataConfigLength; i++) {
    let currentChartDataObj = chartDataConfig[i];

    data = await getChartData({
      datasetId: currentChartDataObj.datasetId,
      dict: layerConfig.replaceDictionary,
      lon: lon,
      lat: lat,
      operation: "",
    });

    processedData = processMODISInpaintedChartData(data);
    processedData = processedData.filter((item) => item[1] !== 0);

    series.push({
      marker: {
        fillColor: "transparent",
      },
      name: currentChartDataObj.name,
      // color: currentChartDataObj.color,
      data: processedData,
    });
  }

  let dataPR = await getChartData({
    datasetId: "T3S1P3",
    dict: layerConfig.replaceDictionary,
    lon: lon,
    lat: lat,
    operation: "",
  });

  let processedDataPR = processChartData(dataPR, { datasetId: "T3S1P3" });

  //Get the max value between actual data and inpainted data.
  //Series 1 is inpainted data.
  series[1].data.forEach((x) => {
    let compareDataLength = series[0].data.length;
    let matchedIndex = "";
    for (let j = 0; j < compareDataLength; j++) {
      matchedIndex = "";
      //Compare timestamp of both the dataset
      if (series[0].data[j][0] == x[0]) {
        matchedIndex = j;

        break;
      }
    }

    //get the PR val
    let prDataLength = processedDataPR.length;
    let prVal = "";
    for (let y = 0; y < prDataLength; y++) {
      if (x[0] == processedDataPR[y][0]) {
        prVal = processedDataPR[y][1];
        break;
      }
    }
    if (matchedIndex) {
      if (prVal == 0) {
        x[1] = series[0].data[matchedIndex][1];
      } else {
        x[1] = Math.max(series[0].data[matchedIndex][1], x[1]);
      }
    }

    return x;
  });

  //Filter data and show only where dates are matching for both the data

  const matchingData = [];
  series[1].data.forEach((point1) => {
    series[0].data.forEach((point2) => {
      if (point1[0] === point2[0]) {
        matchingData.push({
          x: point2[0], // Assuming date is in a format suitable for Highcharts
          y: point2[1],
        });
      }
    });
  });

  series[0].data = matchingData;

  let finalSeries = [];
  if (tools.params.chartType.selectedOption.id == "YoYSeries") {
    let yoySeries = getYoYSeries(processedData, layerConfig);
    finalSeries.push(...yoySeries);
    // format = "{value:%d-%b}";
  } else {
    finalSeries = series;
  }

  app.chartDataPending = false;
  locInfo = await getAddress(lon, lat);

  let highChartObj = returnHighChartObj({
    locInfo:
      "<span style='color:rgb(4 136 208);font-weight:bold;font-size:14px;'>" +
      tools.chart.name +
      "</span><br>" +
      locInfo,
    format: format,
    yAxisTitle: tools.chart.yAxisTitle,
    series: finalSeries,
    tooltip: {
      dateTimeLabelFormats: {
        day: "{value:%d-%b-%Y}",
      },
    },
  });

  return highChartObj;
}

export function processChartDataMODISForecasted(data, numberOfDayToAdd) {
  // console.log("Data before dates", JSON.parse(JSON.stringify(data)));
  return data
    .filter((x) => {
      if (x[1] && x[1][0] !== 0 && x[1][0] !== null && x[1][0] !== undefined) {
        return true;
      } else {
        return false;
      }
    })
    .map((x) => {
      let val = x[1][0];

      let dt = new Date(x[0]);
      // console.log("Date before", dt);
      dt.setDate(dt.getDate() + numberOfDayToAdd);
      // console.log("Date after", dt);
      if (isNaN(dt)) {
        return null;
      }

      let formattedDate = dt.toISOString().split("T")[0].replace(/-/g, "");

      let prevDate = new Date(dt);
      prevDate.setDate(dt.getDate() - 7);
      let formattedPrevDate = prevDate
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "");

      const date = new Date(prevDate); // UTC time

      // Get the Unix timestamp (seconds)
      const unixTimestamp = Math.floor(date.getTime() / 1000);

      return [unixTimestamp * 1000, val];
    })
    .filter((x) => x !== null);
}

export async function generateHighChartObjFromRidamForMODISForecasted(
  layerConfig,
  selectedTool,
  lon,
  lat
) {
  let data = "";
  let tools = selectedTool;
  let processedData = "";
  let locInfo = "";
  let series = [];
  let format = tools.params.chartType.selectedOption.format;
  console.log(`3March  format`, tools, format);

  console.log(`3March Layerconfig`, layerConfig);
  let chartDataConfig = layerConfig.chartDataConfig;
  let chartDataConfigLength = chartDataConfig.length;

  let timeSeriesData = {};
  for (let i = 0; i < chartDataConfigLength; i++) {
    let currentChartDataObj = chartDataConfig[i];

    data = await getChartData({
      datasetId: currentChartDataObj.datasetId,
      dict: layerConfig.replaceDictionary,
      lon: lon,
      lat: lat,
      operation: "",
    });
    console.log(`3 rd March received data`, data);
    timeSeriesData[currentChartDataObj.identifier] =
      currentChartDataObj.processChartData(
        data,
        currentChartDataObj.numberOfDaysToAdd
      );

    console.log(`3rd March timeseries data`, timeSeriesData);
  }

  console.log(`3rd March timeseries data`, timeSeriesData);

  let normalModisData = timeSeriesData["normal"];
  let if1Data = timeSeriesData["IF1"];
  let if2Data = timeSeriesData["IF2"];

  var pred_count = 0;
  var modis_date_max = normalModisData[normalModisData.length - 1][0];
  var if1_date_max = if1Data[if1Data.length - 1][0];
  console.log(`Modis max date is`, modis_date_max);

  // Prediction Dates matching::::::
  if1Data = if1Data.filter(function (pred_point) {
    var pred_dates = pred_point[0];

    for (
      let data_items = 0;
      data_items < normalModisData.length;
      data_items++
    ) {
      let modis_date = normalModisData[data_items][0];
      console.log(
        `3rd march if1data dates`,
        pred_dates,
        modis_date_max,
        Math.abs(modis_date - pred_dates)
      );
      console.log(
        `3March If1  modis_date: ${modis_date},  pred_dates :${pred_dates}, modis_date_max:${modis_date_max},Abs:${Math.abs(
          modis_date - pred_dates
        )},different 3 day:${1000 * 60 * 60 * 24 * 3}`
      );
      if (
        Math.abs(modis_date - pred_dates) < 1000 * 60 * 60 * 24 * 3 ||
        pred_dates <= modis_date_max
      ) {
        console.log(`3rd march condition matched for IF!`);
        return false;
      }

      if (modis_date == pred_dates) {
        console.log(`3rd march condition matched for IF!111`);
        return false;
      }
      return true;
    }
  });

  if2Data = if2Data.filter(function (pred_point) {
    var pred_dates = pred_point[0];

    for (let data_items = 0; data_items < if1Data.length; data_items++) {
      let if1_date = if1Data[data_items][0];

      if (
        Math.abs(if1_date - pred_dates) < 1000 * 60 * 60 * 24 * 3 ||
        pred_dates <= if1_date_max
      ) {
        return false;
      }

      if (if1_date == pred_dates) {
        return false;
      }
      return true;
    }
    console.log(`3rd March if2 pred point`, pred_point);
    return true;
  });

  var if_combined_data = if1Data.concat(if2Data);

  console.log(
    "Combined prediction data",
    JSON.parse(JSON.stringify(if_combined_data))
  );
  console.log(`3rd march normal data after merged`, normalModisData);

  if (tools.params.chartType.selectedOption.id == "fullSeries") {
    let modisDataForSeries = normalModisData.map((point) => [
      point[0],
      point[1] / 10000,
    ]);
    series.push({
      name: "MODIS NDVI",
      data: modisDataForSeries,
      type: "spline",
    });

    series.push({
      name: "MODIS NDVI IF1 Prediction",
      data: if1Data.map((point) => [point[0], point[1] / 10000]),
      type: "scatter",
      marker: {
        enabled: true,
        symbol: "circle",
        radius: 5,
        fillColor: "#90D6FF",
      },
    });

    series.push({
      name: "MODIS NDVI IF2 Prediction",
      data: if2Data.map((point) => [point[0], point[1] / 10000]),
      type: "scatter",
      marker: {
        enabled: true,
        symbol: "circle",
        radius: 5,
        fillColor: "#235284",
      },
    });
  }
  // for (let i = 0; i < chartDataConfig.length; i++) {
  let dataObj = chartDataConfig[0];
  console.log("5 dataobj:", data);

  if (tools.params.chartType.selectedOption.id == "YoYSeries") {
    // Check if the NDVI data is complete, then add IF1 or IF2 as scatter
    normalModisData = normalModisData.map((point) => [
      point[0],
      point[1] / 10000,
    ]);

    let yoySeries = getYoYSeries(normalModisData, dataObj);
    let yoySeriesForecast = getYoYSeries(if_combined_data, {
      name: "Forecast",
      type: "scatter",
      processChartData: processChartDataMODISForecasted,
    });
    // console.log("youyseries:::",yoySeries)
    yoySeriesForecast.forEach((series) => {
      series.data = series.data.map((point) => {
        point[1] = point[1] / 10000;
        return point;
      });

      series.type = "scatter";
      series.connectNulls = false;
      series.marker = {
        enabled: true,
        symbol: "circle",
        radius: 5,
        fillColor: "#FFDB58",
      };
      series.lineWidth = 0;
    });
    const lastModisPoint =
      yoySeries[yoySeries.length - 1].data[
        yoySeries[yoySeries.length - 1].data.length - 1
      ]; // Last MODIS data point
    const firstForecastPoint = yoySeriesForecast[0].data[0];

    // Function to generate interpolated points between two points (start and end)
    function interpolatePoints(startPoint, endPoint, numPoints) {
      const points = [];

      for (let i = 0; i <= numPoints; i++) {
        const x =
          startPoint[0] + (endPoint[0] - startPoint[0]) * (i / numPoints);
        const y =
          startPoint[1] + (endPoint[1] - startPoint[1]) * (i / numPoints);

        points.push([x, y]);
      }

      return points;
    }

    // Interpolate 3 points between last MODIS point and first forecasted point
    const interpolatedPoints = interpolatePoints(
      lastModisPoint,
      firstForecastPoint,
      1
    );

    series.push({
      name: "Connection Points to Forecast",
      data: [
        [lastModisPoint[0], lastModisPoint[1]],
        ...interpolatedPoints.map((point) => [point[0], point[1]]),
        [firstForecastPoint[0], firstForecastPoint[1]],
      ],
      type: "scatter",
      marker: {
        enabled: true,
        symbol: "circle",
        radius: 5,
        fillColor: "#FFDB58",
      },
      tooltip: {
        pointFormat: null,
        enabled: false,
      },
      events: {
        mouseOver: function () {
          this.update({
            tooltip: {
              enabled: false,
            },
          });
        },
      },
    });
    // Add the YoY series to the chart
    series.push(...yoySeries);
    series.push(...yoySeriesForecast);
  }

  // }

  console.log("Highcharts series data:", series);

  app.chartDataPending = false;
  locInfo = await getAddress(lon, lat);

  let highChartObj = returnHighChartObj({
    locInfo:
      "<span style='color:rgb(4 136 208);font-weight:bold;font-size:14px;'>" +
      tools.chart.name +
      "</span><br>" +
      locInfo,
    format: format,
    yAxisTitle: tools.chart.yAxisTitle,
    series: series,
    tooltip: {
      dateTimeLabelFormats: {
        day: "{value:%d-%b-%Y}",
      },
    },
  });

  return highChartObj;
}

export async function generateHighChartObjFromRidambais2(
  layerConfig,
  tools,
  lon,
  lat
) {
  console.log(`28 Feb tools`, tools);
  let data = "";
  let processedData = "";
  let locInfo = "";
  let series = [];
  let format = tools.params.chartType.selectedOption.format;
  let chartDataConfig = layerConfig.chartDataConfig;

  if (tools.showAllMergeOperationSeries) {
    let operations = layerConfig.parameters.operation.options;

    // Add for loop here for more than one dataset
    let dataObj = chartDataConfig[0];
    for (let op = 0; op < operations.length - 1; op++) {
      data = await getChartData({
        dict: layerConfig.replaceDictionary,
        lon: lon,
        lat: lat,
        operation: operations[op].val,
      });
      console.log(`Data is`, data);
      processedData = processChartDatanbr(data, dataObj);
      if (tools.params.chartType.selectedOption.id == "YoYSeries") {
        let yoySeries = getYoYSeries(processedData, dataObj);
        series.push(...yoySeries);
        // format = "{value:%d-%b}";
      } else {
        series.push({
          marker: {
            fillColor: "transparent",
          },
          type: chartDataConfig.type,
          name: operations[op].lbl,
          color: chartLineColor[operations[op].val],
          data: processedData,
        });
      }

      console.log(`Procesed chart daa`, processedData);
    }
  } else {
    for (let i = 0; i < chartDataConfig.length; i++) {
      let dataObj = chartDataConfig[i];

      data = await getChartData({
        dict: layerConfig.replaceDictionary,
        datasetId: dataObj.datasetId,
        lon: lon,
        lat: lat,
        operation: "",
      });

      if (tools.params.chartType.selectedOption.id == "YoYSeries") {
        processedData = processChartData(data, dataObj);

        let yoySeries = getYoYSeries(processedData, dataObj);
        series.push(...yoySeries);
        // format = "{value:%d-%b}";
      } else {
        let processedData = processChartData(data, dataObj);

        if (dataObj.category) {
          let categories = dataObj.category;
          let local_data = [];

          for (let i = 0; i < processedData.length; i++) {
            for (let j = 0; j < categories.length; j++) {
              if (processedData[i][1] == categories[j].val) {
                local_data.push({
                  x: processedData[i][0],
                  y: processedData[i][1],
                  color: categories[j].colour,
                });
              }
            }
          }

          series.push({
            marker: {
              enabled: false,
            },
            name: dataObj.name,
            type: dataObj.type,
            data: local_data,
          });
        } else {
          series.push({
            marker: {
              enabled: false,
            },
            name: dataObj.name,
            type: dataObj.type,
            data: processedData,
          });
        }
      }
    }
  }

  // Handle merged series
  console.log(`28 Feb series is`, series);

  const categorizedData = {};

  // Categorize data based on the prefix of the "name" field
  series.forEach((item) => {
    // Extract the prefix before the first "("
    const key = item.name.split(" (")[0];

    // If the key doesn't exist, create an array
    if (!categorizedData[key]) {
      categorizedData[key] = [];
    }

    // Push the current item into the respective category
    categorizedData[key].push(item);
  });

  console.log("Categorized data", categorizedData);

  for (let seriesData of Object.values(categorizedData)) {
    console.log("Year is", seriesData);

    // Check if seriesData has more than one item
    if (seriesData.length > 1) {
      // Loop through the series array
      for (let i = 0; i < seriesData.length - 1; i++) {
        const currentSeries = seriesData[i];
        const nextSeries = seriesData[i + 1];

        // Extract the year part from the series name
        const currentSeriesNameOnlyYear = currentSeries.name.split(" ")[0];
        const nextSeriesNameOnlyYear = nextSeries.name.split(" ")[0];

        // If years match, proceed with comparing data
        if (currentSeriesNameOnlyYear === nextSeriesNameOnlyYear) {
          console.log("28 Feb entered in if loop");
          const currentData = currentSeries.data;
          const nextData = nextSeries.data;

          // Loop through currentData and nextData to find matching times
          for (let j = 0; j < currentData.length; j++) {
            for (let k = 0; k < nextData.length; k++) {
              if (currentData[j][0] == nextData[k][0]) {
                console.log("Time matched", currentData[j][0], nextData[k][0]);

                // Check if the value in nextData should be updated or deleted
                if (nextData[k][1] == 2 || nextData[k][1] == 4) {
                  nextData[k][1] = currentData[j][1];
                  nextSeries.type = "scatter";
                  nextSeries.lineWidth = 0;
                  nextSeries.marker = {
                    symbol: "circle",
                    radius: 5,
                    fillColor: "#FF0000",
                  };
                } else {
                  // Delete the entry in nextData if it doesn't meet the criteria
                  console.log(
                    "28 Feb entered in else loop",
                    k,
                    nextData.splice(k, 1)
                  );
                  k--; // Adjust the index after removal to prevent skipping elements
                }
              }
            }
          }
        }
      }
    }
  }

  app.chartDataPending = false;
  locInfo = await getAddress(lon, lat);

  let highChartObj = returnHighChartObj({
    locInfo:
      "<span style='color:rgb(4 136 208);font-weight:bold;font-size:14px;'>" +
      tools.chart.name +
      "</span><br>" +
      locInfo,
    format: format,
    yAxisTitle: tools.chart.yAxisTitle,
    yMax: tools.chart.yMax,
    yMin: tools.chart.yMin,

    series: series,
    tooltip: {
      dateTimeLabelFormats: {
        day: "{value:%d-%b-%Y}",
      },
    },
  });

  return highChartObj;
}

export async function generateHighChartObjFromRidamnbr(
  layerConfig,
  tools,
  lon,
  lat
) {
  console.log(`28 Feb tools`, tools);
  let data = "";
  let processedData = "";
  let locInfo = "";
  let series = [];
  let format = tools.params.chartType.selectedOption.format;
  let chartDataConfig = layerConfig.chartDataConfig;

  if (tools.showAllMergeOperationSeries) {
    let operations = layerConfig.parameters.operation.options;

    // Add for loop here for more than one dataset
    let dataObj = chartDataConfig[0];
    for (let op = 0; op < operations.length - 1; op++) {
      data = await getChartData({
        dict: layerConfig.replaceDictionary,
        lon: lon,
        lat: lat,
        operation: operations[op].val,
      });
      console.log(`Data is`, data);
      processedData = processChartDatanbr(data, dataObj);
      if (tools.params.chartType.selectedOption.id == "YoYSeries") {
        let yoySeries = getYoYSeries(processedData, dataObj);
        series.push(...yoySeries);
        // format = "{value:%d-%b}";
      } else {
        series.push({
          marker: {
            fillColor: "transparent",
          },
          type: chartDataConfig.type,
          name: operations[op].lbl,
          color: chartLineColor[operations[op].val],
          data: processedData,
        });
      }

      console.log(`Procesed chart daa`, processedData);
    }
  } else {
    for (let i = 0; i < chartDataConfig.length; i++) {
      let dataObj = chartDataConfig[i];

      data = await getChartData({
        dict: layerConfig.replaceDictionary,
        datasetId: dataObj.datasetId,
        lon: lon,
        lat: lat,
        operation: "",
      });

      if (tools.params.chartType.selectedOption.id == "YoYSeries") {
        processedData = processChartDatanbr(data, dataObj);

        let yoySeries = getYoYSeries(processedData, dataObj);
        series.push(...yoySeries);
        // format = "{value:%d-%b}";
      } else {
        let processedData = processChartDatanbr(data, dataObj);

        if (dataObj.category) {
          let categories = dataObj.category;
          let local_data = [];

          for (let i = 0; i < processedData.length; i++) {
            for (let j = 0; j < categories.length; j++) {
              if (processedData[i][1] == categories[j].val) {
                local_data.push({
                  x: processedData[i][0],
                  y: processedData[i][1],
                  color: categories[j].colour,
                });
              }
            }
          }

          series.push({
            marker: {
              enabled: false,
            },
            name: dataObj.name,
            type: dataObj.type,
            data: local_data,
          });
        } else {
          series.push({
            marker: {
              enabled: false,
            },
            name: dataObj.name,
            type: dataObj.type,
            data: processedData,
          });
        }
      }
    }
  }

  // Handle merged series
  console.log(`28 Feb series is`, series);

  const categorizedData = {};

  // Categorize data based on the prefix of the "name" field
  series.forEach((item) => {
    // Extract the prefix before the first "("
    const key = item.name.split(" (")[0];

    // If the key doesn't exist, create an array
    if (!categorizedData[key]) {
      categorizedData[key] = [];
    }

    // Push the current item into the respective category
    categorizedData[key].push(item);
  });

  console.log("Categorized data", categorizedData);

  for (let seriesData of Object.values(categorizedData)) {
    console.log("Year is", seriesData);

    // Check if seriesData has more than one item
    if (seriesData.length > 1) {
      // Loop through the series array
      for (let i = 0; i < seriesData.length - 1; i++) {
        const currentSeries = seriesData[i];
        const nextSeries = seriesData[i + 1];

        // Extract the year part from the series name
        const currentSeriesNameOnlyYear = currentSeries.name.split(" ")[0];
        const nextSeriesNameOnlyYear = nextSeries.name.split(" ")[0];

        // If years match, proceed with comparing data
        if (currentSeriesNameOnlyYear === nextSeriesNameOnlyYear) {
          console.log("28 Feb entered in if loop");
          const currentData = currentSeries.data;
          const nextData = nextSeries.data;

          // Loop through currentData and nextData to find matching times
          for (let j = 0; j < currentData.length; j++) {
            for (let k = 0; k < nextData.length; k++) {
              if (currentData[j][0] == nextData[k][0]) {
                console.log("Time matched", currentData[j][0], nextData[k][0]);

                // Check if the value in nextData should be updated or deleted
                if (nextData[k][1] == 2 || nextData[k][1] == 4) {
                  nextData[k][1] = currentData[j][1];
                  nextSeries.type = "scatter";
                  nextSeries.lineWidth = 0;
                  nextSeries.marker = {
                    symbol: "circle",
                    radius: 5,
                    fillColor: "#FF0000",
                  };
                } else {
                  // Delete the entry in nextData if it doesn't meet the criteria
                  console.log(
                    "28 Feb entered in else loop",
                    k,
                    nextData.splice(k, 1)
                  );
                  k--; // Adjust the index after removal to prevent skipping elements
                }
              }
            }
          }
        }
      }
    }
  }

  app.chartDataPending = false;
  locInfo = await getAddress(lon, lat);

  let highChartObj = returnHighChartObj({
    locInfo:
      "<span style='color:rgb(4 136 208);font-weight:bold;font-size:14px;'>" +
      tools.chart.name +
      "</span><br>" +
      locInfo,
    format: format,
    yAxisTitle: tools.chart.yAxisTitle,
    yMax: tools.chart.yMax,
    yMin: tools.chart.yMin,

    series: series,
    tooltip: {
      dateTimeLabelFormats: {
        day: "{value:%d-%b-%Y}",
      },
    },
  });

  return highChartObj;
}

export function returnHighChartObj(obj) {
  console.log(`Obj in return highchart is`, obj);
  return {
    title: {
      text: obj.locInfo,
    },
    xAxis: {
      categories: obj.series[0].categories,
      type: "datetime",
      labels: {
        format: obj.format,
      },
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: obj.yAxisTitle,
      },
      max: obj.yMax,
      min: obj.yMin,
    },
    series: obj.series,
    tooltip: {
      xDateFormat: "%d, %b, %Y",
      pointFormat: " {point.series.name}: {point.y}",
    },
  };
}
export async function generateHighChartObjFromRidamForMODISInpaintedIF(
  layerConfig,
  lon,
  lat
) {
  let data = "";
  let tools = layerConfig.tools[0];
  let processedData = "";
  let locInfo = "";
  let series = [];

  let chartDataConfig = layerConfig.chartDataConfig;

  let datasetIdArr = chartDataConfig.map((config) => ({
    datasetId: config.datasetId,
    name: config.name,
    color: config.color,
  }));

  // Iterate over datasetIdArr dynamically from chartDataConfig
  for (let i = 0; i < chartDataConfig.length; i++) {
    let currentDatasetConfig = chartDataConfig[i];
    let currentDatasetId = currentDatasetConfig.datasetId;

    data = await getChartData({
      datasetId: currentDatasetId.datasetId,
      dict: layerConfig.replaceDictionary,
      lon: lon,
      lat: lat,
      operation: "",
    });
    console.log("Data received:", data);
    processedData = processMODISInpaintedChartDataIF1(data);

    series.push({
      marker: {
        fillColor: "transparent",
      },
      name: currentDatasetId.name,
      color: currentDatasetId.color,
      data: processedData,
    });
  }

  let matchingDatasetConfig = chartDataConfig[0];
  if (matchingDatasetConfig) {
    let dataPR = await getChartData({
      datasetId: matchingDatasetConfig.datasetId,
      dict: layerConfig.replaceDictionary,
      lon: lon,
      lat: lat,
      operation: "",
    });

    let processedDataPR = processChartData(dataPR);

    // Get the max value between actual data and inpainted data.
    // Series 1 is inpainted data.
    series[1].data.forEach((x) => {
      let compareDataLength = series[0].data.length;
      let matchedIndex = "";
      for (let j = 0; j < compareDataLength; j++) {
        matchedIndex = "";
        // Compare timestamp of both the dataset
        if (series[0].data[j][0] == x[0]) {
          matchedIndex = j;
          break;
        }
      }

      // Get the PR value
      let prDataLength = processedDataPR.length;
      let prVal = "";
      for (let y = 0; y < prDataLength; y++) {
        if (x[0] == processedDataPR[y][0]) {
          prVal = processedDataPR[y][1];
          break;
        }
      }

      if (matchedIndex) {
        if (prVal == 0) {
          x[1] = series[0].data[matchedIndex][1];
        } else {
          x[1] = Math.max(series[0].data[matchedIndex][1], x[1]);
        }
      }
    });

    // Filter data and show only where dates are matching for both the data
    const matchingData = [];
    series[1].data.forEach((point1) => {
      series[0].data.forEach((point2) => {
        if (point1[0] === point2[0]) {
          matchingData.push({
            x: point2[0],
            y: point2[1],
          });
        }
      });
    });

    series[0].data = matchingData;
  }

  app.chartDataPending = false;
  locInfo = await getAddress(lon, lat);

  let highChartObj = returnHighChartObj({
    locInfo: locInfo,
    format: tools.chart.format,
    yAxisTitle: tools.chart.yAxisTitle,
    series: series,
  });

  return highChartObj;
}

async function getHighChart(layerConfig, lon, lat) {
  let tool = layerConfig.tools[0];

  let highChartObj = await tool.generateHighChartObj(layerConfig, lon, lat);
  if (highChartObj) {
    this.loadChartMsg = "";
    Highcharts.chart("chart-container", highChartObj);
  }
}
