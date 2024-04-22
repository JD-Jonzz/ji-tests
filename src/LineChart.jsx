import { Line } from "@ant-design/charts";
import React from "react";

const LineChart = () => {
  const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const data = [];
  months.forEach((month) => {
    data.push({
      month: month,
      value: getRandomInt(1, 25),
    });
  });

  const config = {
    data,
    xField: "month",
    yField: "value",
    scale: { y: { domain: [0, 100] } },
    // point: {
    //   shapeField: "square",
    //   sizeField: 4,
    // },
    style: {
      lineWidth: 3,
      
    },
    shapeField: "smooth",
  };
  return (
    <Line
      {...config}
      interaction={{
        tooltip: {
          render: (info, data) => (
            <p className={"paragraph-small"} style={{ textAlign: "center" }}>
              {data.items[0].value}%
            </p>
          ),
          position: "top",
          crosshairs: false,
          markerStroke: "#fff",
          markerSizeField: 10,
          
        },
      }}
    />
  );
};

export default LineChart;
