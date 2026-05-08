/**
 * Import master data for provinces and wards from Excel workbooks.
 *
 * Usage:
 *   npm run seed:locations -- ./src/modules/locations/seed/data/provinces.xlsx ./src/modules/locations/seed/data/wards.xlsx
 *
 * You can also pass one workbook if it contains both province and ward sheets:
 *   npm run seed:locations -- ./src/modules/locations/seed/data/locations.xlsx
 *
 * Expected province columns: Mã, Tên, Tên tiếng anh, Cấp
 * Expected ward columns: Mã, Tên, Tên tiếng anh, Cấp, Mã TP
 */
import * as dotenv from 'dotenv';
import ExcelJS from 'exceljs';
import { existsSync } from 'fs';
import mongoose, { Types } from 'mongoose';
import { extname, join, resolve } from 'path';
import { Province, ProvinceSchema } from '../schemas/province.schema';
import { Ward, WardSchema } from '../schemas/ward.schema';
import dns from 'node:dns';

// __dirname = src/modules/locations/seed → 4 levels up = apps/backend
const backendRoot = resolve(__dirname, '..', '..', '..', '..');
const baseEnvPath = join(backendRoot, '.env');
dotenv.config({ path: baseEnvPath });

const nodeEnv = process.env.NODE_ENV ?? 'development';
const envEnvPath = join(backendRoot, `.env.${nodeEnv}`);
if (existsSync(envEnvPath)) dotenv.config({ path: envEnvPath });

interface ProvinceSeedRow {
  code: string;
  name: string;
  englishName: string | null;
  level: string;
}

interface WardSeedRow extends ProvinceSeedRow {
  provinceCode: string;
}

function readRows(worksheet: ExcelJS.Worksheet): Record<string, unknown>[] {
  const headerRow = worksheet.getRow(1);
  const headers = new Map<number, string>();

  headerRow.eachCell((cell, columnNumber) => {
    const header = cell.text.trim();
    if (header.length > 0) {
      headers.set(columnNumber, header);
    }
  });

  const rows: Record<string, unknown>[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const record: Record<string, unknown> = {};

    for (const [columnNumber, header] of headers.entries()) {
      const text = row.getCell(columnNumber).text.trim();
      record[header] = text.length > 0 ? text : null;
    }

    if (Object.values(record).some((value) => value !== null)) {
      rows.push(record);
    }
  });

  return rows;
}

function normalizeHeader(value: string): string {
  return value.normalize('NFC').trim().toLowerCase();
}

function findValueByAlias(
  row: Record<string, unknown>,
  aliases: string[],
): unknown {
  for (const alias of aliases) {
    if (row[alias] !== undefined) {
      return row[alias];
    }
  }

  const normalizedAliases = new Set(aliases.map(normalizeHeader));
  const entry = Object.entries(row).find(([key]) =>
    normalizedAliases.has(normalizeHeader(key)),
  );

  return entry?.[1];
}

function readCell(
  row: Record<string, unknown>,
  aliases: string[],
): string | null {
  const value = findValueByAlias(row, aliases);

  if (value !== undefined && value !== null) {
    const text =
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
        ? String(value).trim()
        : '';
    if (text.length > 0 && text.toLowerCase() !== 'null') {
      return text;
    }
  }

  return null;
}

function isFooterRow(row: Record<string, unknown>): boolean {
  return Object.values(row).some((value) => {
    if (typeof value !== 'string') return false;

    const normalizedValue = normalizeHeader(value);
    return (
      normalizedValue.startsWith('số lượng') ||
      normalizedValue.startsWith('so luong') ||
      normalizedValue.startsWith('total')
    );
  });
}

function stripFooterRows(
  rows: Record<string, unknown>[],
): Record<string, unknown>[] {
  return rows.filter((row) => !isFooterRow(row));
}

function normalizeCode(value: string, length: number): string {
  const trimmedValue = value.trim();

  if (/^\d+$/.test(trimmedValue)) {
    return trimmedValue.padStart(length, '0');
  }

  return trimmedValue;
}

function requireCell(
  row: Record<string, unknown>,
  aliases: string[],
  rowNumber: number,
  entityName: string,
): string {
  const value = readCell(row, aliases);
  if (!value) {
    throw new Error(
      `${entityName} row ${rowNumber}: missing ${aliases.join(' / ')}`,
    );
  }

  return value;
}

function hasProvinceCodeColumn(row: Record<string, unknown>): boolean {
  return readCell(row, ['Mã TP', 'Ma TP', 'provinceCode']) !== null;
}

function detectWorksheets(workbook: ExcelJS.Workbook): {
  provinceWorksheet: ExcelJS.Worksheet;
  wardWorksheet: ExcelJS.Worksheet;
} {
  let provinceWorksheet: ExcelJS.Worksheet | undefined;
  let wardWorksheet: ExcelJS.Worksheet | undefined;

  for (const worksheet of workbook.worksheets) {
    const rows = readRows(worksheet);
    const firstDataRow = rows[0];

    if (!firstDataRow) continue;

    if (hasProvinceCodeColumn(firstDataRow)) {
      wardWorksheet ??= worksheet;
    } else {
      provinceWorksheet ??= worksheet;
    }
  }

  if (!provinceWorksheet || !wardWorksheet) {
    throw new Error(
      'Workbook must contain one province sheet and one ward sheet',
    );
  }

  return { provinceWorksheet, wardWorksheet };
}

async function readWorkbook(filePath: string): Promise<ExcelJS.Workbook> {
  if (extname(filePath).toLowerCase() !== '.xlsx') {
    throw new Error(
      `Unsupported Excel file: ${filePath}. Please save the file as .xlsx before importing.`,
    );
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  return workbook;
}

function findFirstDataWorksheet(
  workbook: ExcelJS.Workbook,
  entityName: string,
): ExcelJS.Worksheet {
  for (const worksheet of workbook.worksheets) {
    if (readRows(worksheet).length > 0) {
      return worksheet;
    }
  }

  throw new Error(`${entityName} workbook does not contain data rows`);
}

function parseProvinceRows(rows: Record<string, unknown>[]): ProvinceSeedRow[] {
  return stripFooterRows(rows).map((row, index) => ({
    code: normalizeCode(
      requireCell(row, ['Mã', 'Ma', 'code'], index + 2, 'Province'),
      2,
    ),
    name: requireCell(row, ['Tên', 'Ten', 'name'], index + 2, 'Province'),
    englishName: readCell(row, [
      'Tên tiếng anh',
      'Tên tiếng Anh',
      'Tên Tiếng Anh',
      'Ten tieng anh',
      'englishName',
    ]),
    level: requireCell(row, ['Cấp', 'Cap', 'level'], index + 2, 'Province'),
  }));
}

function parseWardRows(rows: Record<string, unknown>[]): WardSeedRow[] {
  return stripFooterRows(rows).map((row, index) => ({
    code: normalizeCode(
      requireCell(row, ['Mã', 'Ma', 'code'], index + 2, 'Ward'),
      5,
    ),
    name: requireCell(row, ['Tên', 'Ten', 'name'], index + 2, 'Ward'),
    englishName: readCell(row, [
      'Tên tiếng anh',
      'Tên tiếng Anh',
      'Tên Tiếng Anh',
      'Ten tieng anh',
      'englishName',
    ]),
    level: requireCell(row, ['Cấp', 'Cap', 'level'], index + 2, 'Ward'),
    provinceCode: normalizeCode(
      requireCell(row, ['Mã TP', 'Ma TP', 'provinceCode'], index + 2, 'Ward'),
      2,
    ),
  }));
}

async function seedLocations(): Promise<void> {
  const provinceWorkbookPath = process.argv[2];
  const wardWorkbookPath = process.argv[3];

  if (!provinceWorkbookPath) {
    throw new Error('Missing province Excel file path argument');
  }

  let provinceWorksheet: ExcelJS.Worksheet;
  let wardWorksheet: ExcelJS.Worksheet;

  if (wardWorkbookPath) {
    const [provinceWorkbook, wardWorkbook] = await Promise.all([
      readWorkbook(provinceWorkbookPath),
      readWorkbook(wardWorkbookPath),
    ]);

    provinceWorksheet = findFirstDataWorksheet(provinceWorkbook, 'Province');
    wardWorksheet = findFirstDataWorksheet(wardWorkbook, 'Ward');
  } else {
    const workbook = await readWorkbook(provinceWorkbookPath);
    const detectedWorksheets = detectWorksheets(workbook);
    provinceWorksheet = detectedWorksheets.provinceWorksheet;
    wardWorksheet = detectedWorksheets.wardWorksheet;
  }

  const provinces = parseProvinceRows(readRows(provinceWorksheet));
  const wards = parseWardRows(readRows(wardWorksheet));

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Missing required environment variable: MONGODB_URI');
  }

  dns.setServers(['8.8.8.8', '1.1.1.1']);
  await mongoose.connect(uri);

  const provinceModel = mongoose.model<Province>(Province.name, ProvinceSchema);
  const wardModel = mongoose.model<Ward>(Ward.name, WardSchema);

  const provinceIdByCode = new Map<string, Types.ObjectId>();

  for (const province of provinces) {
    const savedProvince = await provinceModel
      .findOneAndUpdate(
        { code: province.code },
        { $set: province },
        {
          returnDocument: 'after',
          setDefaultsOnInsert: true,
          upsert: true,
        },
      )
      .exec();

    provinceIdByCode.set(
      savedProvince.code,
      new Types.ObjectId(String(savedProvince._id)),
    );
  }

  for (const ward of wards) {
    const provinceId = provinceIdByCode.get(ward.provinceCode);
    if (!provinceId) {
      throw new Error(
        `Ward ${ward.code} references unknown province ${ward.provinceCode}`,
      );
    }

    await wardModel
      .findOneAndUpdate(
        { code: ward.code },
        {
          $set: {
            code: ward.code,
            name: ward.name,
            englishName: ward.englishName,
            level: ward.level,
            provinceCode: ward.provinceCode,
            provinceId,
          },
        },
        {
          returnDocument: 'after',
          setDefaultsOnInsert: true,
          upsert: true,
        },
      )
      .exec();
  }

  console.log(
    `[LocationsSeed] Imported ${provinces.length} provinces and ${wards.length} wards`,
  );

  await mongoose.disconnect();
}

seedLocations().catch(async (error) => {
  console.error('[LocationsSeed] Failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
