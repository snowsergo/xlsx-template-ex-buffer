import * as fs from "fs";
import { TemplateEngine, Pipes } from "./template-engine";
import { WorkSheetHelper } from "./worksheet-helper";
import { Workbook, Worksheet, Buffer } from "exceljs";

export function xlsxBuildByTemplate(
  data: any,
  templateFileName: string,
  pipes: Pipes = {}
): Promise<Buffer> {
  if (!fs.existsSync(templateFileName)) {
    return Promise.reject(`File ${templateFileName} does not exist`);
  }
  if (typeof data !== "object") {
    return Promise.reject("The data must be an object");
  }

  const workbook = new Workbook();
  return workbook.xlsx.readFile(templateFileName).then(() => {
    workbook.worksheets.forEach((worksheet: Worksheet) => {
      const wsh = new WorkSheetHelper(worksheet);
      const templateEngine = new TemplateEngine(wsh, data, pipes);
      templateEngine.execute();
    });

    return workbook.xlsx.writeBuffer();
  });
}

export function xlsxBuildByTemplateBuffer(
  data: any,
  template: Buffer,
  pipes: Pipes = {}
): Promise<Buffer> {
  console.log("Start libs");
  if (typeof data !== "object") {
    return Promise.reject("The data must be an object");
  }
  console.log("<<<new img");
  const workbook = new Workbook();
  return workbook.xlsx.load(template).then(() => {
    workbook.worksheets.forEach((worksheet: Worksheet) => {
      const wsh = new WorkSheetHelper(worksheet);
      const templateEngine = new TemplateEngine(wsh, data, pipes);
      templateEngine.execute();
    });
    console.log("<<<before return");
    return workbook.xlsx.writeBuffer();
  });
}
