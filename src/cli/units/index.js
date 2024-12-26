//展示表格

import fs from "fs";

const data = JSON.parse(
  fs.readFileSync(new URL("../template.json", import.meta.url))
);
export const showTable = () => {
  let table = [];
  for (let i in data) {
    let each = { name: i, url: data[i].url };
    table.push(each);
  }
  console.table(table);
};
export const getNameList = () => {
  let nameList = [];
  for (let i in data) {
    let listEach = { name: i };
    nameList.push(listEach);
  }
  return nameList;
};
export const getList = () => {
  let list = [];
  for (let i in data) {
    list.push(i);
  }
  return list;
};
