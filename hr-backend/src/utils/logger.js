// Szükséges modulok importálása a 'winston'-ból naplózáshoz
import winston, {
  createLogger as _createLogger,
  transports as _transports,
} from "winston";
const { format } = winston;
const { combine, timestamp, label, printf } = format; // Adott függvények kibontása a 'winston.format'-ból

// 'cli-color' importálása színes konzolkimenethez
import pkg from "cli-color";
const { green, red, blue, white, yellow, magenta } = pkg;

// DailyRotateFile importálása a napi naplófájl forgatáshoz
import DailyRotateFile from "winston-daily-rotate-file";

// Naplózó konfiguráció importálása egy külső konfigurációs fájlból
import { loggerConfig } from "../config/Configuration.js";

// Színek definiálása a különböző naplózási szintekhez a 'cli-color' segítségével
const colors = {
  info: green, // Zöld az információs szintű naplókhoz
  error: red, // Piros a hibaszintű naplókhoz
  debug: blue, // Kék a hibakeresési szintű naplókhoz
};

// Naplóüzenetek formázása konzolkimenethez
// Meghatározza, hogyan lesznek a naplók színesítve és formázva
const consoleLogFormat = printf(({ level, message, label, timestamp }) => {
  const color = colors[level] || white; // Válaszd a megfelelő színt vagy alapértelmezésben fehéret
  return `${yellow(timestamp)} ${color(level)}: ${message}`;
});

// Naplóüzenetek formázása fájlkimenethez
// A fájlba írt naplók nem tartalmaznak színeket, csak időbélyeget és üzenetet
const fileLogFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Függvény egy új Winston naplózó példány létrehozásához
export const createLogger = () => {
  // Szállítók (transport mechanizmusok) tömbjének definiálása (azaz hova lesznek a naplók írva)
  const transports = [
    new _transports.Console({
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Időbélyeg hozzáadása egyedi formátummal
        consoleLogFormat // A definiált konzol naplóformátum használata
      ),
    }),
  ];

  // Ha a fájlnaplózás engedélyezve van a konfigurációban, adjuk hozzá a fájlszállítót
  if (loggerConfig.logToFile) {
    transports.push(
      new DailyRotateFile({
        filename: "logs/application-%DATE%.log", // Naplófájl minta dátum forgatással a névben
        datePattern: "YYYY-MM-DD", // Naplófájlok napi forgatása
        maxSize: "10m", // A naplófájl maximális mérete (10 MB)
        maxFiles: "14d", // Naplók megőrzése 14 napig
        dirname: "logs", // Naplófájlok könyvtára
        format: combine(
          timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Időbélyeg hozzáadása a fájlnaplókhoz
          fileLogFormat // A definiált fájl naplóformátum használata
        ),
      })
    );
  }

  // Hozz létre és térj vissza egy új naplózóval a megadott szállítókkal és formátummal
  return _createLogger({
    level: loggerConfig.level, // Naplószint beállítása (pl. info, debug)
    format: combine(
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Időbélyeg hozzáadása minden naplóüzenethez
      consoleLogFormat // A konzolformátum használata alapértelmezett formázáshoz
    ),
    transports: transports, // Szállítók hozzáadása (konzol és opcionálisan fájl)
  });
};

// Alapértelmezett naplózó példány létrehozása
export const logger = createLogger();
