import { Column } from "@ant-design/charts";
import { forEach, groupBy } from "lodash-es";
import React from "react";

const BarsChart = () => {
  const annotations = [];
  forEach(groupBy(data, "month"), (values, k) => {
    const value = values.reduce((a, b) => a + b.value, 0);
    annotations.push({
      type: "text",
      data: [k, value],
      xField: "month",
      yField: "value",
      tooltip: false,
    });
  });

  const config = {
    data,
    annotations,
    stack: true,
    xField: "month",
    yField: "value",
    colorField: "type",
    sizeField: 20,
    legend: false,
    scale: {
      y: { domain: [0, 100] },
      color: { range: ["#0E44A8", "#2F80ED", "#D1E1FF"] },
    },
    interaction: {
      elementHighlightByColor: false,
      tooltip: {
        render: (info, data) => <RenderTooltip items={data.items} />,
        position: "top",
      },
    },
  };

  return <Column {...config} />;
};

const RenderTooltip = ({ items }) => {
  const Rowtip = ({ name, value, icon }) => (
    <div className="flex-between-center gap-xl">
      <div className="flex-y-center gap-sm">
        {icon}
        <p className={"paragraph-small"} style={{ color: "#3B4D6F" }}>{name}</p>
      </div>
      <p className={"paragraph-small"}>{value}</p>
    </div>
  );
  const valuesSum = items?.reduce((a, b) => a + b.value, 0);
  return (
    <div className="flex-col relative">
      <Arrow 
      style={{
        position: "absolute",
        left: "50%",
        bottom: "-14px",
        transform: "translateX(-50%)",
      }}
      />
      <Rowtip name={"Damaged URLs"} value={valuesSum} icon={<AllSvg />} />
      {items?.map((item) => (
        <Rowtip
          key={item.name}
          name={item.name}
          value={item.value || "--"}
          icon={<Svg color={item.color} />}
        />
      ))}
    </div>
  );
};

const Arrow = ({...props}) => (
  <svg
    width="16"
    height="8"
    viewBox="0 0 16 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16 0H0L6.58579 6.58579C7.36684 7.36684 8.63317 7.36684 9.41421 6.58579L16 0Z"
      fill="white"
    />
  </svg>
);

const Svg = ({ color }) => {
  return (
    <svg
      width="12"
      height="13"
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="0.5" width="12" height="12" rx="2" fill={color} />
    </svg>
  );
};
const AllSvg = () => {
  return (
    <svg
      width="12"
      height="13"
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="0.5" width="12" height="12" rx="2" fill="#D1E1FF" />
      <rect y="3.5" width="12" height="9" rx="2" fill="#5A88FF" />
      <rect y="6.5" width="12" height="6" rx="2" fill="#0E44A8" />
    </svg>
  );
};

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
const types = ["Warning", "Issue", "Opportunity"];
const data = [];
months.forEach((month) => {
  types.forEach((type) => {
    data.push({
      month: month,
      value: getRandomInt(5, 25),
      type: type,
    });
  });
});

export default BarsChart;
