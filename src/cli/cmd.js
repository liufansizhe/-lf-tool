//脚手架命令

import { add, del, init, ls } from "./commands/index.js";

import { Command } from "commander";
import fs from "fs";

const pck = fs.readFileSync(new URL("../../package.json", import.meta.url));
const cmd = new Command();
cmd.version(pck.version);
cmd
  .command("ls")
  .description("【脚手架】查看模板")
  .action(() => {
    ls();
  });
cmd
  .command("add")
  .description("【脚手架】添加模板")
  .action(() => {
    add();
  });
cmd
  .command("del")
  .description("【脚手架】删除模板")
  .action(() => {
    del();
  });
cmd
  .command("init [demo]")
  .description("【脚手架】项目初始化")
  .action((demo) => {
    init(demo);
  });
cmd.parse();
