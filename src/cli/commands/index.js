#!/usr/bin/env node

import { getList, getNameList, showTable } from "../units/index.js";

import chalk from "chalk";
import download from "download-git-repo";
import fs from "fs";
import inquirer from "inquirer";
import ora from "ora";
import symbols from "log-symbols";

const templateList = JSON.parse(
  fs.readFileSync(new URL("../template.json", import.meta.url))
);
chalk.level = 1;
export const add = () => {
  let question = [
    {
      name: "name",
      type: "input",
      message: "请输入模板名称：",
      validate(val) {
        if (!val) {
          return "Name is required!";
        } else if (templateList[val]) {
          return "Template has already existed!";
        } else {
          return true;
        }
      },
    },
    { name: "type", type: "list", choices: ["front", "end"], default: "front" },
    {
      name: "url",
      type: "input",
      message: "请输入模板地址：",
      validate(val) {
        if (val === "") return "The url is required!";
        return true;
      },
    },
  ];

  inquirer.prompt(question).then((answers) => {
    let { name, url, type } = answers;
    templateList[name] = { url: url.replace(/[\u0000-\u0019]/g, ""), type }; // 过滤 unicode 字符
    fs.writeFile(
      `${__dirname}/../template.json`,
      JSON.stringify(templateList),
      "utf-8",
      (err) => {
        if (err) console.log(chalk.red(symbols.error), chalk.red(err));
        console.log("\n");
        console.log(
          chalk.green(symbols.success),
          chalk.green("添加模板成功！！\n")
        );
        console.log(chalk.green("模板列表如下:  \n"));
        showTable();
      }
    );
  });
};
export const del = () => {
  let question = [
    {
      name: "name",
      type: "checkbox",
      message: "选择删除的模板（多选）：",
      choices: getNameList(),
    },
    {
      name: "isDelete",
      type: "confirm",
      message: "是否删除",
    },
  ];
  inquirer.prompt(question).then((answers) => {
    let { name, isDelete } = answers;
    if (name.length > 0 && isDelete) {
      for (let i of name) {
        delete templateList[i];
      }
      fs.writeFile(
        `${__dirname}/../template.json`,
        JSON.stringify(templateList),
        "utf-8",
        (err) => {
          if (err) console.log(chalk.red(symbols.error), chalk.red(err));
          console.log("\n");
          console.log(
            chalk.green(symbols.success),
            chalk.green(`删除${chalk.blue(name)}成功！！\n`)
          );
          console.log(chalk.green("模板列表如下: \n"));
          showTable();
        }
      );
    } else {
      console.log(chalk.yellow("取消删除！！"));
    }
  });
};
export const ls = () => {
  showTable();
};
export const init = (demo) => {
  if (templateList.length < 1) {
    console.log(chalk.red(`没有模板`));
  } else {
    let question = [
      {
        type: "list",
        message: "请选择一个脚手架：",
        name: "cliName",
        default: getList()[0],
        choices: getList(),
      },
      {
        name: "isInit",
        type: "confirm",
        message: "是否创建",
      },
    ];
    inquirer.prompt(question).then((answers) => {
      let { cliName, isInit } = answers;
      if (isInit) {
        const urlList = [templateList[cliName]];
        console.log("lfsz", urlList);
        console.log(chalk.yellow("开始拉取代码"));
        urlList.map((item) => {
          const spinner = ora("拉取:" + item.url);
          spinner.start();
          download(
            `direct:${item.url}`,
            `./${demo}`,
            { clone: true },
            (err) => {
              if (err) {
                spinner.fail();
                console.log(
                  chalk.red(symbols.error),
                  chalk.red(`拉取失败：${err}`)
                );
                return;
              }
              spinner.succeed();
              console.log(
                chalk.green(symbols.success),
                chalk.green("拉取成功")
              );
            }
          );
        });
      } else {
        console.log(chalk.yellow("取消创建"));
      }
    });
  }
};
